(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var rand = require('./Rand');

var ParticleSeeder = function (n, width, height, depth, max_velocity_component) {
	console.log(max_velocity_component);
	var particles = [];

	for (var i = 0; i < n; i++) {
		particles.push({
			coordinates: [
				rand(0, width),
				rand(0, height),
				rand(0, depth)
			],
			velocity: [
				rand(-1*max_velocity_component*100, max_velocity_component*100)/100,
				rand(-1*max_velocity_component*100, max_velocity_component*100)/100,
				rand(-1*max_velocity_component*100, max_velocity_component*100)/100
			]
		});
	}

	return particles;
};

module.exports = ParticleSeeder;
},{"./Rand":5}],2:[function(require,module,exports){
module.exports = function (particles) {
	for (var i = 1; i < particles.length; i++) {
		var tmp = particles[i];

		for (var j = i; j > 0; j--) {
			if (j > 0 && particles[j-1].coordinates[0] > tmp.coordinates[0]) {
				particles[j] = particles[j-1];
				continue;
			}
			
			break;
		}

		particles[j] = tmp;
	}
};
},{}],3:[function(require,module,exports){
module.exports = function (particles, width, height, depth) {
	for (var i = 0; i < particles.length; i++) {
		var particle = particles[i];

		var x = particle.coordinates[0]+particle.velocity[0];
		var y = particle.coordinates[1]+particle.velocity[1];
		var z = particle.coordinates[2]+particle.velocity[2];

		if (x > width || x < 0) {
			particle.velocity[0] *= -1;
		}

		if (y > height || y < 0) {
			particle.velocity[1] *= -1;
		}

		if (z > depth || z < 0) {
			particle.velocity[2] *= -1;
		}

		particle.coordinates[0] += particle.velocity[0];
		particle.coordinates[1] += particle.velocity[1];
		particle.coordinates[2] += particle.velocity[2];
	}
};
},{}],4:[function(require,module,exports){
module.exports = function (particles, index, radius) {
	var particle = particles[index];
	var r_sqr = Math.pow(radius, 2);
	var x_max = particle.coordinates[0]+radius;
	var y_max = particle.coordinates[1]+radius;
	var z_max = particle.coordinates[2]+radius;


	var in_range = [];

	for (var i = index+1; i < particles.length; i++) {
		var cur_p = particles[i];
		if (cur_p.coordinates[0] <= x_max) {
			var s = Math.sqrt(Math.pow(
				particle.coordinates[0]-cur_p.coordinates[0], 2) 
				+ Math.pow(particle.coordinates[1]-cur_p.coordinates[1], 2)
				+ Math.pow(particle.coordinates[2]-cur_p.coordinates[2], 2));
			
			if (cur_p.coordinates[1] <= y_max && cur_p.coordinates[2] <= z_max && s <= radius) {
				in_range.push({
					particle: cur_p,
					distance: s
				});
			}
		} else {
			break;
		}
	}

	return in_range;
};
},{}],5:[function(require,module,exports){
module.exports = function (min, max) {
	return min+(Math.round(Math.random()*Math.pow(10, Math.floor(Math.log10(max))+1))%(max-min));
};
},{}],6:[function(require,module,exports){
var ParticleSeeder = require('./ParticleSeeder');
var ParticleSorter = require('./ParticleSorter');
var RadiusSearch = require('./RadiusSearch');
var ParticleVelocity = require('./ParticleVelocity');

$(function () {
	var width = $('#canvas').width();
	var height = $('#canvas').height();
	var depth = height;
	var radius = height/2;
	var count = 25;

	var particles = ParticleSeeder(count, width, height, depth, 1);
	ParticleSorter(particles);

	var canvas = $('#canvas');
	canvas.attr('width', width).attr('height', height);

	var ctx = canvas[0].getContext('2d');


	var animate = function () {
		ParticleVelocity(particles, width, height, depth);
		ParticleSorter(particles);

		ctx.fillStyle = '#101010';
		ctx.fillRect(0, 0, width, height);
		ctx.fillStyle = '#ffffff';

		for (var i = 0; i < particles.length; i++) {
			var lines = RadiusSearch(particles, i, radius);
			var particle = particles[i];

			ctx.beginPath();
			ctx.arc(
				particle.coordinates[0],
				particle.coordinates[1],
				6-Math.pow(Math.sqrt(5.9)*(particle.coordinates[2]/depth), 2),
				0,
				2*Math.PI
			);

			ctx.fill();

			for (var j = 0; j < lines.length; j++) {
				var line = lines[j];
				ctx.strokeStyle = 'rgba(255, 255, 255, '+ (1-(line.distance/radius)) +')';
				ctx.moveTo(particle.coordinates[0], particle.coordinates[1]);
				ctx.lineTo(line.particle.coordinates[0], line.particle.coordinates[1]);
			}

			ctx.closePath();
			ctx.stroke();
		}

		window.requestAnimationFrame(animate);
	};

	window.requestAnimationFrame(animate);
});
},{"./ParticleSeeder":1,"./ParticleSorter":2,"./ParticleVelocity":3,"./RadiusSearch":4}]},{},[6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9tbnQvQ0FDMkQyMTBDMkQyMDExRC9XZWJTZXJ2ZXIvbG9jYWxob3N0L2hlZHJvbml1bS9saW5lcy9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvbW50L0NBQzJEMjEwQzJEMjAxMUQvV2ViU2VydmVyL2xvY2FsaG9zdC9oZWRyb25pdW0vbGluZXMvc2NyaXB0cy9QYXJ0aWNsZVNlZWRlci5qcyIsIi9tbnQvQ0FDMkQyMTBDMkQyMDExRC9XZWJTZXJ2ZXIvbG9jYWxob3N0L2hlZHJvbml1bS9saW5lcy9zY3JpcHRzL1BhcnRpY2xlU29ydGVyLmpzIiwiL21udC9DQUMyRDIxMEMyRDIwMTFEL1dlYlNlcnZlci9sb2NhbGhvc3QvaGVkcm9uaXVtL2xpbmVzL3NjcmlwdHMvUGFydGljbGVWZWxvY2l0eS5qcyIsIi9tbnQvQ0FDMkQyMTBDMkQyMDExRC9XZWJTZXJ2ZXIvbG9jYWxob3N0L2hlZHJvbml1bS9saW5lcy9zY3JpcHRzL1JhZGl1c1NlYXJjaC5qcyIsIi9tbnQvQ0FDMkQyMTBDMkQyMDExRC9XZWJTZXJ2ZXIvbG9jYWxob3N0L2hlZHJvbml1bS9saW5lcy9zY3JpcHRzL1JhbmQuanMiLCIvbW50L0NBQzJEMjEwQzJEMjAxMUQvV2ViU2VydmVyL2xvY2FsaG9zdC9oZWRyb25pdW0vbGluZXMvc2NyaXB0cy9mYWtlX2E2MjRiNjMyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcmFuZCA9IHJlcXVpcmUoJy4vUmFuZCcpO1xuXG52YXIgUGFydGljbGVTZWVkZXIgPSBmdW5jdGlvbiAobiwgd2lkdGgsIGhlaWdodCwgZGVwdGgsIG1heF92ZWxvY2l0eV9jb21wb25lbnQpIHtcblx0Y29uc29sZS5sb2cobWF4X3ZlbG9jaXR5X2NvbXBvbmVudCk7XG5cdHZhciBwYXJ0aWNsZXMgPSBbXTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xuXHRcdHBhcnRpY2xlcy5wdXNoKHtcblx0XHRcdGNvb3JkaW5hdGVzOiBbXG5cdFx0XHRcdHJhbmQoMCwgd2lkdGgpLFxuXHRcdFx0XHRyYW5kKDAsIGhlaWdodCksXG5cdFx0XHRcdHJhbmQoMCwgZGVwdGgpXG5cdFx0XHRdLFxuXHRcdFx0dmVsb2NpdHk6IFtcblx0XHRcdFx0cmFuZCgtMSptYXhfdmVsb2NpdHlfY29tcG9uZW50KjEwMCwgbWF4X3ZlbG9jaXR5X2NvbXBvbmVudCoxMDApLzEwMCxcblx0XHRcdFx0cmFuZCgtMSptYXhfdmVsb2NpdHlfY29tcG9uZW50KjEwMCwgbWF4X3ZlbG9jaXR5X2NvbXBvbmVudCoxMDApLzEwMCxcblx0XHRcdFx0cmFuZCgtMSptYXhfdmVsb2NpdHlfY29tcG9uZW50KjEwMCwgbWF4X3ZlbG9jaXR5X2NvbXBvbmVudCoxMDApLzEwMFxuXHRcdFx0XVxuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIHBhcnRpY2xlcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGFydGljbGVTZWVkZXI7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocGFydGljbGVzKSB7XG5cdGZvciAodmFyIGkgPSAxOyBpIDwgcGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIHRtcCA9IHBhcnRpY2xlc1tpXTtcblxuXHRcdGZvciAodmFyIGogPSBpOyBqID4gMDsgai0tKSB7XG5cdFx0XHRpZiAoaiA+IDAgJiYgcGFydGljbGVzW2otMV0uY29vcmRpbmF0ZXNbMF0gPiB0bXAuY29vcmRpbmF0ZXNbMF0pIHtcblx0XHRcdFx0cGFydGljbGVzW2pdID0gcGFydGljbGVzW2otMV07XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRwYXJ0aWNsZXNbal0gPSB0bXA7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocGFydGljbGVzLCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCkge1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgcGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgcGFydGljbGUgPSBwYXJ0aWNsZXNbaV07XHJcblxyXG5cdFx0dmFyIHggPSBwYXJ0aWNsZS5jb29yZGluYXRlc1swXStwYXJ0aWNsZS52ZWxvY2l0eVswXTtcclxuXHRcdHZhciB5ID0gcGFydGljbGUuY29vcmRpbmF0ZXNbMV0rcGFydGljbGUudmVsb2NpdHlbMV07XHJcblx0XHR2YXIgeiA9IHBhcnRpY2xlLmNvb3JkaW5hdGVzWzJdK3BhcnRpY2xlLnZlbG9jaXR5WzJdO1xyXG5cclxuXHRcdGlmICh4ID4gd2lkdGggfHwgeCA8IDApIHtcclxuXHRcdFx0cGFydGljbGUudmVsb2NpdHlbMF0gKj0gLTE7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHkgPiBoZWlnaHQgfHwgeSA8IDApIHtcclxuXHRcdFx0cGFydGljbGUudmVsb2NpdHlbMV0gKj0gLTE7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHogPiBkZXB0aCB8fCB6IDwgMCkge1xyXG5cdFx0XHRwYXJ0aWNsZS52ZWxvY2l0eVsyXSAqPSAtMTtcclxuXHRcdH1cclxuXHJcblx0XHRwYXJ0aWNsZS5jb29yZGluYXRlc1swXSArPSBwYXJ0aWNsZS52ZWxvY2l0eVswXTtcclxuXHRcdHBhcnRpY2xlLmNvb3JkaW5hdGVzWzFdICs9IHBhcnRpY2xlLnZlbG9jaXR5WzFdO1xyXG5cdFx0cGFydGljbGUuY29vcmRpbmF0ZXNbMl0gKz0gcGFydGljbGUudmVsb2NpdHlbMl07XHJcblx0fVxyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHBhcnRpY2xlcywgaW5kZXgsIHJhZGl1cykge1xuXHR2YXIgcGFydGljbGUgPSBwYXJ0aWNsZXNbaW5kZXhdO1xuXHR2YXIgcl9zcXIgPSBNYXRoLnBvdyhyYWRpdXMsIDIpO1xuXHR2YXIgeF9tYXggPSBwYXJ0aWNsZS5jb29yZGluYXRlc1swXStyYWRpdXM7XG5cdHZhciB5X21heCA9IHBhcnRpY2xlLmNvb3JkaW5hdGVzWzFdK3JhZGl1cztcblx0dmFyIHpfbWF4ID0gcGFydGljbGUuY29vcmRpbmF0ZXNbMl0rcmFkaXVzO1xuXG5cblx0dmFyIGluX3JhbmdlID0gW107XG5cblx0Zm9yICh2YXIgaSA9IGluZGV4KzE7IGkgPCBwYXJ0aWNsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgY3VyX3AgPSBwYXJ0aWNsZXNbaV07XG5cdFx0aWYgKGN1cl9wLmNvb3JkaW5hdGVzWzBdIDw9IHhfbWF4KSB7XG5cdFx0XHR2YXIgcyA9IE1hdGguc3FydChNYXRoLnBvdyhcblx0XHRcdFx0cGFydGljbGUuY29vcmRpbmF0ZXNbMF0tY3VyX3AuY29vcmRpbmF0ZXNbMF0sIDIpIFxuXHRcdFx0XHQrIE1hdGgucG93KHBhcnRpY2xlLmNvb3JkaW5hdGVzWzFdLWN1cl9wLmNvb3JkaW5hdGVzWzFdLCAyKVxuXHRcdFx0XHQrIE1hdGgucG93KHBhcnRpY2xlLmNvb3JkaW5hdGVzWzJdLWN1cl9wLmNvb3JkaW5hdGVzWzJdLCAyKSk7XG5cdFx0XHRcblx0XHRcdGlmIChjdXJfcC5jb29yZGluYXRlc1sxXSA8PSB5X21heCAmJiBjdXJfcC5jb29yZGluYXRlc1syXSA8PSB6X21heCAmJiBzIDw9IHJhZGl1cykge1xuXHRcdFx0XHRpbl9yYW5nZS5wdXNoKHtcblx0XHRcdFx0XHRwYXJ0aWNsZTogY3VyX3AsXG5cdFx0XHRcdFx0ZGlzdGFuY2U6IHNcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBpbl9yYW5nZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWluLCBtYXgpIHtcblx0cmV0dXJuIG1pbisoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKk1hdGgucG93KDEwLCBNYXRoLmZsb29yKE1hdGgubG9nMTAobWF4KSkrMSkpJShtYXgtbWluKSk7XG59OyIsInZhciBQYXJ0aWNsZVNlZWRlciA9IHJlcXVpcmUoJy4vUGFydGljbGVTZWVkZXInKTtcbnZhciBQYXJ0aWNsZVNvcnRlciA9IHJlcXVpcmUoJy4vUGFydGljbGVTb3J0ZXInKTtcbnZhciBSYWRpdXNTZWFyY2ggPSByZXF1aXJlKCcuL1JhZGl1c1NlYXJjaCcpO1xudmFyIFBhcnRpY2xlVmVsb2NpdHkgPSByZXF1aXJlKCcuL1BhcnRpY2xlVmVsb2NpdHknKTtcblxuJChmdW5jdGlvbiAoKSB7XG5cdHZhciB3aWR0aCA9ICQoJyNjYW52YXMnKS53aWR0aCgpO1xuXHR2YXIgaGVpZ2h0ID0gJCgnI2NhbnZhcycpLmhlaWdodCgpO1xuXHR2YXIgZGVwdGggPSBoZWlnaHQ7XG5cdHZhciByYWRpdXMgPSBoZWlnaHQvMjtcblx0dmFyIGNvdW50ID0gMjU7XG5cblx0dmFyIHBhcnRpY2xlcyA9IFBhcnRpY2xlU2VlZGVyKGNvdW50LCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCwgMSk7XG5cdFBhcnRpY2xlU29ydGVyKHBhcnRpY2xlcyk7XG5cblx0dmFyIGNhbnZhcyA9ICQoJyNjYW52YXMnKTtcblx0Y2FudmFzLmF0dHIoJ3dpZHRoJywgd2lkdGgpLmF0dHIoJ2hlaWdodCcsIGhlaWdodCk7XG5cblx0dmFyIGN0eCA9IGNhbnZhc1swXS5nZXRDb250ZXh0KCcyZCcpO1xuXG5cblx0dmFyIGFuaW1hdGUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0UGFydGljbGVWZWxvY2l0eShwYXJ0aWNsZXMsIHdpZHRoLCBoZWlnaHQsIGRlcHRoKTtcblx0XHRQYXJ0aWNsZVNvcnRlcihwYXJ0aWNsZXMpO1xuXG5cdFx0Y3R4LmZpbGxTdHlsZSA9ICcjMTAxMDEwJztcblx0XHRjdHguZmlsbFJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cdFx0Y3R4LmZpbGxTdHlsZSA9ICcjZmZmZmZmJztcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgbGluZXMgPSBSYWRpdXNTZWFyY2gocGFydGljbGVzLCBpLCByYWRpdXMpO1xuXHRcdFx0dmFyIHBhcnRpY2xlID0gcGFydGljbGVzW2ldO1xuXG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRjdHguYXJjKFxuXHRcdFx0XHRwYXJ0aWNsZS5jb29yZGluYXRlc1swXSxcblx0XHRcdFx0cGFydGljbGUuY29vcmRpbmF0ZXNbMV0sXG5cdFx0XHRcdDYtTWF0aC5wb3coTWF0aC5zcXJ0KDUuOSkqKHBhcnRpY2xlLmNvb3JkaW5hdGVzWzJdL2RlcHRoKSwgMiksXG5cdFx0XHRcdDAsXG5cdFx0XHRcdDIqTWF0aC5QSVxuXHRcdFx0KTtcblxuXHRcdFx0Y3R4LmZpbGwoKTtcblxuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBsaW5lcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHR2YXIgbGluZSA9IGxpbmVzW2pdO1xuXHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAnKyAoMS0obGluZS5kaXN0YW5jZS9yYWRpdXMpKSArJyknO1xuXHRcdFx0XHRjdHgubW92ZVRvKHBhcnRpY2xlLmNvb3JkaW5hdGVzWzBdLCBwYXJ0aWNsZS5jb29yZGluYXRlc1sxXSk7XG5cdFx0XHRcdGN0eC5saW5lVG8obGluZS5wYXJ0aWNsZS5jb29yZGluYXRlc1swXSwgbGluZS5wYXJ0aWNsZS5jb29yZGluYXRlc1sxXSk7XG5cdFx0XHR9XG5cblx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHR9XG5cblx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuXHR9O1xuXG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59KTsiXX0=
