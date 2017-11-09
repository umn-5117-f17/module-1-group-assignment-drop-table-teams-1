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
       "relapse_bool"       : form[12].value,
       "relapsePeriod"       : form[13].value,
       "relapse"             : form[14].value,
     }
    /* $.post('computation',jdata, function(rsp) {
       response = rsp;
       console.log(response);

       window.location.href = window.location+"viz";

     });*/
     //$.res(){window.location = window.location.href+"viz"};

    // $.get('/viz');

   });
   $('#quiz-button').click(function(e){
     window.location.href = window.location+"survey"

   });
 });




 $("#reset").click(() => {
   console.log("clicked");
     zoom.transform(background, d3.zoomIdentity.scale(1) );

 });
 // $(res.status(200).send('success'));


$('input[type="checkbox"]').on('change', function() {
    $('input[name="' + this.name + '"]').not(this).prop('checked', false);
});



//$(function() {
  // $('#theinputfield').change(function() {
  //   console.log('picked file',
  //   $('#theinputfield')[0].files[0]);
  // });

  //$('#theform').submit(function(e) {
   // console.log('form submit')
    //e.preventDefault();
  //});

function daysBetween( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;

  // Convert back to days and return
  return Math.round(difference_ms/one_day);
}



//Not working
$("#reset").click(() => {
  console.log("clicked");
    d3.zoom.transform(background, d3.zoomIdentity.scale(1) );

})

