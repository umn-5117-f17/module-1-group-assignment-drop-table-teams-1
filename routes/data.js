var express = require('express');
var parse = require('csv-parse');
var fs = require('fs');
var pipe = require('pipe');
var csv = require("fast-csv");
var router = express.Router();
path = require("path")


  function HazeldenData(Fone,Ftwo, Fthree, Ffour, Ffive, Fsix, Fseven){
            this.AppID = Fone;
            this.Timestamp = Ftwo;
            this.DataName = Fthree;
            this.DataCode = Ffour;
            this.UserEngagment = Ffive;
            this.actionDiversity = Fsix;
            this.dailyMessage = Fseven;
            var obj =  {"ID":this.AppID, "Time": this.Timestamp, "dName":this.DataName, "dCode":this.DataCode, "Engagment": this.UserEngagment, "aDiversity": this.actionDiversity, "dailyMsg": this.dailyMessage}
            return obj;
}e




router.get('/', function(req, res, next) {
  console.log("data route");


  console.log("pre csv");


console.log("pre parse");



var HazData = [];
var newInst = null;
csv.fromPath(__dirname + '/../data/sampleData.csv')
.on("data", function(data){
    //var arr = array.from(data);
    //for (var index = 0; index < data.length; index++) {
    //console.log("in for loop: "+index);
    newInst = HazeldenData(data[0], data[1], data[2], data[3],data[4],data[5],data[6]);
    //console.log(newInst);
    HazData.push(newInst);
    // console.log(data);
 })
 .on("end", function(){
     console.log("done");
     console.log(HazData);
     fs.writeFile(__dirname +'/../data/output.json', JSON.stringify(HazData));
    res.json({'sampData':HazData});

 });

});


// router.get('/', function(req, res, next) {
//   res.render('data', { title: 'Data' });
//   console.log('Data Test');
// });



    module.exports = router;