// The Firebase Admin SDK to access the Firebase Realtime Database.
const functions = require('firebase-functions')
var admin = require("firebase-admin");
var serviceAccount = require("../serviceAccountKey.json");
/*
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-sample-7d385.firebaseio.com"
});
*/


module.exports.test = (req, res, callback) => {
    res.send('Test');
}

exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    //const snapshot = await admin.database().ref('/messages').push({original: original});
    const snapshot = await admin.database().ref('/messages').push({original: original});
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    //res.redirect(303, snapshot.ref.toString());
  });
