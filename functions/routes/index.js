const Router = require("express");
// var admin = require("firebase-admin");
// var serviceAccount = require('../serviceAccountKey.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://fir-sample-7d385.firebaseio.com"
// })
//const helloController = require('../src/hello');
const convertController = require("../src/convert");
const adsController = require("../src/ads");
const pageController = require("../src/page");
const router = new Router();

//router.route('/hello').get(helloController.test);
router.route("/encrypt").post(convertController.encryptText);
router.route("/decrypt").post(convertController.decryptText);
router.route("/impression").post(adsController.impression);
router.route("/submission").post(adsController.submission);
router.route("/page").get(pageController.getpage);
router.route("/page").post(pageController.addpage);

module.exports = router;