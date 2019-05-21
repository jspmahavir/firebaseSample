'use strict';
let config = require('../config/config');
const uuid = require('uuid');
let pageRef = config.ref.child('pages');

module.exports.getpage = async (req, res, callback) => {
  var pagecode = req.query.pagecode;
  const data = await pageRef.orderByChild('pagecode').equalTo(pagecode).once('value').then(
    function (snap) {
      let leads = snap.val();
      let leadId = Object.keys(leads)[0];
      let lead = leads[leadId];
      return lead;
    }
  );
  res.send(data);
}

module.exports.addpage = async (req, res, callback) => {
  var now = new Date();
  now.setMilliseconds(0.0);
  var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  utc = utc.toISOString().replace("T"," ").replace(".000Z","");
  const reqData = req.body;
  const uniqueId = uuid.v1();

  const page = {
    id: uniqueId,
    advertisercode: reqData.advertisercode,
    clientcode: reqData.clientcode,
    errormsg: reqData.errormsg,
    existmsg: reqData.existmsg,
    name: reqData.name,
    pagecode: reqData.pagecode,
    successmsg: reqData.successmsg,
    active:true,
    createdate: utc
};
const snapshot = await pageRef.push(page);
res.send(snapshot);
}