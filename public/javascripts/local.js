$(function() {
      var response = null;
  $('#btn').click(function(e) {
    // console.log('click!');
    var form = $('#theForm')[0];
    var jdata = {
      //The format for this data is as follows
      //question name/tag : [period, frequency]
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
      "relapsePeriod"       : form[12].value,
      "relapse"             : form[13].value,
    }

    $.post('/computation',jdata, function(rsp) {
      response = rsp;
      console.log(response);
    });
  });
});
