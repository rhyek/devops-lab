import path from 'path';

const { hashElement } = require('folder-hash');

hashElement(path.resolve(__dirname, `../src/${process.env.LERNA_PACKAGE_NAME}/build`), {}).then((hash: any) => {
  console.log(`BUILD_HASH: ${hash.hash}`);
});