$("#reset-zoom-button").click(() => {
    g.call(zoom.transform, d3.zoomIdentity)

})
//  d3.select("button").on("click", background.call(d3.zoom(d3.transform, d3.zoomIdentity)));
  function createGraph(treeData, userData){
    var margin = {top: 20, right: 120, bottom: 20, left: 120},
  width = 800 - margin.right - margin.left,
  height = 900 - margin.top - margin.bottom;
  console.log(userData);
  d3.select('#reset-zoom-button').on('click',reset);
var treemap = d3.tree()
    .size([height, width]);

//  assigns the data to a hierarchy using parent-child relationships
var nodes = d3.hierarchy(treeData, function(d) {
    return d.children;
  });



// maps the node data to the tree layout
nodes = treemap(nodes);

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin

var svg = d3.select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

  var background = svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .call(d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", zoomed));



   var g = svg.append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    function reset() {
                  g.transition()
                      .duration(750)
                      .attr("transform", "translate(151.47745046603399,184.97075387524603) scale(0.8950250709279729)")

                      // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
                      //.call( d3.zoom(transform,d3.zoomIdentity)); // updated for d3 v4
                }

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
// adds the links between the nodes
//

var link = g.selectAll(".link")
    .data( nodes.descendants().slice(1))
  .enter().append("g").attr("class","path-wrap").append("path")
    .attr("class", "link")
     .attr("id",  function(d,i){return "edge_"+i})
    .style("stroke", function(d) { return d.data.level; })
    .attr("d", function(d) {
      // console.log("link label"+Object.values(d.data));
       return "M" + d.parent.y + "," + d.parent.x
         + "C" + (d.y + d.parent.y) / 2 + "," + d.parent.x
         + " " + (d.y + d.parent.y) / 2 + "," + d.x
         + " " + d.y + "," + d.x;
       });


    d3.selectAll(".path-wrap")
    .append("text")
    .attr('class', 'edge-text')
    // .attr('transform', function(d){ console.log("tansform check "+Object.keys(d)); return'rotate(180,'+d.x+','+d.y+')' ;})
    .append("textPath")
     .attr("xlink:href", function(d,i){
       return "#edge_"+i;})

    .attr('text-anchor', 'middle')
    // .attr('transform', function(d){ console.log("tansform check "+Object.keys(d)); return'rotate(180,'+d.x+','+d.y+')' ;})
    .attr("startOffset", "50%")
         .text(function(d){
          console.log(d.data); return d.data.edge_label;
         }).attr("font-size", "10");
/*
  g.append("text")
      .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr("dy", ".35em")
      .attr("transform", function(d) {
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
            + "translate(" + (innerRadius + 26) + ")"
            + (d.angle > Math.PI ? "rotate(180)" : "");
      })
      .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
      .text(function(d) { return nameByIndex.get(d.index); });*/

/*.each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr("dy", ".35em")
      .attr("transform", function(d) {
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
            + "translate(" + (innerRadius + 26) + ")"
            + (d.angle > Math.PI ? "rotate(180)" : "");*/
/*.append("text")
   .append("textPath") //append a textPath to the text element
  .attr("xlink:href", "#wavy") //place the ID of the path here
  .style("text-anchor","middle") //place the text halfway on the arc
  .attr("startOffset", "50%")
  .text("Yay, my text is on a wavy path");*/

    /*svg.selectAll(".link").append("text")
    .append("textPath")
    // .attr("xlink:href", function(d,i){
    //   return "#edge_"+i})
    .attr('text-anchor', 'middle')
    .attr("startOffset", "50%")
         .text(function (d) {
            return "this is a label";
         });*/

// adds each node as a group
var node = g.selectAll(".node")
    .data(nodes.descendants())
  .enter().append("g")
    .attr("class", function(d) {
    return "node" +
        (d.data.children ? " node--internal" : " node--leaf"); })
    .attr("transform", function(d) {
      // if(d.data)
      return "translate(" + d.y + "," + d.x + ")"; })
    /*.append("circle")
    .attr("r", function(d) { return d.value/5; });*/

 /* d3.selectAll(".node").data(nodes.descendants())
  .enter().insert("circle").attr('r', function(d){
    console.log("circle append check"+d);return d.data.value / 5;
  });*/

// adds symbols as nodes
node.append("svg:circle")
  .style("stroke", function(d,i){
    var color = "";
    if(userData[8] === undefined){
      color = "blue";
    }else{
      if(i ==0) {

          color = "blue";

      } else if (i == 1) {
        if (userData[8][1] >= .51){
          color="red";
        }else{
          color = "blue";
        }
      }else if (i == 2) {
        if (userData[8][1] < .51){
          color="red";
        }else{
          color = "blue";
        }

      }else if (i == 3) {
        if (userData[8][1] >= .51 & userData[2][1] >= .6){
          color="red";
        }else{
          color = "blue";
        }

      }else if (i == 4) {
        if (userData[8][1] >= .51 & userData[2][1] < .6){
          color="red";
        }else{
          color = "blue";
        }

      }else if (i == 5) {
        if (userData[8][1] < .51 & userData[1][1] == 1){
          color="red";
        }else{
          color = "blue";
        }

      }else if (i == 6) {
        if (userData[8][1] < .51 & userData[1][1] == 0){
          color="red";
        }else{
          color = "blue";
        }

      }else if (i == 7) {
        if (userData[8][1] >= .51 & userData[2][1] < .6 & userData[7][1] >= .5){
          color="red";
        }else{
          color = "blue";
        }
      }else if (i == 8) {
        if (userData[8][1] >= .51 & userData[2][1] < .6 & userData[7][1] < .5){
          color="red";
        }else{
          color = "blue";
        }
      }else if (i == 9) {
        if ((userData[8][1] < .51 & userData[1][1] == 0 & userData[2][1] >= .49)){
          color="red";
        }else{
          color = "blue";
        }

      }else if (i == 10) {
        if ((userData[8][1] < .51 & userData[1][1] == 0 & userData[2][1] < .49)){
          color="red";
        }else{
          color = "blue";
        }
      }else if (i == 11) {
        if (userData[8][1] >= .51 & userData[2][1] < .6 & userData[7][1] < .5 & userData[2][1] >= .49 ){
          color="red";
        }else{
          color = "blue";
        }
      }else if (i == 12) {
        if (userData[8][1] >= .51 & userData[2][1] < .6 & userData[7][1] < .5 & userData[2][1] < .49 ){
          color="red";
        }else{
          color = "blue";
        }
      }else if (i == 13) {
        if (userData[8][1] >= .51 & userData[2][1] < .6 & userData[7][1] < .5 & userData[2][1] < .49 & userData[2][1] < .48 ){
          color="red";
        }else{
          color = "blue";
        }

      }else if (i == 14) {
        if (userData[8][1] >= .51 & userData[2][1] < .6 & userData[7][1] < .5 & userData[2][1] < .49 & userData[2][1] >= .48 ){
          color="red";
        }else{
          color = "blue";
        }
      }
    }


    console.log(d.data);  return color; })
  .style("fill", function(d,i) {
    var color = "";
    if(userData[8] === undefined){
      color = "blue";
    }else{
      if(i ==0) {

          color = "blue";

      } else if (i == 1) {
        if (userData[8][1] >= .51){
          color="red";
        }else{
          color = "blue";
        }
      }else if (i == 2) {
        if (userData[8][1] < .51){
          color="red";
        }else{
          color = "blue";
        }

      }else if (i == 3) {
        if (userData[8][1] >= .51 & userData[2][1] >= .6){
          color="red";
        }else{
          color = "blue";
        }

      }else if (i == 4) {
        if (userData[8][1] >= .51 & userData[2][1] < .6){
          color="red";
        }else{
          color = "blue";
        }

      }else if (i == 5) {
        if (userData[8][1] < .51 & userData[1][1] == 1){
          color="red";
        }else{
          color = "blue";
        }

      }else if (i == 6) {
        if (userData[8][1] < .51 & userData[1][1] == 0){
          color="red";
        }else{
          color = "blue";
        }

      }else if (i == 7) {
        if (userData[8][1] >= .51 & userData[2][1] < .6 & userData[7][1] >= .5){
          color="red";
        }else{
          color = "blue";
        }
      }else if (i == 8) {
        if (userData[8][1] >= .51 & userData[2][1] < .6 & userData[7][1] < .5){
          color="red";
        }else{
          color = "blue";
        }
      }else if (i == 9) {
        if ((userData[8][1] < .51 & userData[1][1] == 0 & userData[2][1] >= .49)){
          color="red";
        }else{
          color = "blue";
        }

      }else if (i == 10) {
        if ((userData[8][1] < .51 & userData[1][1] == 0 & userData[2][1] < .49)){
          color="red";
        }else{
          color = "blue";
        }
      }else if (i == 11) {
        if (userData[8][1] >= .51 & userData[2][1] < .6 & userData[7][1] < .5 & userData[2][1] >= .49 ){
          color="red";
        }else{
          color = "blue";
        }
      }else if (i == 12) {
        if (userData[8][1] >= .51 & userData[2][1] < .6 & userData[7][1] < .5 & userData[2][1] < .49 ){
          color="red";
        }else{
          color = "blue";
        }
      }else if (i == 13) {
        if (userData[8][1] >= .51 & userData[2][1] < .6 & userData[7][1] < .5 & userData[2][1] < .49 & userData[2][1] < .48 ){
          color="red";
        }else{
          color = "blue";
        }

      }else if (i == 14) {
        if (userData[8][1] >= .51 & userData[2][1] < .6 & userData[7][1] < .5 & userData[2][1] < .49 & userData[2][1] >= .48 ){
          color="red";
        }else{
          color = "blue";
        }
      }
    }


    console.log(d.data);  return color; })
  .attr("r", function(d) { return d.data.value /5; } )
  .style("fill-opacity", function(d){ return 1.886792453 * d.data.relapse})
  .append("svg:title")
  .append("tspan").text(function(d){console.log(d.data.relapse); return "Probability of Relapse: " + d.data.relapse})
.append("br")
.append("tspan").text(function(d){ return "| N:" + d.data.value});
/*
.text(function(d, i) { return "Probability of Relapse: " + d.data.relapse })
  .on("mouseover", function(d) { console.log("mouse event!");console.log(d);
       div.transition()
         .duration(200)
         .style("opacity", .9);
       div.html("<br>"+d.data.relapse + "<br/>")
         .style("left", (d.x) + "px")
         .style("top", (d.y - 28) + "px");
       })
     .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       });*/


  node.append("text")
  .attr("dy", ".35em")
  .attr("x", function(d) {return d.data.children ?
    (d.data.value/5 + 4) * -1 : d.data.value + 4 })
  .style("text-anchor", function(d) {
    // return "middle";
   return  d.children ? "end" : "start";
  })
  .text(function(d) { return d.data.name; });

  function zoomed() {
    g.attr("transform", d3.event.transform);
}


function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .9 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

  g.transition()
      .duration(750)
      .style("stroke-width", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");


}


//
// function reset() {
//   active.classed("active", false);
//   active = d3.select(null);
//
//   g.transition()
//       .duration(750)
//       .style("stroke-width", "1.5px")
//       .attr("transform", "");
// }

}
