function init(wi, hi, size) {
	var m = [ 20, 120, 20, 180 ], w = wi - m[1] - m[3], h = hi - m[0] - m[2];

	var triW = w / size;

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

	var tri = svg
			.selectAll(".triangle")
			.data(nodes)
			.enter()
			.append("path")
			.attr("class", "triangle")
			.attr("transform", function(d) { return "translate(" + (w - (d.i / 2 + d.j + (d.i % 2) / 2 + -(d.i + d.i % 2) / 4) * triW) + "," + (h - (d.i * triW) / 2) + ")"; })
			.attr("d", d3.svg.symbol().type('triangle-up').size(triW * 15))
			// .attr("d", function(d) { var type = ('triangle-' + (d.j % 2 == 0
			// ? 'up' : 'down')); console.log(type); return
			// d3.svg.symbol().type(type); })
			.on('click', function(d) {
				clicked(d)
			})
			
	function clicked(d) {
		console.log(d)
	}

	console.log(nodes)
	console.log('Done')
}