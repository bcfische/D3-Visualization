var svgWidth = 1000;
var svgHeight = 500;

var margin = {
  top: 50,
  right: 100,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group to hold chart, and shift by left and top margins
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";
var chosenYAxis = "healthcare";
var scaleFactor = 0.1;  // used by xScale and yScale functions

// Function used for updating scale var upon X-axis label click
function xScale(data) {
  var narray = data.map(d => d[chosenXAxis]);
  var min = d3.min(narray);
  var max = d3.max(narray);
  var linearScale = d3.scaleLinear()
    .domain([min-scaleFactor*(max-min),max+scaleFactor*(max-min)])
    .range([0, width]);
  return linearScale;
}
// Function used for updating scale var upon Y-axis label click
function yScale(data) {
  var narray = data.map(d => d[chosenYAxis]);
  var min = d3.min(narray);
  var max = d3.max(narray);
  var linearScale = d3.scaleLinear()
    .domain([min-scaleFactor*(max-min),max+scaleFactor*(max-min)])
    .range([height, 0]);
  return linearScale;
}

// Function used for updating xAxis var upon click on x-axis label
function xRenderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}
// Function used for updating yAxis var upon click on y-axis label
function yRenderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}

// Function used for updating x-values of circles group
function xRenderCircles(circlesGroup, newXScale) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
  return circlesGroup;
}
// Function used for updating y-values of circles group
function yRenderCircles(circlesGroup, newYScale) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}

// Function used for updating x-values of texts group
function xRenderTexts(textGroup, newXScale) {
  textGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]));
  return textGroup;
}
// Function used for updating y-values of texts group
function yRenderTexts(textGroup, newYScale) {
  textGroup.transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosenYAxis]));
  return textGroup;
}

d3.csv("/assets/data/data.csv")
  .then(
    function(data) {
      console.log("Got data");
      data.forEach(function(d) {
        // pick out only the fields of interest
        d.age = +d.age;               //x1
        d.healthcare = +d.healthcare; //y1
        d.income = +d.income;         //x2
        d.obesity = +d.obesity;       //y2
        d.poverty = +d.poverty;       //x3
        d.smokes = +d.smokes;         //y3
      });

      /* X Axis */
      var xLinearScale = xScale(data);
      var bottomAxis = d3.axisBottom(xLinearScale);
      var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(${margin.left}, ${height})`)
        .call(bottomAxis);
      var xLabels = chartGroup.append("g")
        .attr("transform", `translate(${width/2+margin.left}, ${height+30})`);
      var xAgeLabel = xLabels.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age")
        .classed("active", (chosenXAxis==="age"))
        .classed("inactive", !(chosenXAxis==="age"))
        .text("Median Age");
      var xIncomeLabel = xLabels.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income")
        .classed("active", (chosenXAxis==="income"))
        .classed("inactive", !(chosenXAxis==="income"))
        .text("Median Income");
      var xPovertyLabel = xLabels.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "poverty")
        .classed("active", (chosenXAxis==="poverty"))
        .classed("inactive", !(chosenXAxis==="poverty"))
        .text("Poverty Rate");

      /* Y Axis */
      var yLinearScale = yScale(data);
      var leftAxis = d3.axisLeft(yLinearScale);
      var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(leftAxis);
      var yLabels = chartGroup.append("g")
        .attr("transform", `translate(0, ${height/2})`);
      var yHealthcareLabel = yLabels.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("value", "healthcare")
        .classed("active", (chosenYAxis==="healthcare"))
        .classed("inactive", !(chosenYAxis==="healthcare"))
        .text("Insured Rate");
      var yObesityLabel = yLabels.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "obesity")
        .classed("active", (chosenYAxis==="obesity"))
        .classed("inactive", !(chosenYAxis==="obesity"))
        .text("Obesity Rate");
      var ySmokesLabel = yLabels.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "smokes")
        .classed("active", (chosenYAxis==="smokes"))
        .classed("inactive", !(chosenYAxis==="smokes"))
        .text("Smoking Rate");

      /* Data Points */
      var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("transform", `translate(${margin.left}, 0)`)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "10")
        .attr("fill", "blue")
        .attr("opacity", "0.5");
      var textsGroup = chartGroup.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("transform", `translate(${margin.left}, 0)`)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(d => d.abbr)
        .attr("font-size", "12px")
        .attr("fill", "black");

      /* X Label Click Event */
      xLabels.selectAll("text")
        .on("click", function() {
          var value = d3.select(this).attr("value");
          if (value !== chosenXAxis) {
            chosenXAxis = value;
            xLinearScale = xScale(data);
            xAxis = xRenderAxes(xLinearScale, xAxis);
            circlesGroup = xRenderCircles(circlesGroup, xLinearScale);
            textsGroup = xRenderTexts(textsGroup, xLinearScale);
            xAgeLabel
              .classed("active", (chosenXAxis==="age"))
              .classed("inactive", !(chosenXAxis==="age"));
            xIncomeLabel
              .classed("active", (chosenXAxis==="income"))
              .classed("inactive", !(chosenXAxis==="income"));
            xPovertyLabel
              .classed("active", (chosenXAxis==="poverty"))
              .classed("inactive", !(chosenXAxis==="poverty"));
          }
        });

      /* Y Label Click Event */
      yLabels.selectAll("text")
        .on("click", function() {
          var value = d3.select(this).attr("value");
          if (value !== chosenYAxis) {
            chosenYAxis = value;
            yLinearScale = yScale(data);
            yAxis = yRenderAxes(yLinearScale, yAxis);
            circlesGroup = yRenderCircles(circlesGroup, yLinearScale);
            textsGroup = yRenderTexts(textsGroup, yLinearScale);
            yHealthcareLabel
              .classed("active", (chosenYAxis==="healthcare"))
              .classed("inactive", !(chosenYAxis==="healthcare"));
            yObesityLabel
              .classed("active", (chosenYAxis==="obesity"))
              .classed("inactive", !(chosenYAxis==="obesity"));
            ySmokesLabel
              .classed("active", (chosenYAxis==="smokes"))
              .classed("inactive", !(chosenYAxis==="smokes"));
          }
        });
    }
  );