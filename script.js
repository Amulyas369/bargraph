const data = [
    { label: 'Bar 1', value: 80 },
    { label: 'Bar 2', value: 60 },
    { label: 'Bar 3', value: 40 },
    { label: 'Bar 4', value: 90 },
    { label: 'Bar 5', value: 30 }
  ];

  const margin = { top: 20, right: 40, bottom: 40, left: 40 };
  const width = 400 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .nice()
    .range([height, 0]);

  const bars = svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.label))
    .attr("width", x.bandwidth())
    .attr("y", height) // Initial position at the bottom
    .attr("height", 0) // Initial height of 0
    .style("fill", "#1DA1F2"); // Twitter color

  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y).tickFormat(d => (d !== 50 ? d : "Break")); // Hide tick label at 50

  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  // Create the scale break line with transition
  const scaleBreakLine = svg.append("rect")
    .attr("x", -1) // Adjusted to hide the left border
    .attr("y", y(50) - 10)
    .attr("width", 0)
    .attr("height", 20)
    .style("fill", "white")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", 1);

  scaleBreakLine.transition()
    .delay(3000) // Delay the start of the scale break transition
    .duration(3000)
    .attr("width", width);

  const yAxisGroup = svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  // Transition the bars to their respective levels
  bars.transition()
    .delay((d, i) => i * 200) // Delay each bar's transition
    .duration(3000)
    .attr("y", d => y(d.value))
    .attr("height", d => height - y(d.value));