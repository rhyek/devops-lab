const { hashElement } = require('folder-hash');

const path = process.argv[2];

hashElement(path, {
  algo: 'sha256',
  encoding: 'hex',
})
  .then(({ hash }) => {
    console.log(hash);
  })
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });
