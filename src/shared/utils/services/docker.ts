import fs from 'fs';

export async function getContainerId() {
  let longId: string;
  try {
    longId = await new Promise((resolve, reject) => {
      fs.readFile('/proc/self/cgroup', { encoding: 'utf8' }, (error, data) => {
        if (error) {
          reject(error);
        } else {
          try {
            const lines = data.split('\n');
            const firstLine = lines[0].trim();
            const match = firstLine.match(/\/docker\/(.+)$/);
            resolve(match![1]);
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  } catch {
    return 'Could not obtain container id.';
  }
  const shortId = longId.slice(0, 12);
  return { longId, shortId };
}
