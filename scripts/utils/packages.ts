/// <reference types="./get-monorepo-packages" />
import path from 'path';
import getPackages from 'get-monorepo-packages';
import { ChildProcessPromise } from 'promisify-child-process';

type Params = {
  appName: string;
  path: string;
  log: (...args: any[]) => void;
  logStdio: (childProcessPromise: ChildProcessPromise) => ChildProcessPromise;
};

export default async function packages<T>(
  fn: (params: Params) => Promise<T>,
): Promise<{ appName: string; result: T }[]> {
  const packages = getPackages(path.resolve(__dirname, '../..'));
  const results = await Promise.all(
    packages.map(async pkg => {
      const {
        location,
        package: { name: appName },
      } = pkg;

      function log(...args: any[]) {
        console.log(`${appName}:`, ...args);
      }

      function logStdio(childProcessPromise: ChildProcessPromise) {
        function handleData(chunk: Buffer) {
          const lines = chunk
            .toString()
            .trimRight()
            .split('\n');
          for (const line of lines) {
            log(line);
          }
        }
        childProcessPromise.stdout?.on('data', handleData);
        childProcessPromise.stderr?.on('data', handleData);
        return childProcessPromise;
      }

      const result = await fn({ appName, path: location, log, logStdio });

      return {
        appName,
        result,
      };
    }),
  );
  return results;
}
