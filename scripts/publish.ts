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
      log('Build hash:', buildHash);
      const imageRepository = `gcr.io/${process.env.GKE_PROJECT}/${appName}`;
      const { stdout } = await spawn(
        'gcloud',
        `container images list-tags --filter=tags:${buildHash} --format=json ${imageRepository}`.split(' '),
        { encoding: 'utf8' },
      );
      if (!stdout) {
        throw new Error('stdout is empty');
      }
      const foundList: object[] = JSON.parse(stdout.toString());
      if (foundList.length === 0) {
        log('Tag does not exist in registry. Building...');
        const taggedImageName = `${imageRepository}:${buildHash}`;
        await logStdio(spawn('docker', `build -t ${taggedImageName} ${path}`.split(' ')));
        await logStdio(spawn('docker', `push ${taggedImageName}`.split(' ')));
      } else {
        log('Tag exists in registry. Skipping build.');
      }
      return buildHash;
    });

    fs.writeFileSync('build-hashes.json', JSON.stringify(results, null, 2));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();
