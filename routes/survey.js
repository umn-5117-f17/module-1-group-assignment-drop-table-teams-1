var express = require('express');
var router = express.Router({ mergeParams: true });
var parse = require('csv-parse');
var fs = require('fs');
var qt = require('quickthumb');




/* GET survey page. */
router.get('/', function(req, res, next) {
  console.log("base survey render")
  res.render('survey');
});

router.get('/', function(req, res, next) {
  console.log("HELLLLLLLLLLLOO");
  // var meetingPeriod = req.body.meetingPeriod;var jdata = {
       //The format for this data is as follows
       //question name/tag : [period, frequency]
       var form = req.query;
       console.log("index viz");
       console.log(form);
       /*var form_dat = {
       "durationPeriod"      : form[0].value,
       "duration"            : form[1].value,
       "meetingPeriod"       : form[2].value,
       "meeting"             : form[3].value,
       "supportPeriod"       : form[4].value,
       "support"             : form[5].value,
       "trackProgressPeriod" : form[6].value,
       "trackProgress"       : form[7].value,
       "messagePeriod"       : form[8].value,
       "message"             : form[9].value,
       "twelveStepPeriod"    : form[10].value,
       "twelveStep"          : form[11].value,
       "relapse_bool"       : form[12].value,
       "relapsePeriod"       : form[13].value,
       "relapse"             : form[14].value,
     };*/
     var meetingPeriod = form.meetingPeriod;
      var meetingFrequency = form.meeting;
      var supportPeriod = form.supportPeriod;
      var supportFrequency = form.support;
      var trackProgressPeriod = form.trackProgressPeriod;
      var trackProgressFrequency = form.trackProgress;
      var dailyMessagePeriod = form.messagePeriod;
      var dailyMessageFrequency = form.message;
      var twelveStepPeriod =  form.twelveStepPeriod;
      var twelveStepFrequency = form.twelveStep;
      var initialRelapsePeriod = form.relapsePeriod;
      var initialRelapseFrequency = form.relapse;
      var durationPeriod = form.durationPeriod;
      var durationFrequency = form.duration;
      var relapse_check = form.relapse_bool;

      //console.log("neeting period: "+ meetingPeriod);

        // putting form data in terms of total times for acitve use period


      var meeting = calculator(meetingPeriod, meetingFrequency, durationPeriod, durationFrequency, "meeting");
      var support = calculator(supportPeriod, supportFrequency, durationPeriod, durationFrequency, "support");
      var progress = calculator(trackProgressPeriod, trackProgressFrequency, durationPeriod, durationFrequency, "progress");
      var message = calculator(dailyMessagePeriod, dailyMessageFrequency, durationPeriod, durationFrequency, "message");
      var step = calculator(twelveStepPeriod, twelveStepFrequency, durationPeriod, durationFrequency, "steps");
      var totalActions = meeting + support + progress + message + step;
      console.log("totalActions " + totalActions);
      var activeUseDays = meetingFrequency + supportFrequency + trackProgressFrequency + dailyMessageFrequency + twelveStepFrequency;
      console.log("activeUseDays "+ activeUseDays);
      console.log("use days " + activeUseDays);
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
      var actionDiversity = uniqueActions / 5;
      var dailyMessage = message / totalActions;
          var trackProgress = progress / totalActions;
      var meetingAttendance =  meeting / totalActions;
      var seekSupport=  support / totalActions;
      var referenceSteps = step / totalActions;
      var retObj = { "actionDiversity": actionDiversity,"dailyMessage" : dailyMessage, "trackProgress" :trackProgress, "meetingAttendance" :meetingAttendance, "seekSupport":seekSupport, "referenceSteps":referenceSteps};
      console.log("viz check");
      console.log(retObj);

  res.render('users', {"user_data":  JSON.stringify(retObj)});
});

//Conor sucks...
router.post("/computation", function(req, res, next) {
  console.log("in the computation post");
  //console.log(req.body);
  var csvData=[];
  fs.createReadStream('./data/HazeldenUserAvgs.csv')
      .pipe(parse({delimiter: ','}))
      .on('data', function(csvrow) {
          //do something with csvrow
          csvData.push(csvrow);
      })
      .on('end',function() {

      // var userData=[];
      // fs.createReadStream('./data/HazeldenData.csv')
      //     .pipe(parse({delimiter: ','}))
      //     .on('data', function(csvRow) {
      //         //do something with csvrow
      //         userData.push(csvRow);
      //     })
      //     .on('end',function() {
      //       //do something wiht csvData


      /*
        saving the incoming form data
      */
      var meetingPeriod = req.body.meetingPeriod;
      var meetingFrequency = req.body.meeting;
      var supportPeriod = req.body.supportPeriod;
      var supportFrequency = req.body.support;
      var trackProgressPeriod = req.body.trackProgressPeriod;
      var trackProgressFrequency = req.body.trackProgress;
      var dailyMessagePeriod = req.body.messagePeriod;
      var dailyMessageFrequency = req.body.message;
      var twelveStepPeriod = req.body.twelveStepPeriod;
      var twelveStepFrequency = req.body.twelveStep;
      var initialRelapsePeriod = req.body.relapsePeriod;
      var initialRelapseFrequency = req.body.relapse;
      var durationPeriod = req.body.durationPeriod;
      var durationFrequency = req.body.duration;
      var relapse_check = req.body.relapse_bool

      console.log("neeting period: "+ meetingPeriod);
      /*
        putting form data in terms of total times for acitve use period
      */

      var meeting = calculator(meetingPeriod, meetingFrequency, durationPeriod, durationFrequency, "meeting");
      var support = calculator(supportPeriod, supportFrequency, durationPeriod, durationFrequency, "support");
      var progress = calculator(trackProgressPeriod, trackProgressFrequency, durationPeriod, durationFrequency, "progress");
      var message = calculator(dailyMessagePeriod, dailyMessageFrequency, durationPeriod, durationFrequency, "message");
      var step = calculator(twelveStepPeriod, twelveStepFrequency, durationPeriod, durationFrequency, "steps");
      var totalActions = meeting + support + progress + message + step;
      console.log("totalActions " + totalActions);
      var activeUseDays = meetingFrequency + supportFrequency + trackProgressFrequency + dailyMessageFrequency + twelveStepFrequency;
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


      var retObj = { "actionDiversity": actionDiversity,"dailyMessage" : dailyMessage, "trackProgress" :trackProgress, "meetingAttendance" :meetingAttendance, "seekSupport":seekSupport, "referenceSteps":referenceSteps};

      fs.writeFile(__dirname +'/../public/data/output.json', JSON.stringify(retObj));
             res.json(retObj);

        res.render("/viz", {data: JSON.stringify(retObj)});
        }); });





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

function bubbleSort(distance)
{
  var swapped;
  do {
      swapped = false;
      for (var i=0; i < distance.length-1; i++) {
          if (distance[i].distance > distance[i+1].distance) {
              var temp = distance[i];
              distance[i] = distance[i+1];
              distance[i+1] = temp;
              swapped = true;
          }
      }
  } while (swapped);
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
