var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* GET users listing. */
router.get('/', function(req, res, next) {
    var meetingPeriod = req.query.meetingPeriod;
    var meetingFrequency = req.query.meeting;
    var supportPeriod = req.query.supportPeriod;
    var supportFrequency = req.query.support;
    var trackProgressPeriod = req.query.trackProgressPeriod;
    var trackProgressFrequency = req.query.trackProgress;
    var dailyMessagePeriod = req.query.messagePeriod;
    var dailyMessageFrequency = req.query.message;
    var twelveStepPeriod =  req.query.twelveStepPeriod;
    var twelveStepFrequency = req.query.twelveStep;
    var initialRelapsePeriod = req.query.relapsePeriod;
    var initialRelapseFrequency = req.query.relapse;
    var durationPeriod = req.query.durationPeriod;
    var durationFrequency = req.query.duration;
    var relapse_check = req.query.relapse;
    var relpse_day_check = req.query.day;
    var likert_engage = req.query.likert;
    console.log(likert_engage);
    console.log(relpse_day_check);
    initialRelapseFrequency =String(initialRelapseFrequency).split(",")[1];
    initialRelapseFrequency = parseInt(initialRelapseFrequency);
var init_relapse = calculator(initialRelapsePeriod, initialRelapseFrequency, durationPeriod, durationFrequency, "init_relapse");
var meeting = calculator(meetingPeriod, meetingFrequency, durationPeriod, durationFrequency, "meeting");
var support = calculator(supportPeriod, supportFrequency, durationPeriod, durationFrequency, "support");
var progress = calculator(trackProgressPeriod, trackProgressFrequency, durationPeriod, durationFrequency, "progress");
var message = calculator(dailyMessagePeriod, dailyMessageFrequency, durationPeriod, durationFrequency, "message");
var step = calculator(twelveStepPeriod, twelveStepFrequency, durationPeriod, durationFrequency, "steps");
var totalActions = meeting  + support + progress + message + step;
console.log("totalActions " + totalActions);
var activeUseDays = meetingFrequency + supportFrequency + trackProgressFrequency + dailyMessageFrequency + twelveStepFrequency/ 5;
console.log("activeUseDays "+ activeUseDays);
console.log("use days " + activeUseDays);
var initialRelapse = 20;
// if duration need to divide totalActions by duration to put in scope of user
var uniqueActions = 5;
if(meeting == 0) {
  uniqueActions-=1;
} else if(support == 0) {
  uniqueActions-=1;
} else if(progress == 0) {
  uniqueActions-=1;
} else if(message == 0) {
  uniqueActions-=1;
} else if(step == 0) {
  uniqueActions-=1;
}

var engagement = totalActions / activeUseDays;
var actionDiversity = uniqueActions / 5;
var dailyMessage = message / totalActions;
var trackProgress = progress / totalActions;
var meetingAttendance =  meeting / totalActions;
var seekSupport=  support / totalActions;
var referenceSteps = step / totalActions;
console.log("daily message " + dailyMessage);
console.log("engagement " + engagement);
console.log("actionDiversity " + actionDiversity);
console.log("track progress " + trackProgress);
console.log("meeting attendance " + meetingAttendance);
console.log("seek support " + seekSupport);
console.log("reference steps " + referenceSteps);
relapse_check =String(relapse_check).split(",")[0];
console.log("relapse bool check: " + relapse_check);
relapse_check = parseInt(relapse_check);
likert_engage = likert_engage *1.0;

console.log("relapse init check"+init_relapse);
var retObj = { "actionDiversity": actionDiversity,"dailyMessage" : dailyMessage,
               "trackProgress" :trackProgress,
               "meetingAttendance" :meetingAttendance,
               "seekSupport":seekSupport,
               "referenceSteps":referenceSteps,
               "engagment": likert_engage,
               "init_relapse":parseInt(relpse_day_check), //1 == true ; 0 = false,
               "relapse_check":parseInt(relapse_check)


               };

// fs.writeFile(__dirname +'/../public/data/output.json', JSON.stringify(retObj));
//        res.json(retObj);

  res.render("users", {data: JSON.stringify(retObj)});
  });







function HazeldenData(Fone,Ftwo, Fthree, Ffour, Ffive, Fsix, Fseven){
    this.AppID = Fone;
    this.Timestamp = Ftwo;
    this.DataName = Fthree;
    this.DataCode = Ffour;
    this.UserEngagment = Ffive;
    this.actionDiversity = Fsix;
    this.dailyMessage = Fseven;
    var obj =  {"ID":this.AppID, "Time": this.Timestamp, "dName":this.DataName, "dCode":this.DataCode, "Engagment": this.UserEngagment, "aDiversity": this.actionDiversity, "dailyMsg": this.dailyMessage}
    //console.log(obj);
    return obj;
}


function calculator(period, frequency, durationPeriod, durationFrequency, id) {
console.log(id);
console.log("period " + period);
console.log("frequency " + frequency);
console.log("durationPeriod " + durationPeriod);
console.log("durationFrequency " + durationFrequency);
var perYear;
var total_time =  durationFrequency * durationPeriod;
console.log("total_time "+total_time);
var ratio = period * frequency;
var result;
// switch(period) {
//   case '365':
//     perYear = 1 * frequency;
//   case '7':
//     perYear = 52 * frequency;
//   case '30':
//     perYear = 12 * frequency;
//   case '1':
//     perYear = 365 * frequency;
// }
// if(perYear == 0) {
//   return 0;
// }
result = ratio / total_time;
console.log("result "+result);
return result;
// switch(durationPeriod) {
//   case '365':
//     return (perYear / 365) * durationFrequency;
//   case '52':
//     return (perYear / 52) * durationFrequency;
//   case '12':
//     return (perYear / 12) * durationFrequency;
//   case '1':
//     return perYear * durationFrequency;
// }
}




module.exports = router;
