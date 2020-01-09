/// <reference types="./folder-hash" />
import fs from 'fs';
import { hashElement } from 'folder-hash';
import { spawn } from 'promisify-child-process';
import packages from './utils/packages';

async function main() {
  try {
    const results = await packages(async ({ appName, path, log, logStdio }) => {
      const { hash: buildHash } = await hashElement(`${path}/build`, {
        algo: 'sha256',
        encoding: 'hex',
      });
      log('build hash:', buildHash);
      await logStdio(
        spawn(
          'docker',
          `build -t devops-lab/${appName} -t gcr.io/${process.env.GKE_PROJECT}/${appName}:${buildHash} -t gcr.io/${process.env.GKE_PROJECT}/${appName}:latest ${path}`.split(
            ' ',
          ),
        ),
      );
      await logStdio(spawn('docker', `push gcr.io/${process.env.GKE_PROJECT}/${appName}`.split(' ')));
      return buildHash;
    });

    fs.writeFileSync('build-hashes.json', JSON.stringify(results, null, 2));
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

main();
