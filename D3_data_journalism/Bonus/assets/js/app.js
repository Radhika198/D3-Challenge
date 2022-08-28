// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Xscale Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]-0.2) ,
      d3.max(censusData, d => d[chosenXAxis])
    ])
    .range([0, width]);

  return xLinearScale;

}


// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}




// Initial Yscale Params
var chosenYAxis = "healthcare";

// function used for updating Y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]-0.7) ,
      d3.max(censusData, d => d[chosenYAxis])
    ])
    .range([height, 0]);

  return yLinearScale;

}
// function used for updating y-Axis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var LeftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(LeftAxis);

  return yAxis;
}


// function used for updating circles group with a transition to new circles by yAxis
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
};


//function used for update text in circle with a transition to new circles by xAxis
function renderXtext(circlestext, newXScale, chosenXAxis) {

  circlestext.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]));

  return circlestext;
};


//function used for update text in circle with a transition to new circles by xAxis
function renderYtext(circlestext, newYScale, chosenYAxis) {

  circlestext.transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosenYAxis]));

  return circlestext;
};

// function used for updating circles group with new tooltip
function updateToolTipx(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "age" ) {
    var labelx = "Age" 
    var labely =chosenYAxis
  }
 
  else if (chosenXAxis === "income" ){    
    var labelx ="Income"
    var labely =chosenYAxis
  }
  else {
    var labelx ="Poverty"
    var labely =chosenYAxis
  };

  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .html(function(d) {
    return (`${d.state}<br>${labelx}: ${d[chosenXAxis]}%<br><br> ${labely}:${d[chosenYAxis]}%`);
  });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
  .on("mouseout", function(data, index) {
      toolTip.hide(data);
  });

  return circlesGroup;
}



// function used for updating circles group with new tooltip
function updateToolTipy(chosenYAxis, circlesGroup) {

  if (chosenYAxis === "smokes" ) {
    var labely = "Smokes" 
    var labelx =chosenXAxis
  }
  else if (chosenYAxis === "obesity" ) {
    var labely = "Obesity" 
    var labelx =chosenXAxis
  }
  else {    
    var labely ="Risk of Healthcare"
    var labelx =chosenXAxis
  };

  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .html(function(d) {
    return (`${d.state}<br>${labelx}: ${d[chosenXAxis]}%<br> ${labely}:${d[chosenYAxis]}%`);
  });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(censusData, err) {
  if (err) throw err;

  // parse data
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.abbr = data.abbr;
    data.age = + data.age;
    data.income = +data.income;
    data.smokes = + data.smokes;
    data.obesity = + data.obesity;
    //console.log(data.abbr);
    //console.log(data.poverty);
    //console.log(data.smokes)
    //console.log(data.age)
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);
  

  // Create y scale function
  var yLinearScale = yScale(censusData, chosenYAxis);

//   var yLinearScale = d3.scaleLinear()
//     .domain([0, d3.max(censusData, d => d.healthcare)])
//     .range([height, 0]);
    

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 12)
    .attr("fill", "orange")
    .attr("opacity", ".5");


//adding text element inside the circle
var circlestext = chartGroup.selectAll(".stateText")
                  .data(censusData)
                  .enter()
                  .append("text")
                  .classed ("stateText", true)
                  .attr("x", d => xLinearScale(d[chosenXAxis]))
                  .attr("y", d => yLinearScale(d[chosenYAxis]))
                  .attr("font-size", "8px")
                  .text(d => d.abbr)
                  .attr("text-anchor", "middle")
                  .attr("fill", "white");
                  
  // Create group for  2 x- axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var PovertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var AgeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var IncomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // create group for 3 y-axis labels
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var healthcareLabel =ylabelsGroup.append("text")
    .attr("y", 0 - margin.left+40)
    .attr("x", 0 - (height / 2))
    .attr("value", "healthcare") // value to grab for event listener
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");

  var smokesLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left+20)
    .attr("x", 0 - (height / 2))
    .attr("value", "smokes") // value to grab for event listener
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Smokes(%)");

  var obeseLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("value", "obesity") // value to grab for event listener
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Obese (%)");


  // updateToolTip function above csv import
  var circlesGroup = updateToolTipx(chosenXAxis, circlesGroup);
  var circlesGroup = updateToolTipy(chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
        circlestext = renderXtext (circlestext,xLinearScale,chosenXAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTipx(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        //Xaxis
        if (chosenXAxis === "age") {
          AgeLabel
            .classed("active", true)
            .classed("inactive", false);
          PovertyLabel
            .classed("active", false)
            .classed("inactive", true);
          IncomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if(chosenXAxis === "income") {
          AgeLabel
            .classed("active", false)
            .classed("inactive", true);
          PovertyLabel
            .classed("active", false)
            .classed("inactive", true);
          IncomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else {
          AgeLabel
            .classed("active", false)
            .classed("inactive", true);
          PovertyLabel
            .classed("active", true)
            .classed("inactive", false);
          IncomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }

        
      }
    });

    // y axis labels event listener
    ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

         console.log(chosenYAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
        circlestext = renderYtext (circlestext,yLinearScale,chosenYAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTipy(chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "smokes") {
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "healthcare"){
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    
    });

}).catch(function(error) {
  console.log(error);
});