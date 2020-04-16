// @TODO: YOUR CODE HERE!
const svgWidth = 960
const svgHeight = 500

let margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
}

let width = svgWidth - margin.left - margin.right
let height = svgHeight - margin.top - margin.bottom

let svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

let chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

// View selection - changing this triggers transition
let currentX = "poverty"
let currentY = "healthcare"

/**
 * Returns a updated scale based on the current selection.
 **/
function xScale(data, currentX) {   
  let xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(data.map(d => parseInt(d[currentX]))) * 0.8,
      d3.max(data.map(d => parseInt(d[currentX]))) * 1.2
    ])
    .range([0, width])

  return xLinearScale
}


function yScale(data, currentY) {   
    let yLinearScale = d3
      .scaleLinear()
      .domain([
        d3.min(data.map(d => parseInt(d[currentY]))) * 0.8,
        d3.max(data.map(d => parseInt(d[currentY]))) * 1.2
      ])
      .range([height, 0])
  
    return yLinearScale
  }
/**
 * Returns and appends an updated x-axis based on a scale.
 **/
function renderAxesX(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale)

  yAxis
    .transition()
    .duration(1000)
    .call(bottomAxis)

  return xAxis
}


function renderAxesY(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale)
  
    yAxis
      .transition()
      .duration(1000)
      .call(leftAxis)
  
    return yAxis
  }
/**
 * Returns and appends an updated circles group based on a new scale and the currect selection.
 **/
function renderCircles(circlesGroup, newXScale, newYScale, currentX, currentY) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[currentX]))
    .attr("cy", d => newYScale(d[currentY]));

  return circlesGroup;
}

function renderText(textGroup, newXScale, newYScale, currentX, currentY) {
    textGroup
      .transition()
      .duration(1000)
      .attr("x", d => newXScale(d[currentX]))
      .attr("y", d => newYScale(d[currentY]));

    return textGroup;
  }

; (function() {
  d3.csv("../data/data.csv").then(data => {
    let xLinearScale = xScale(data, currentX)
    let yLinearScale = yScale(data, currentY)

    let bottomAxis = d3.axisBottom(xLinearScale)
    let leftAxis = d3.axisLeft(yLinearScale)

    xAxis = chartGroup
      .append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis)

    yAxis = chartGroup
      .append("g")
      .classed("y-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(leftAxis)


    let circlesGroup = chartGroup
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[currentX]))
      .attr("cy", d => yLinearScale(d[currentY]))
      .attr("r", 20)
      .attr("fill", "blue")
      .attr("opacity", ".5")


    let textGroup = chartGroup.selectAll('.stateText')
      .data(data)
      .enter()
      .append('text')
      .classed('stateText', true)
      .attr('x', d => xLinearScale(d[currentX]))
      .attr('y', d => yLinearScale(d[currentY]))
      .attr('dy', 3)
      .attr('font-size', '7px')
      .text(d => d.abbr)

    let labelsGroup = chartGroup
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`)

    labelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty")
      .classed("active", true)
      .text("% in Poverty")

    labelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age")
      .classed("inactive", true)
      .text("Median Age")

    chartGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Median Household Income")

    // Crate an event listener to call the update functions when a label is clicked
    labelsGroupX.selectAll("text").on("click", function() {
      let value = d3.select(this).attr("value")
      if (value !== currentX) {
        currentSelection = value
        xLinearScale = xScale(data, currentX)
        yLinearScale = yScale(data, currentY)
        xAxis = renderAxes(xLinearScale, xAxis)
        circlesGroup = renderCircles(
          circlesGroup,
          xLinearScale,
          yLinearScale,
          currentX
        )
      }
    })
    labelsGroupY.selectAll("text").on("click", function() {
      let value = d3.select(this).attr("value")
      if (value !== currentY) {
        currentSelection = value
        xLinearScale = xScale(data, currentX)
        yLinearScale = yScale(data, currentY)
        xAxis = renderAxes(xLinearScale, xAxis)
        circlesGroup = renderCircles(
          circlesGroup,
          xLinearScale,
          yLinearScale,
          currentY
        )
      }
    })
  })
})()
