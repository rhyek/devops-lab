const { hashElement } = require('folder-hash');

const path = process.argv[1];

hashElement(path, {
  algo: 'sha256',
  encoding: 'hex',
}).then(({ hash }) => {
  console.log(hash);
});
