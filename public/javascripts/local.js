$(function() {
  $('#theAjaxButton').click(function(e) {
    // console.log('click!');
    var form = $('#theForm')[0];
    var jdata = {
      //The format for this data is as follows
      //question name/tag : [period, frequency]
      "duration"      : [form[0].value, form[1].value],
      "meeting"       : [form[2].value, form[3].value],
      "support"       : [form[4].value, form[5].value],
      "trackProgress" : [form[6].value, form[7].value],
      "message"       : [form[8].value, form[9].value],
      "12step"        : [form[10].value, form[11].value],
      "relapse"       : [form[12].value, form[13].value],
    }
    // console.log(data);
    $.ajax({
      url: '/viz',
      data: jdata,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function(data) {
        $('#body').html(JSON.stringify(data));
      }
    });
  });
});
