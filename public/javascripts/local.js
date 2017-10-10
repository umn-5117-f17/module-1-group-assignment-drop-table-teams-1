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
     $.post('computation',jdata, function(rsp) {
       response = rsp;
       console.log(response);
       
       window.location.href = window.location+"viz";

     });
     //$.res(){window.location = window.location.href+"viz"};

    // $.get('/viz');

   });
 });


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



  function createGraph(treeData){
    var margin = {top: 20, right: 120, bottom: 20, left: 120},
  width = 1200 - margin.right - margin.left,
  height = 500 - margin.top - margin.bottom;


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
var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom),
    g = svg.append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// adds the links between the nodes
var link = g.selectAll(".link")
    .data( nodes.descendants().slice(1))
  .enter().append("path")
    .attr("class", "link")
    .style("stroke", function(d) { return d.data.level; })
    .attr("d", function(d) {
       console.log("link test"); console.log(d);return "M" + d.y + "," + d.x
         + "C" + (d.y + d.parent.y) / 2 + "," + d.x
         + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
         + " " + d.parent.y + "," + d.parent.x;
       });

// adds each node as a group
var node = g.selectAll(".node")
    .data(nodes.descendants())
  .enter().append("g")
    .attr("class", function(d) { 
      console.log("node test"); console.log(d); return "node" + 
        (d.data.children ? " node--internal" : " node--leaf"); })
    .attr("transform", function(d) { 
      return "translate(" + d.y + "," + d.x + ")"; });



// adds symbols as nodes
node.append("path")
  .style("stroke", function(d) {return d.data.type; })
  .style("fill", function(d) {  return d.data.level; })
  .attr("d", d3.symbol().size(function(d) { return d.data.value * 30; } )
     .type(function(d) {  console.log("symbol test"); console.log(d); return d3.symbolCircle;
      
     }));

// adds the text to the node
node.append("text")
  .attr("dy", ".35em")
  .attr("x", function(d) { console.log(d.data);return d.data.children ? 
    (d.data.value + 4) * -1 : d.data.value + 4 })
  .style("text-anchor", function(d) { 
    return d.children ? "end" : "start"; })
  .text(function(d) { console.log("text test"); console.log(d); return d.data.name; });

}