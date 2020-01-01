#!/bin/sh
BUILD_HASH=$(node $(dirname "$0")/gen-hash.js ./build)
DEPLOYED_BUILD_HASH=$(kubectl get deployment $LERNA_PACKAGE_NAME -o jsonpath='{.metadata.annotations.buildHash}')
APP=$LERNA_PACKAGE_NAME

if [ "$BUILD_HASH" = "$DEPLOYED_BUILD_HASH" ]; then
  echo "Build hashes are equal. Not deploying."
else
  echo "Deploying because [$BUILD_HASH] is different from [$DEPLOYED_BUILD_HASH]."
  docker build -t devops-lab/$APP -t gcr.io/$GKE_PROJECT/$APP:$GITHUB_SHA -t gcr.io/$GKE_PROJECT/$APP:latest -f ./src/$APP/Dockerfile .
  docker push gcr.io/$GKE_PROJECT/$APP
  kubectl set image deployments/$APP $APP=gcr.io/$GKE_PROJECT/$APP:$GITHUB_SHA
  kubectl annotate deployment $APP buildHash=$BUILD_HASH --overwrite
fi

echo "Done."
