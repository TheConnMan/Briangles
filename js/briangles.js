function init(wi, hi, size) {
	var m = [ 150, 120, 50, 180 ],
		w = wi - m[1] - m[3], h = hi - m[0] - m[2];

	var triW = w / size;
	var wid = triW * 46 / 75;

	var svg = d3.select("#game").append("svg:svg").attr("width",
			w + m[1] + m[3]).attr("height", h + m[0] + m[2]).append("svg:g")
			.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	var nodes = [];

	for (var i = 0; i < size; i++) {
		nodes.push({
			i : 0,
			j : i
		})
	}
	for (var i = 1; i < size; i += 2) {
		for (var j = 0; j < (size - (i / 2) - 1); j++) {
			nodes.push({
				i : i,
				j : j
			})
			nodes.push({
				i : i + 1,
				j : j
			})
		}
	}
	nodes.push({
		i : 2 * size - 3,
		j : 0
	})
	nodes.push({
		i : 2 * size - 2,
		j : 0
	})
	
	nodes.forEach(function(d) {
		if (d.i % 2 == 0) {
			d.r = 0
		} else {
			d.r = 180
		}
		d.s = triW / 20
		d.x = (d.i / 2 + d.j + (d.i % 2) / 2 - (d.i + d.i % 2) / 4) * triW
		d.y = ((size - d.i) * triW) / 2 - Math.cos(d.r / 180 * Math.PI) / Math.sqrt(3) / 4 * wid
		d.dx = 0
		d.dy = - Math.cos(d.r / 180 * Math.PI) / Math.sqrt(3) / 4 * wid
	})

	var tri = svg
			.selectAll(".triangle")
			.data(nodes)
			.enter()
			.append("path")
			.attr("class", "triangle")
			.attr("d", d3.svg.symbol().type('triangle-up'))
			.attr("transform", function(d) { return "translate(" + (d.x + d.dx) + "," + (d.y + d.dy) + ")rotate(" + d.r + ")scale(" + d.s + ")"; })
			.style('fill', function(d) { return '#' + Math.floor(Math.random()*16777215).toString(16); })
			.style('stroke', function(d) { return '#' + Math.floor(Math.random()*16777215).toString(16); })
			.style('margin-bottom', 30)
			// .attr("d", function(d) { var type = ('triangle-' + (d.j % 2 == 0 ? 'up' : 'down')); console.log(type); return d3.svg.symbol().type(type); })
			.on('click', function(d) {
				d.r += 120
				d.dx = Math.sin(d.r / 180 * Math.PI) / Math.sqrt(3) / 4 * wid
				d.dy = - Math.cos(d.r / 180 * Math.PI) / Math.sqrt(3) / 4 * wid
				d3.select(this).transition()
			      .duration(750).attr('transform', 'translate(' + (d.x + d.dx) + ', ' + (d.y + d.dy) + ')rotate(' + d.r + ')scale(' + d.s + ')')
			})

	console.log(nodes)
	console.log('Done')
}