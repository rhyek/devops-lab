import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import * as k8s from '@pulumi/kubernetes';
import { getKubeConfig } from './utils/kubeconfig';

const gcpConfig = new pulumi.Config('gcp');

const name = 'iac-cluster';

const cluster = new gcp.container.Cluster(name, {
  initialNodeCount: 1,
  releaseChannel: { channel: 'REGULAR' },
  nodeConfig: {
    machineType: 'n1-standard-1',
    preemptible: true,
    oauthScopes: [
      'https://www.googleapis.com/auth/compute',
      'https://www.googleapis.com/auth/devstorage.read_only', // required to pull docker images from the project's registry
      'https://www.googleapis.com/auth/logging.write',
      'https://www.googleapis.com/auth/monitoring',
    ],
  },
});

export const clusterName = cluster.name;

// Manufacture a GKE-style kubeconfig. Note that this is slightly "different"
// because of the way GKE requires gcloud to be in the picture for cluster
// authentication (rather than using the client cert/key directly).
export const kubeconfig = getKubeConfig(cluster);

const tcpPort = 8080;

// Create a Kubernetes provider instance that uses our cluster from above.
const clusterProvider = new k8s.Provider(name, { kubeconfig });

type AppOptions = {
  replicas?: number;
  path?: string | string[];
};

const pathConfigurations: { name: string | pulumi.Output<string>; path: string }[] = [];

const buildHashes: { appName: string; result: string }[] = JSON.parse(process.env.BUILD_HASHES!);

function createApp(name: string, options: AppOptions) {
  const project = gcpConfig.require('project');
  const buildHash = buildHashes.find(b => b.appName === name);
  if (!buildHash) {
    throw new Error(`Build hash not found for app ${name}.`);
  }
  const image = `gcr.io/${project}/${name}:${buildHash.result}`;
  const replicas = options.replicas ?? 1;
  const labels = { app: name };
  new k8s.apps.v1.Deployment(
    name,
    {
      spec: {
        replicas,
        selector: {
          matchLabels: labels,
        },
        template: {
          metadata: {
            labels,
          },
          spec: {
            containers: [
              {
                name,
                image,
                ports: [
                  {
                    containerPort: tcpPort,
                  },
                ],
                resources: {
                  requests: {
                    cpu: '10m',
                  },
                },
              },
            ],
          },
        },
      },
    },
    { provider: clusterProvider },
  );
  const nodePort = new k8s.core.v1.Service(
    name,
    {
      spec: {
        type: 'NodePort',
        selector: labels,
        ports: [
          {
            port: tcpPort,
            targetPort: tcpPort,
          },
        ],
      },
    },
    { provider: clusterProvider },
  );

  if (typeof options.path !== 'undefined') {
    let paths: string[] = typeof options.path === 'string' ? [options.path] : options.path;
    for (const path of paths) {
      pathConfigurations.push({
        name: nodePort.metadata.name,
        path,
      });
    }
  }
}

new k8s.core.v1.LimitRange( // this allows me to just use 1 node.
  'default-limit',
  {
    spec: {
      limits: [
        {
          // will set request on containers
          defaultRequest: {
            cpu: '10m',
            memory: '128M',
          },
          // will set limit on containers
          default: {
            cpu: '20m',
            memory: '256M',
          },
          // will set
          max: {
            cpu: '200m',
            memory: '512M',
          },
          type: 'Container',
        },
      ],
    },
  },
  { provider: clusterProvider },
);

createApp('web', { path: '/*' });
createApp('todos', { path: ['/todos', '/todos/*'] });

const address = new gcp.compute.GlobalAddress('all-ip', {
  addressType: 'EXTERNAL',
  ipVersion: 'IPV4',
  // networkTier: 'STANDARD', // default is PREMIUM
});

export const staticIp = address.address;

new k8s.networking.v1beta1.Ingress(
  'all-ingress',
  {
    metadata: {
      annotations: {
        'kubernetes.io/ingress.global-static-ip-name': address.name,
        'kubernetes.io/ingress.class': 'gce',
      },
    },
    spec: {
      rules: [
        {
          http: {
            paths: pathConfigurations.map(({ name, path }) => ({
              path,
              backend: {
                serviceName: name,
                servicePort: tcpPort,
              },
            })),
          },
        },
      ],
    },
  },
  { provider: clusterProvider },
);
