$(function(){
 // console.log(Data)
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

  function createGraph(dataset, xName, yObjs, axisLables){
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var graphObj = {};
    var relapse_cols = ["#ff0000", "#ab0000", "#460000"];
    graphObj.relapse_cols = d3.scaleOrdinal().range(relapse_cols);
    graphObj.data = dataset;
    graphObj.relapse_data = [];
    graphObj.data.forEach(function(d){
      if(d.relapse != 0){
        var x = d;
        d.y = 1;
        graphObj.relapse_data.push(x);

    }
    });

    graphObj.xAxisLable = axisLables.xAxis;
    graphObj.yAxisLable = axisLables.yAxis;
    var marigin = {top: 30,
      right: 20,
      bottom: 30, 
      left: 50};

      graphObj.marigin = marigin;

      var width = 1000 - marigin.left - marigin.right;
      graphObj.width = width;
      var height = 300 - marigin.top - marigin.bottom;
      graphObj.height = height;

      var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");



  // So we can pass the x and y as strings when creating the function
  graphObj.xFunct = function(d){return d[xName]};

  // For each yObjs argument, create a yFunction
  function getYFn(column) {
    return function (d) {
      return d[column];
    };
  }

    // Object instead of array
    graphObj.yFuncts = [];
    for (var y  in yObjs) {
      yObjs[y].name = y;
        yObjs[y].yFunct = getYFn(yObjs[y].column); //Need this  list for the ymax function
        console.log("yFunct check "+yObjs[y].yFunct);
        graphObj.yFuncts.push(yObjs[y].yFunct);
      }

      graphObj.formatAsNumber = d3.format(".0f");
      graphObj.formatAsDecimal = d3.format(".2f");
      graphObj.formatAsLongDecimal = d3.format(".4f");
      graphObj.formatAsTime = d3.timeFormat("%b %d, '%y");
      graphObj.formatAsFloat = function (d) {
        if (d % 1 !== 0) {
          return d3.format(".2f")(d);
        } else {
          return d3.format(".0f")(d);
        }
        
      };

      graphObj.xFormatter = graphObj.formatAsTime;
      graphObj.yFormatter = graphObj.formatAsLongDecimal;

     graphObj.bisectYear = d3.bisector(graphObj.xFunct).left; //< Can be overridden in definition

//Create scale functions
    graphObj.xScale = d3.scaleTime().range([0, graphObj.width]).domain(d3.extent(graphObj.data, graphObj.xFunct)); //< Can be overridden in definition

// Get the max of every yFunct
graphObj.max = function (fn) {
  return d3.max(graphObj.data, fn);
};

//compute max for each variable and divide  each series by its max value
graphObj.yScale = d3.scaleLinear().range([graphObj.height, 0]).domain([0, d3.max(graphObj.yFuncts.map(graphObj.max))]);

    graphObj.formatAsYear = d3.format("");  //<---------- might need to adjust this fpr axis labels

    graphObj.xAxis = d3.axisBottom().scale(graphObj.xScale).tickFormat(graphObj.xFormatter);

    graphObj.yAxis = d3.axisLeft().scale(graphObj.yScale).tickFormat(graphObj.yFormatter);

    // Build line building functions
    function getYScaleFn(yObj) {
      return function (d) {
        console.log("yScale check "+graphObj.yScale(yObjs[yObj].yFunct(d)));
        return graphObj.yScale(yObjs[yObj].yFunct(d));
      };
    }

    for (var yObj in yObjs) {
     if (yObj == "Relapses"){
      yObjs[yObj].line = d3.line().defined(function(d){ return d.relapse > 0;})
                                         .x(function (d) {
                                           return graphObj.xScale(graphObj.xFunct(d));})
                                         .y(getYScaleFn(yObj)).curve(d3.curveStep);
      }else{
        yObjs[yObj].line = d3.line().x(function (d) {
          return graphObj.xScale(graphObj.xFunct(d));
        }).y(getYScaleFn(yObj)).curve(d3.curveBasis);
      }}

    graphObj.svg;
    
// Change graph size according to window size

graphObj.update_svg_size = function () {
  graphObj.width = parseInt(graphObj.graphDiv.style("width"), 10) - (graphObj.marigin.left + graphObj.marigin.right);

  graphObj.height = parseInt(graphObj.graphDiv.style("height"), 10) - (graphObj.marigin.top + graphObj.marigin.bottom);

  /* Update the range of the scale with new width/height */
  graphObj.xScale.range([0, graphObj.width]);
  graphObj.yScale.range([graphObj.height, 0]);

  if (!graphObj.svg) {return false;}

  /* Else Update the axis with the new scale */
  graphObj.svg.select('.x.axis').attr("transform", "translate(0," + graphObj.height + ")").call(graphObj.xAxis);
  graphObj.svg.select('.x.axis .label').attr("x", graphObj.width / 2);

  graphObj.svg.select('.y.axis').call(graphObj.yAxis);
  graphObj.svg.select('.y.axis .label').attr("x", -graphObj.height / 2);

  /* Force D3 to recalculate and update the line */
  for (var y  in yObjs) {
    yObjs[y].path.attr("d", yObjs[y].line);
    console.log("y check"+ JSON.stringify(y));
  }


  d3.selectAll(".focus.line").attr("y2", graphObj.height);

  graphObj.graphDiv.select('svg').attr("width", graphObj.width + (graphObj.marigin.left + graphObj.marigin.right)).attr("height", graphObj.height + (graphObj.marigin.top + graphObj.marigin.bottom));

  graphObj.svg.select(".overlay").attr("width", graphObj.width).attr("height", graphObj.height);
  return graphObj;
};

graphObj.bind = function (selector) {
  graphObj.mainDiv = d3.select(selector);
        // Add all the divs to make it centered and responsive
        graphObj.mainDiv.append("div").attr("class", "inner-wrapper").append("div").attr("class", "outer-box").append("div").attr("class", "inner-box");
        graphSelector = selector + " .inner-box";
        graphObj.graphDiv = d3.select(graphSelector);
        d3.select(window).on('resize.' + graphSelector, graphObj.update_svg_size);
        graphObj.update_svg_size();
        return graphObj;
      };

    graphObj.render = function () {
        //Create SVG element
        graphObj.svg = graphObj.graphDiv.append("svg").attr("class", "graph-area").attr("width", graphObj.width + (graphObj.marigin.left + graphObj.marigin.right)).attr("height", graphObj.height + (graphObj.marigin.top + graphObj.marigin.bottom)).append("g").attr("transform", "translate(" + graphObj.marigin.left + "," + graphObj.marigin.top + ")");
        // Draw Lines
        for (var y  in yObjs) {
          if(y == "Relapses"){

          //standard approach
          //Relapse logic handled in line generator
          //if else statment left for debugging purposes
           yObjs[y].path = graphObj.svg.append("g")
            .selectAll("path")
            .data(graphObj.data)
            .enter()
            .append("line")
            .attr("class", "line")
            .attr("x1", function(d, i){
              return graphObj.xScale(graphObj.xFunct(d))
            })
            .attr("y1", graphObj.height)
            .attr("x2", function(d, i){
              return graphObj.xScale(graphObj.xFunct(d))
            })
            .attr("y2", function(d){
              console.log(d.relapse)
              return graphObj.yScale(yObjs[yObj].yFunct(d))
            })
            .style("stroke-width", "5px")
            .style("stroke", color(y))
            .attr("data-series", y)

          } else{
          yObjs[y].path = graphObj.svg.append("path").datum(graphObj.data).attr("class", "line").attr("d", yObjs[y].line).style("stroke", color(y)).attr("data-series", y).on("mouseover", function () {
            focus.style("display", null);
          }).on("mouseout", function () {
            focus.transition().delay(700).style("display", "none");
          }).on("mousemove", mousemove);
        }}
        // Draw Axis
        graphObj.svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + graphObj.height + ")").call(graphObj.xAxis).append("text").attr("class", "label").attr("x", graphObj.width / 2).attr("y", 30).style("text-anchor", "middle").text(graphObj.xAxisLable);

        graphObj.svg.append("g").attr("class", "y axis").call(graphObj.yAxis).append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", -42).attr("x", -graphObj.height / 2).attr("dy", ".71em").style("text-anchor", "middle").text(graphObj.yAxisLable);

        //Draw tooltips
        var focus = graphObj.svg.append("g").attr("class", "focus").style("display", "none");

        for (var y  in yObjs) {
          yObjs[y].tooltip = focus.append("g");
          yObjs[y].tooltip.append("circle").attr("r", 5);
          yObjs[y].tooltip.append("rect").attr("x", 8).attr("y","-5").attr("width",22).attr("height",'0.75em');
          yObjs[y].tooltip.append("text").attr("x", 9).attr("dy", ".35em");
        }

        // Year label
        focus.append("text").attr("class", "focus year").attr("x", 9).attr("y", 7);
        // Focus line
        focus.append("line").attr("class", "focus line").attr("y1", 0).attr("y2", graphObj.height);

        //Draw legend
        var legend = graphObj.mainDiv.append('div').attr("class", "legend");
        for (var y  in yObjs) {
          series = legend.append('div');
          series.append('div').attr("class", "series-marker").style("background-color", color(y));
          series.append('p').text(y);
          yObjs[y].legend = series;
        }

        // Overlay to capture hover
        graphObj.svg.append("rect").attr("class", "overlay").attr("width", graphObj.width).attr("height", graphObj.height).on("mouseover", function () {
          focus.style("display", null);
        }).on("mouseout", function () {
          focus.style("display", "none");
        }).on("mousemove", mousemove);

        return graphObj;
        function mousemove() {
          //this is wht the NAN error is happening
          var x0 = graphObj.xScale.invert(d3.mouse(this)[0]), i = graphObj.bisectYear(dataset, x0, 1), d0 = graphObj.data[i - 1], d1 = graphObj.data[i];
          try {
            var d = x0 - graphObj.xFunct(d0) > graphObj.xFunct(d1) - x0 ? d1 : d0;
          } catch (e) { return;}
          minY = graphObj.height;
          for (var y  in yObjs) {
        //    console.log("tooltip y check "+ y);
            yObjs[y].tooltip.attr("transform", "translate(" + graphObj.xScale(graphObj.xFunct(d)) + "," + graphObj.yScale(yObjs[y].yFunct(d)) + ")");
            yObjs[y].tooltip.select("text").text(graphObj.yFormatter(yObjs[y].yFunct(d)));
            minY = Math.min(minY, graphObj.yScale(yObjs[y].yFunct(d)));
          }
          //console.log(minY);
          focus.select(".focus.line").attr("transform", "translate(" + graphObj.xScale(graphObj.xFunct(d)) + ")").attr("y1", minY);
          focus.select(".focus.year").text("Date: " + graphObj.xFormatter(graphObj.xFunct(d)));
        }

      };
      return graphObj;
    }

  //pass in divContainer
//   var svg = d3.select(divContainer).append("svg")
//   .attr("width", width + marigin.left + marigin.right)
//   .attr("height", height + marigin.top + marigin.bottom)
//   .append("g")
//   .attr("transform","translate(" + marigin.left + "," + marigin.top + ")");


//   var x= d3.scaleTime().range([0,width]);
//   var y= d3.scaleLinear().range([height,0]);
//   //pass in datFilePath to callback
//   //
//   var relapseEvents = [];
//   d3.json(datFilePath, function(err, data){

//      data.forEach(function(d) {
//       d.date = parseTime(d.Time);
//       var relapse_check = d.dCode.includes("RELAPSE_DURATION_");
//       console.log(relapse_check);
//       console.log(d.dCode);
//       if(relapse_check){
//         relapseEvents.push(d);
//       }
//       console.log(relapseEvents.length);
//   });
//       //formatted = data;
//       //redraw();
//       //
//   x.domain(d3.extent(data, function(d) { return d.date; }));
//   y.domain([0, d3.max(data, function(d) { return d.Engagment; })]);
//  svg.append("path")
//       .data([data])
//       .attr("class", "line")
//       .attr("d", engage_line);

//       var relapses1_10 = d3.line().x(function(d) { if(d.dCode.includes("RELAPSE_DURATION_1-10")){return x(d.date);} }).y(function(d) { if(d.dCode.includes("RELAPSE_DURATION_1-10")){return y(1);} });

//     var engage_line = d3.line().x(function(d) { return x(d.date); }).y(function(d) { return y(d.Engagment); });
//      var dailyMsg_line = d3.line()
//      .x(function(d) { return x(d.date); })
//      .y(function(d) { return y(d.dailyMsg); });
//      var diversity_line = d3.line()
//      .x(function(d) { return x(d.date); })
//      .y(function(d) { return y(d.aDiversity); });

//      relapseEvents.forEach(function(d){
//       svg.append("line")
//       .attr("x1", x(d.date))
//       .attr("y1", 0)
//       .attr("x2", x(d.date))
//       .attr("y2", height - marigin.top - marigin.bottom)
//       .style("stroke-width", 2)
//       .style("stroke", "red")
//       .style("fill", "none");
//      });

//     svg.append("path")
//       .data([data])
//       .attr("class", "line")
//       .attr("id", "dailyMsg_plot")
//       .style("stroke","#28d41c")
//       .attr("d", dailyMsg_line);

//       svg.append("path")
//       .data([data])
//       .attr("class", "line")
//       .attr("id", "diversity_plot")
//       .style("stroke","#7721d9")
//       .attr("d", diversity_line);

//       svg.append("path")
//       .data([data])
//       .attr("class", "line")
//       .attr("d", engage_line);

//       //Add the relapses
//       svg.append("path")
//       .data([data])
//       .attr("class", "line")
//       .attr("id", "diversity_plot")
//       .style("stroke","#21b5d9")
//       .attr("d", relapses1_10);

//   // Add the X Axis
//   svg.append("g")
//       .attr("class", "axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x)
//               .tickFormat(d3.timeFormat("%y")))
//       .selectAll("text")  
//         .style("text-anchor", "end")
//         .attr("dx", "-.8em")
//         .attr("dy", ".15em")
//         .attr("transform", "rotate(-65)");

//   // Add the Y Axis
//   svg.append("g")
//       .attr("class", "axis")
//       .call(d3.axisLeft(y));
//     });

// }


// function zoomed() {

//       svg.select(".x.axis").call(xAxis);
//       svg.select(".y.axis").call(yAxis);

//     svg.selectAll(".tipcircle")
//       .attr("cx", function(d,i){return x(d.date)})
//       .attr("cy",function(d,i){return y(d.value)});

//     svg.selectAll(".line")
//         .attr("class","line")
//           .attr("d", function (d) { return line(d.values)});
//   }