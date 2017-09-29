var express = require('express');
var d3 = require("d3");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/computation', function(req, res, next) {
  var ssv = d3.dsvFormat(" ");
  d3.ssv("../data/HazeldenUserAvgs.csv", function(data) {
    console.log(data[0]);

    //yearly numbers?
    var meeting = req.body.meeting;
    var support = req.body.support;
    var trackProgress = req.body.trackProgress;
    var dailyMessageResponse = req.body.dailyMessage;
    var twelveStep = req.body.12step;
    var initialRelapse = req.body.relapse;
    //var duration = req.body.duration;

    var totalActions = meeting + support + trackProgress + dailyMessageResponse + twelveStep;
    // if duration need to divide totalActions by duration to put in scope of user
    var uniqueActions = 5;
    if(meeting == 0) {
      uniqueActions-=1;
    } elif(support == 0) {
      uniqueActions-=1;
    } elif(trackProgress == 0) {
      uniqueActions-=1;
    } elif(dailyMessageResponse == 0) {
      uniqueActions-=1;
    } elif(twelveStep == 0) {
      uniqueActions-=1;
    }

    // How to find active use days?
    var engagement = totalActions / activeUseDays;
    var actionDiversity = uniqueActions / 5;
    var dailyMessage = dailyMessageResponse / totalActions;

    /*
      Sort into distance array smallest to largest. Placing user id and distance into array
    */
    // should have 596 lines of data
    var numRows = 596;
    var distance = [];
    for(var i = 0; i < numRows; i++) {
      var e = Math.pow(engagement - data[i].Engagement);
      var ir = Math.pow(initialRelapse - data[i].Interval.Init.Relapse);
      var ad = Math.pow(actionDiversity - data[i].Action.Diversity);
      var dm = Math.pow(dailyMessage - data[i].daily.Message);
      var d = Math.sqrt(e + ir + ad + dm);

      distance[i] =
      {
        id: data[i].App.Instance.ID,
        distance: d,
      };
    }

    //Bubble sort the array of distances
    function bubbleSort(a)
    {
      var swapped;
      do {
          swapped = false;
          for (var i=0; i < a.length-1; i++) {
              if (distance[i].distance > distance[i+1].distance) {
                  var temp = distance[i];
                  distance[i] = distance[i+1];
                  distance[i+1] = temp;
                  swapped = true;
              }
          }
      } while (swapped);
    }

    /*
      take first 10 user id's from distance array and create users array that contains
      user info for those 10 users and send to visualization
    */
    var users = [];
    var numNeeded = 10;
    for(var i = 0, i < numNeeded; i++) {
      var id = distance[i];
      users[i] =
      {
        // search for user info in csv file based on user ID
        //place into json object
      };
    }
    // Send to visualization
  });
});



function calculator(often, frequency, durationOften, durationFrequency) {
  var perYear;
  switch(often) {
    case "weekly":
      perYear = 52 * frequency;
      break;
    case "daily":
      perYear = 365 * frequency;
      break;
    case "monthly":
      perYear = 12 * frequency;
      break;
    case "Yearly":
      perYear = frequency;
      break;
  }
  switch(durationOften) {
    case "days":
      return perYear / 365 * durationFrequency;
    case "weeks":
      return perYear / 52 * durationFrequency;
    case "months":
      return perYear / 12 * durationFrequency;
    case "years":
      return perYear * durationFrequency;
  }
}

module.exports = router;
