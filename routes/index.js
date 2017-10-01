var express = require('express');
var router = express.Router();
var parse = require('csv-parse');
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/computation', function(req, res, next) {
  var csvData=[];
  fs.createReadStream('./data/HazeldenUserAvgs.csv')
      .pipe(parse({delimiter: ','}))
      .on('data', function(csvrow) {
          //do something with csvrow
          csvData.push(csvrow);
      })
      .on('end',function() {

      var userData=[];
      fs.createReadStream('./data/HazeldenData.csv')
          .pipe(parse({delimiter: ','}))
          .on('data', function(csvRow) {
              //do something with csvrow
              userData.push(csvRow);
          })
          .on('end',function() {
            //do something wiht csvData


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

      /*
        putting form data in terms of total times for acitve use period
      */

      var meeting = calculator(meetingPeriod, meetingFrequency, durationPeriod, durationFrequency);
      var support = calculator(supportPeriod, supportFrequency, durationPeriod, durationFrequency);
      var progress = calculator(trackProgressPeriod, trackProgressFrequency, durationPeriod, durationFrequency);
      var message = calculator(dailyMessagePeriod, dailyMessageFrequency, durationPeriod, durationFrequency);
      var step = calculator(twelveStepPeriod, twelveStepFrequency, durationPeriod, durationFrequency);
      var totalActions = meeting + support + progress + message + step;
      var activeUseDays = totalActions;
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

      // How to find active use days?
      var engagement = totalActions / activeUseDays;
      var actionDiversity = uniqueActions / 5;
      var dailyMessage = message / totalActions;

      /*
        Sort into distance array smallest to largest. Placing user id and distance into array
      */
      // should have 596 lines of data, first line is column headers
      var numRows = 597;
      /*
        csvData contents
        0: App.Instance.ID
        1: Engagement
        2: Action.Diversity
        3: Expected.Relapse.Report
        4: Interval.Init.Relapse
        5: Intervale.Second.Relapse
        6: open.App
        7: seek.Support
        8: view.steps
        9: daily.Message
        10: track.Progress
        11: meeting
      */
      var distance = [];
      for(var i = 1; i < numRows; i++) {
        var e = Math.pow(engagement - csvData[i][1],2);
        var ir = Math.pow(initialRelapse - csvData[i][4],2);
        var ad = Math.pow(actionDiversity - csvData[i][2],2);
        var dm = Math.pow(dailyMessage - csvData[i][9],2);
        var d = Math.sqrt(e + ir + ad + dm);
        distance[i-1] =
        {
          id: csvData[i][0],
          distance: d,
        };
      }
      //Bubble sort the array of distances
      bubbleSort(distance);

      /*
        take first 10 user id's from distance array and create users array that
        contains user info for those 10 users and send to visualization
        48732 lines in data file
      */
      //initialize users array
      var users = new Array(10);
      for(var i = 0; i<10; i++) {
        users[i] = [];
      }
      var numNeeded = 10;
      for(var i = 0; i< numNeeded; i++) {
        count=0;
        for(var j = 1; j < 48732; j++) {
          if(distance[i].id == userData[j][0]) {
            users[i][count] = userData[j];
            count++;
          }
        }
      }

      //console.log(users[0]);
      res.render('viz', users);
        });
      });
});

function bubbleSort(distance)
{
  console.log(distance.length);
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

function calculator(period, frequency, durationPeriod, durationFrequency) {
  var perYear = period * frequency;
  if(perYear == 0) {
    return 0;
  }
  switch(durationPeriod) {
    case 365:
      return (perYear / 365) * durationFrequency;
    case 52:
      return (perYear / 52) * durationFrequency;
    case 12:
      return (perYear / 12) * durationFrequency;
    case 1:
      return perYear * durationFrequency;
  }
}
module.exports = router;
