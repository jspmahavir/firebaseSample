'use strict';
let config = require('../config/config');
const uuid = require('uuid');
let impressionRef = config.ref.child('impressions');
let submissionRef = config.ref.child('submissions');
let pageRef = config.ref.child('pages');
let counterRef = config.ref.child('counters');

module.exports.impression = async (req, res, callback) => {
    var now = new Date();
    var timestamp = Math.round(new Date().getTime()/1000);
    now.setMilliseconds(0.0);
    var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    utc = utc.toISOString().replace("T"," ").replace(".000Z","");
    const reqData = req.body;
    const uniqueId = uuid.v1();
    var leaddataObj = {};
    if(reqData.lead) {
        if(reqData.lead.firstname) {
            leaddataObj['firstname'] = reqData.lead.firstname;
        }
        if(reqData.lead.lastname) {
            leaddataObj['lastname'] = reqData.lead.lastname;
        }
        if(reqData.lead.email) {
            leaddataObj['email'] = reqData.lead.email;
        }
        if(reqData.lead.address) {
            leaddataObj['address'] = reqData.lead.address;
        }
        if(reqData.lead.city) {
            leaddataObj['city'] = reqData.lead.city;
        }
        if(reqData.lead.state) {
            leaddataObj['state'] = reqData.lead.state;
        }
        if(reqData.lead.zip) {
            leaddataObj['zip'] = reqData.lead.zip;
        }
        if(reqData.lead.country) {
            leaddataObj['country'] = reqData.lead.country;
        }
    }
    var metadataObj = {};
    if(reqData.meta) {
        if(reqData.meta.ip) {
            metadataObj['meta'] = reqData.meta.ip;
        }
        if(reqData.meta.os) {
            metadataObj['os'] = reqData.meta.os;
        }
        if(reqData.meta.browser) {
            metadataObj['browser'] = reqData.meta.browser;
        }
        if(reqData.meta.url) {
            metadataObj['url'] = reqData.meta.url;
        }
    }
    const item = {
          id: uniqueId,
          unixtimestamp: timestamp,
          agencycode: reqData.agencycode,
          clientcode: reqData.clientcode,
          advertisercode: reqData.advertisercode,
          pagecode: reqData.pagecode,
          leaddata: leaddataObj,
          meta: metadataObj,
          createdate: utc
    };
    const snapshot = await impressionRef.push(item);
    res.send(snapshot);
}

module.exports.submission = async (req, res, callback) => {
    var now = new Date();
    var timestamp = Math.round(new Date().getTime()/1000);
    now.setMilliseconds(0.0);
    var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    utc = utc.toISOString().replace("T"," ").replace(".000Z","");
    const reqData = req.body;
    var uniqueId;
    if(reqData.id != "") {
        uniqueId = reqData.id;
    } else {
        uniqueId = uuid.v1();
    }
    var exists = await checkSubmissionByKey(uniqueId);
    if(exists) {
        var errorStr = 'Submission already exist.';
        res.send({"exists": '1', 'message': errorStr});
    } else {
        var currentCounter = await getCounter();
        if(currentCounter.recordid > 0) {
            var params = {
                uniqueId: uniqueId,
                timestamp:timestamp, 
                counterVal: currentCounter.recordid,
                utc: utc
            };
            var resSubmission = await insertSubmission(reqData,params);
            if(resSubmission) {
                var currentvalue = currentCounter.recordid;
                var newvalue = currentvalue + 1;
                updateCounter(currentvalue,newvalue);
                var successStr = 'Submission created.';
                res.send({'message': successStr,"id": resSubmission});
            }
        }
    }
    
}

async function checkSubmissionByKey(id) {
    const data = await submissionRef.orderByChild('id').equalTo(id).once('value').then(
        function (snap) {
            let leads = snap.val();
            var lead = '';
            if(leads) {
                let leadId = Object.keys(leads)[0];
                lead = leads[leadId].id;
            }
            return lead.toString();
        }
      );
      return data;
}

async function getCounter() {
    var counter = await counterRef.once('value').then(
        function (snap) {
            let leads = snap.val();
            return leads;
        }
      );
      return counter;
}

async function insertSubmission(reqData, extra) {
    var leaddataObj = {};
    if(reqData.lead.firstname) {
        leaddataObj['firstname'] = reqData.lead.firstname;
    }
    if(reqData.lead.lastname) {
        leaddataObj['lastname'] = reqData.lead.lastname;
    }
    if(reqData.lead.email) {
        leaddataObj['email'] = reqData.lead.email;
    }
    if(reqData.lead.address) {
        leaddataObj['address'] = reqData.lead.address;
    }
    if(reqData.lead.city) {
        leaddataObj['city'] = reqData.lead.city;
    }
    if(reqData.lead.state) {
        leaddataObj['state'] = reqData.lead.state;
    }
    if(reqData.lead.zip) {
        leaddataObj['zip'] = reqData.lead.zip;
    }
    if(reqData.lead.country) {
        leaddataObj['country'] = reqData.lead.country;
    }
    var metadataObj = {};
    if(reqData.meta) {
        if(reqData.meta.ip) {
            metadataObj['meta'] = reqData.meta.ip;
        }
        if(reqData.meta.os) {
            metadataObj['os'] = reqData.meta.os;
        }
        if(reqData.meta.browser) {
            metadataObj['browser'] = reqData.meta.browser;
        }
        if(reqData.meta.url) {
            metadataObj['url'] = reqData.meta.url;
        }
    }
    const item = {
            id: extra.uniqueId,
            record_id: extra.counterVal,
            unixtimestamp: extra.timestamp,
            agencycode: reqData.agencycode,
            clientcode: reqData.clientcode,
            advertisercode: reqData.advertisercode,
            pagecode: reqData.pagecode,
            leaddata: leaddataObj,
            meta: metadataObj,
            suceess: true,
            createdate: extra.utc
    };
    const snapshot = await submissionRef.push(item);
    return snapshot;
}

function updateCounter(current,next) {
    const updateObj = {'recordid': next};
    return counterRef.update(updateObj).then(function (ret) {
        return ret;
    });
}