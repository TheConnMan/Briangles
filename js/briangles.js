function init(wi, hi, size) {
	var m = [ 180, 40, 50, 120 ],
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

	var tri = svg.selectAll('.base')
			.data(nodes)
			.enter()
			.append('g')
			.attr("class", 'base')
			
		svg.selectAll(".base")
			.append("path")
			.attr("class", function(d) { return "triangle color triangle-" + d.i + '-' + d.j })
			.attr('stroke', 'red')
			.attr('stroke-dasharray', function(d) { return (3 * wid / 5.55) })
			
		svg.selectAll(".base")
			.append("path")
			.attr("class", function(d) { return "triangle color triangle-" + d.i + '-' + d.j })
			.attr('stroke', 'green')
			.attr('stroke-dasharray', function(d) { return (2 * wid / 5.55) + ',' + (wid / 5.55) })
			
		svg.selectAll(".base")
			.append("path")
			.attr("class", function(d) { return "triangle color triangle-" + d.i + '-' + d.j })
			.attr('stroke', 'blue')
			.attr('stroke-dasharray', function(d) { return (wid / 5.55) + ',' + (2 * wid / 5.55) })
			
		svg.selectAll(".base")
			.append("path")
			.attr("class", function(d) { return "triangle none triangle-" + d.i + '-' + d.j })
			.attr('stroke', 'white')
			.attr('stroke-width', .5)
			
		svg.selectAll('.base')
			.attr("transform", function(d) { return "translate(" + (d.x + d.dx) + "," + (d.y + d.dy) + ")rotate(" + d.r + ")scale(" + d.s + ")"; })
			.on('click', function(e) {
				e.r += 120
				e.dx = Math.sin(e.r / 180 * Math.PI) / Math.sqrt(3) / 4 * wid
				e.dy = - Math.cos(e.r / 180 * Math.PI) / Math.sqrt(3) / 4 * wid
				d3.select(this).transition()
			      .duration(750).attr('transform', 'translate(' + (e.x + e.dx) + ', ' + (e.y + e.dy) + ')rotate(' + e.r + ')scale(' + e.s + ')')
			})
			
		svg.selectAll('.triangle')
			.attr("d", d3.svg.symbol().type('triangle-up'))
		svg.selectAll('.none')
			.style('fill', function(d) { return '#' + Math.floor(Math.random()*16777215).toString(16); })
}