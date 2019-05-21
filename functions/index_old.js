const functions = require('firebase-functions');

const os = require('os');
const path = require('path');
const express = require('express'); 
const cors = require('cors');
const Busboy = require('busboy');
const fs = require('fs');
const app = express();

const {Storage} = require('@google-cloud/storage');
// Creates a client
const storage = new Storage({
  projectId: "fir-sample-7d385",
});

const convert = require('./src/convert.f');

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get('/hello', (req, res) => {
  res.send("Received GET request!");  
});

app.post('/hello', (req, res) => {
  res.send("Received POST request!");  
});

app.post('/uploadFile', (req,res) => {
  const busboy = new Busboy({ headers: req.headers });
  let uploadData = null;
  busboy.on("file",(fieldname,file,filename,encoding,mimetype) => {
    const filepath = path.join(os.tmpdir(), filename);
    uploadData = { file: filepath, type: mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on('finish', () => {
    const bucket = storage.bucket('fir-sample-7d385.appspot.com');
    bucket.upload(uploadData.file, {
      uploadType: 'media',
      metadata: {
        metadata: {
          contentType: uploadData.type
        }
      }
    })
    .then(() => {
      res.status(200).json({
        message: 'It Works!'
      });
    })
    .catch(err => {
        res.status(500).json({
        error:err
      });
    });
  });
  busboy.end(req.rawBody);
});

// Expose Express API as a single Cloud Function:
exports.firebaseSample = functions.https.onRequest(app);

/*
exports.helloWorld = functions.https.onRequest((request, response) => {
    let msg = request.query.msg || "Hello, Mahavir";
    response.status(200).send(msg);
});
*/