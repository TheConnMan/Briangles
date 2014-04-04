function init(w, h, size) {
	var m = [ 250, 100, 40, 150 ];

	var triW = (w - 200) / size;
	var wid = triW * 46 / 75;
	
	d3.select("#game").html('')

	var svg = d3.select("#game").append("svg:svg").attr("width",
			w).attr("height", h).append("svg:g")
			.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	var nodes = [];
	var colors = ['r', 'g', 'b'];
	var moves = 0;

	for (var i = 0; i < size; i++) {
		nodes.push({
			i : 0,
			j : i
		})
	}
	for (var i = 1; i < size * 2; i += 2) {
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
	
	nodes.forEach(function(d) {
		if (d.i % 2 == 0) {
			d.r = 0
			d.f = false
		} else {
			d.r = 180
			d.f = true
		}
		d.c = {}
		d.c.r = 30
		if (Math.random() > 0.5) {
			d.c.g = 150
			d.c.b = 270
		} else {
			d.c.b = 150
			d.c.g = 270
		}
		d.s = triW / 20
		d.x = (d.i / 2 + d.j + (d.i % 2) / 2 - (d.i + d.i % 2) / 4) * triW
		d.y = ((size - d.i) * triW) / 2 - Math.cos(d.r / 180 * Math.PI) / Math.sqrt(3) / 4 * wid
		d.dx = 0
		d.dy = - Math.cos(d.r / 180 * Math.PI) / Math.sqrt(3) / 4 * wid
		if (d.i == 0 && d.j == 0) {
			d.fixed = '#00FF00';
			d.fixedC = 'g';
			d.color = {r: 0, g: 0, b: 0}
		} else if (d.i == 0 && d.j == (size - 1)) {
			d.fixed = '#FF0000';
			d.fixedC = 'r';
			d.color = {r: 0, g: 0, b: 0}
		} else if (d.j == 0 && d.i == (2 * size - 2)) {
			d.fixed = '#0000FF';
			d.fixedC = 'b';
			d.color = {r: 0, g: 0, b: 0}
		} else {
			d.color = {
				r: Math.floor(Math.random() * 16 * 16),
				g: Math.floor(Math.random() * 16 * 16),
				b: Math.floor(Math.random() * 16 * 16)
			}
		}
	})

	var tri = svg.selectAll('.base')
			.data(nodes)
			.enter()
			.append('g')
			.attr("class", 'base')
			
		svg.selectAll(".base")
			.append("path")
			.attr("class", function(d) { return "triangle color triangle-" + d.i + '-' + d.j })
			.attr('stroke', function(d) { return d.fixed ? d.fixed : 'red' })
			.attr('stroke-dasharray', '12.2')
			
		svg.selectAll(".base")
			.append("path")
			.attr("class", function(d) { return "triangle color triangle-" + d.i + '-' + d.j })
			.attr('stroke', function(d) { return d.fixed ? d.fixed : (d.c.g == 150 ? 'blue' : 'green') })
			.attr('stroke-dasharray', '24.4,12.2')
			
		svg.selectAll(".base")
			.append("path")
			.attr("class", function(d) { return "triangle color triangle-" + d.i + '-' + d.j })
			.attr('stroke', function(d) { return d.fixed ? d.fixed : (d.c.b == 150 ? 'blue' : 'green') })
			.attr('stroke-dasharray', '12.2,24.4')
			
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
			.on('contextmenu', function(e) {
				if (!e.fixed && !(e.color.r == 0 && e.color.g == 0 && e.color.b == 0)) {
					disperseColor(e)
				}
				d3.event.preventDefault();
			})
			
		svg.selectAll('.triangle')
			.attr("d", d3.svg.symbol().type('triangle-up'))
		svg.selectAll('.none')
			.style('fill', function(d) { if (!d.fixed) { return d3.rgb(d.color.r, d.color.g, d.color.b) } else { return d.fixed } })

		function disperseColor(d) {
			colors.forEach(function(c) {
				var adj = getAdjacent(d, c)
				if (adj && (!adj.fixedC || adj.fixedC == c)) {
					adj.color[c] = adj.color[c] + d.color[c]
					d.color[c] = 0
					if (!adj.fixed) {
						d3.selectAll('.triangle-' + adj.i + '-' + adj.j)
							.transition().duration(750).style('fill', d3.rgb(adj.color.r, adj.color.g, adj.color.b));
					}
				}
			})
			d3.selectAll('.triangle-' + d.i + '-' + d.j)
				.transition().duration(750).style('fill', d3.rgb(d.color.r, d.color.g, d.color.b));
			refreshScores()
		}

		function getAdjacent(d, color) {
			var delta;
			if ((d.r + d.c[color]) % 360 == 150) {
				delta = [1, 0]
			} else if ((d.r + d.c[color]) % 360 == 90) {
				delta = [1, 0]
			} else if ((d.r + d.c[color]) % 360 == 30) {
				delta = [1, -1]
			} else if ((d.r + d.c[color]) % 360 == 330) {
				delta = [-1, 0]
			} else if ((d.r + d.c[color]) % 360 == 270) {
				delta = [-1, 0]
			} else if ((d.r + d.c[color]) % 360 == 210) {
				delta = [-1, 1]
			}
			return $.grep(nodes, function(e) { return (e.i == (d.i + delta[0]) && e.j == (d.j + delta[1])) })[0]
		}
		
		function refreshScores() {
			moves++
			$('#moves').html(moves)
			colors.forEach(function(c) {
				var d = $.grep(nodes, function(e) { return e.fixedC == c })[0]
				$('#' + c).html(d.color[c])
			})
		}
}