// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 600;

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

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare"

// function used for updating x-scale var upon click on axis label
function xScale(health_data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(health_data, d => d[chosenXAxis]) * 0.8,
        d3.max(health_data, d => d[chosenXAxis]) * 1.1
      ])
      .range([0, width]);
  
    return xLinearScale;
}

function yScale(health_data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(health_data, d => d[chosenYAxis]) * 0.8,
      d3.max(health_data, d => d[chosenYAxis]) * 1.1
    ])
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on x-axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  return xAxis;
}
// function used for updating yAxis var upon click on y-axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
  return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}

// function to update text of x-circles
function renderXText(textGroup, newXScale, chosenXAxis) {
  textGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]));
  return textGroup
}
// function to update text of y-circles
function renderYText(textGroup, newYScale, chosenYAxis) {
  textGroup.transition()
    .duration(1000)
    .attr("dy", d => newYScale(d[chosenYAxis]));
  return textGroup
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, textGroup) {

  if (chosenXAxis === "poverty") {
    var xlabel = "In Poverty, %";
  }
  else if (chosenXAxis === "age") {
    var xlabel = "Age (Median)"
  }
  else {
    var xlabel = "Household Income (Median)"
  }

  if (chosenYAxis === "obesity") {
    var ylabel = "Obese %";
  }
  else {
    var ylabel = "Smokes, %";
  }
  
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .direction("n")
    .html(function(d) {
      return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`);
    });
  textGroup.call(toolTip);

  // onmouseon event
  textGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return textGroup;
}  
// Retrieve data from the CSV file and execute everything below
d3.csv("/assets/data/health_data.csv").then(successHandle).catch(errorHandle);

function errorHandle(error){
  throw error;
}

function successHandle(health_data) {
  health_data.forEach(function(data) {
    data.id = +data.id;
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income; 
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });
  // Create LinearScale functions for x, y
  var xLinearScale = xScale(health_data, chosenXAxis);
  var yLinearScale = yScale(health_data, chosenYAxis);

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
    .classed("y-axis", true)
    .call(leftAxis);
  
  var combinedGroup = chartGroup.append("g")
    .classed("data-group", true);

  // append initial circles
  var circlesGroup = combinedGroup.selectAll("circle")
    .data(health_data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 12)
    .attr("fill", "blue")
    .attr("opacity", ".4");


  var textGroup = combinedGroup.selectAll("text")
    .data(health_data)
    .enter()
    .append("text")
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]))
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "10px")
    .text(d => d.abbr);

  // Create group for  2 x- axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty, %");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // Y-axis label groups

  var healthcareLabel = ylabelsGroup.append("text")
  .attr("x", 0 - (height / 2))
  .attr("y", 0 - margin.left + 40)
  .attr("value", "healthcare") // value to grab for event listener
  .classed("active", true)
  .text("Lacks Healthcare, %");

  var obeseLabel = ylabelsGroup.append("text")
  .attr("x", 0 - (height / 2))
  .attr("y", 0 - margin.left + 20)
  .attr("value", "obesity") // value to grab for event listener
  .classed("inactive", true)
  .text("Obese, %");

  var smokesLabel = ylabelsGroup.append("text")
  .attr("x", 0 - (height / 2))
  .attr("y", 0 - margin.left + 60)
  .attr("value", "smokes") // value to grab for event listener
  .classed("inactive", true)
  .text("Smokes, %");


  // updateToolTip function above csv import
  var textGroup = updateToolTip(chosenXAxis, chosenYAxis, textGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // updates x scale for new data
        xLinearScale = xScale(health_data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values and corresponding text
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
        textGroup = renderXText(textGroup, xLinearScale, chosenXAxis)
        textGroup = updateToolTip(chosenXAxis, chosenYAxis, textGroup)
        // updates tooltips with new info
        // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age"){
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
  // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {
        chosenYAxis = value;  // replaces chosenYAxis with value
        yLinearScale = yScale(health_data, chosenYAxis); // updates y scale for new data
        yAxis = renderYAxes(yLinearScale, yAxis); // updates y axis with transition
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis); // updates circles with new x values
        textGroup = renderYText(textGroup, yLinearScale, chosenYAxis); // updates text with new y values
        textGroup = updateToolTip(chosenXAxis, chosenYAxis, textGroup); // updates tooltips with new info

        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes") {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
}
