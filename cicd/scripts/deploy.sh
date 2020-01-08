#!/bin/sh
APP=$LERNA_PACKAGE_NAME
APP_FOLDER=$LERNA_ROOT_PATH/src/$APP
BUILD_HASH=$(node $(dirname "$0")/gen-hash.js $APP_FOLDER/build)
# DEPLOYED_BUILD_HASH=$(kubectl get deployment $APP -o jsonpath='{.metadata.annotations.buildHash}')

echo "BUILD_HASH=$BUILD_HASH"
# echo "DEPLOYED_BUILD_HASH=$DEPLOYED_BUILD_HASH"

# if [ "$BUILD_HASH" = "$DEPLOYED_BUILD_HASH" ]; then
#   echo "Build hashes are equal. Not deploying."
# else
#   echo "Build hashes are different. Deploying."
  docker build -t devops-lab/$APP -t gcr.io/$GKE_PROJECT/$APP:$BUILD_HASH -t gcr.io/$GKE_PROJECT/$APP:latest $APP_FOLDER
  docker push gcr.io/$GKE_PROJECT/$APP
  # kubectl set image deployments/$APP $APP=gcr.io/$GKE_PROJECT/$APP:$GITHUB_SHA
  # kubectl annotate deployment $APP buildHash=$BUILD_HASH --overwrite
# fi

echo "Done."
