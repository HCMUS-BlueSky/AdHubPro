const admin = require('firebase-admin');

const firebaseConfig = {
  credential: admin.credential.cert(
    process.env.NODE_ENV == 'production'
      ? '/etc/secrets/firebaseServiceCred.json'
      : 'firebaseServiceCred.json'
  ),
  storageBucket: 'adhubpro-d78fc.appspot.com'
};

admin.initializeApp(firebaseConfig);
const bucket = admin.storage().bucket();

module.exports = {
  bucket
};
