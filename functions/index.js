const functions = require('firebase-functions');
const express = require('express'); 
const routes = require('./routes');
const cors = require('cors');
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use('/',routes);

exports.firebaseApp = functions.https.onRequest(app);