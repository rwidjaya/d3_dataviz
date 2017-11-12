var margin = {top: 300, right: 125, bottom: 100, left: 75};
var width = 900 - margin.left - margin.right;
var height = 900 - margin.top - margin.bottom;


d3.json("negative.json", function(error, data){
  if (error) {throw error} else {
    data.MED_PW = +data.MED_PW;
    dataset = data.sort(function(x, y) {
      return d3.descending(x.MED_PW, y.MED_PW);
    });
    makeNegativeBar();}
  });

// Begin Function
function makeNegativeBar(){
  console.log(dataset);

  svg = d3.select("#chart")
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  var format = d3.format(",.0f");

  var x = d3.scaleBand()
    .range([0, width]).padding(0.1)
    .domain(dataset.map(function(d) {return d.NAIC_CODE_TITLE}));

  var y = d3.scaleLinear()
    .range([height, 0])
    .domain([d3.max(dataset, function(d) { return d.MED_PW; }), 0]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(d3.axisTop(x))
    .selectAll("text")
    .style("text-anchor", "start")
    .attr("dx", ".5em")
    .attr("dy", "1em")
    .attr("transform", "rotate(-55)" )

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+margin.left+","+margin.top+")")
      .call(d3.axisLeft(y)
        .tickFormat(function(d) { return "$" + format(d); }))
    .append("text")            
      .attr("transform", "rotate(-90)")
      .attr("x", -height - 75)
      .attr("y", -7 )
      .attr("dy", ".71em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .style("text-anchor", "start")
      .text("Median Income");

  g = svg.append("g")          
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  g.selectAll(".bar")
    .data(dataset)
      .enter()
      .append("rect")            
      .attr("x", function(d) { return x(d.NAIC_CODE_TITLE); })
      .attr("y", 1)
      .attr("height", function(d) { return y(d.MED_PW); })
      .attr("width", x.bandwidth())
      // .style('fill', function(d) {
      //   var colors = ['#138d86', '#41b097' , '#86d6a7', '#c3dfa8', '#edd9a1',
      //     '#ec967b', '#dc605d', '#8f3c4a', '#603d5d']
      //   var col
      //   for (i = 0; i < 10; i++) {
      //     if (d.CAT == i + 1) {col = colors[i]}
      //   }
      //   return col
      // })
      // .on("click", function(){
      //   d3.select(this)
      //     .attr
      // })
      .attr('class', function(d) {
        if (d.STEM == 'STEM') {
          return 'bar STEM'
        }
        else {
          return 'bar Non-STEM'
        }
      });


  // Title, Subtitle, and Caption
  svg.append("text")
    .attr("class", "title")
    .attr("x", width/3 - 20)
    .attr("y", 1.5*height)
    .text("STEM H1-B workers are generally paid better.");

  svg.append("text")
    .attr("class", "subtitle")
    .attr("x", width/3 - 20)
    .attr("y", 1.5*height + 30)
    .text("H1-B Median Wage by Industry");

  svg.append("text")
    .attr("class", "caption")
    .attr("x", width/3 - 20)
    .attr("y", 1.5*height + 50)
    .text("Source: USCIS | A sample of 200 Applicants, Industries by NAIC Classification.");


  // Data Label 
  g.selectAll("text")     
    .data(dataset)
    .enter()
    .append("text")
    .attr("class","label")
    .attr("transform", "rotate(-90)")
    .attr("x", (function(d) { return -y(d.MED_PW) + 30; }))
    .attr("y", function(d) { return x(d.NAIC_CODE_TITLE) + (x.bandwidth()/4) ;})
    .attr("dy", ".75em")
    .text(function(d) {return format(d.MED_PW);});
  

  // Constructing LEGEND
  var legendRectSize = 18;
  var legendSpacing = 4;
  legendVar = d3.set(dataset.map( function(d) { return d.STEM } ) ).values();

  var legendVar1 = d3.scaleOrdinal()
    .domain(legendVar)
    .range(["#fcbe32", "#8c8c8c"]);

  var legend = svg.selectAll('.legend')
    .data(legendVar1.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      var tall = legendRectSize + legendSpacing;
      var offset =  tall * d.length / 2;
      var horz = width - 10 * tall;
      var vert = 110 + height - (i * tall);
      return 'translate(' + horz + ',' + vert + ')'
    });

  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', legendVar1)
    .style('stroke', legendVar1);

  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d.toUpperCase(); });

};