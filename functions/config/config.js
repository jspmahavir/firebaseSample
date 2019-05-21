var admin = require("firebase-admin");
var serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-sample-7d385.firebaseio.com"
});

var dbRef = admin.database().ref();

var exports = {
    ref: dbRef
  };

module.exports = exports;