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
	var width = $(window).innerWidth();
	var height = $(window).innerHeight();
	var depth = height;
	var radius = height/2;
	var count = 20;

	var particles = ParticleSeeder(count, width, height, depth, 5);

	var c = $('#container');

	for (var i = 0; i < particles.length; i++) {
		particles[i].name = i+1;
		particles[i].dom = $('<div></div>');
		particles[i].dom.css({
			top: (i*40) + 'px'
		});

		c.append(particles[i].dom);
	}


	var animate = function () {
		ParticleVelocity(particles, width, height, depth);
		ParticleSorter(particles);

		for (var i = 0; i < particles.length; i++) {
			particles[i].dom.html(
				'<b>' + particles[i].name + '</b>' + 
				':' + 
				particles[i].coordinates[0] + 
				',' +
				particles[i].coordinates[1] + 
				',' +
				particles[i].coordinates[2]
			);

			particles[i].dom.data('index', i);

			particles[i].dom.css({
				background: '#333',
				width: (0.5*particles[i].coordinates[0]) + 'px',
				top: (i*40) + 'px'
			});
		}
	};

	var interval = setInterval(animate, 500);

	$('#tog').click(function () {
		if (interval === null) {
			interval = setInterval(animate, 500);
		} else {
			clearInterval(interval);
			interval = null;
		}
	});

	$('#container > div').click(function () {
		console.log('HEHE');
		var index = $(this).data('index');
		var points = RadiusSearch(particles, index, 100);

		for (var i = 0; i < points.length; i++) {
			points[i].particle.dom.css('background', '#f00');
		}
	});
});
},{"./ParticleSeeder":1,"./ParticleSorter":2,"./ParticleVelocity":3,"./RadiusSearch":4}]},{},[6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9tbnQvQ0FDMkQyMTBDMkQyMDExRC9XZWJTZXJ2ZXIvbG9jYWxob3N0L2hlZHJvbml1bS9saW5lcy9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvbW50L0NBQzJEMjEwQzJEMjAxMUQvV2ViU2VydmVyL2xvY2FsaG9zdC9oZWRyb25pdW0vbGluZXMvc2NyaXB0cy9QYXJ0aWNsZVNlZWRlci5qcyIsIi9tbnQvQ0FDMkQyMTBDMkQyMDExRC9XZWJTZXJ2ZXIvbG9jYWxob3N0L2hlZHJvbml1bS9saW5lcy9zY3JpcHRzL1BhcnRpY2xlU29ydGVyLmpzIiwiL21udC9DQUMyRDIxMEMyRDIwMTFEL1dlYlNlcnZlci9sb2NhbGhvc3QvaGVkcm9uaXVtL2xpbmVzL3NjcmlwdHMvUGFydGljbGVWZWxvY2l0eS5qcyIsIi9tbnQvQ0FDMkQyMTBDMkQyMDExRC9XZWJTZXJ2ZXIvbG9jYWxob3N0L2hlZHJvbml1bS9saW5lcy9zY3JpcHRzL1JhZGl1c1NlYXJjaC5qcyIsIi9tbnQvQ0FDMkQyMTBDMkQyMDExRC9XZWJTZXJ2ZXIvbG9jYWxob3N0L2hlZHJvbml1bS9saW5lcy9zY3JpcHRzL1JhbmQuanMiLCIvbW50L0NBQzJEMjEwQzJEMjAxMUQvV2ViU2VydmVyL2xvY2FsaG9zdC9oZWRyb25pdW0vbGluZXMvc2NyaXB0cy9mYWtlXzRkM2QyNWI2LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByYW5kID0gcmVxdWlyZSgnLi9SYW5kJyk7XG5cbnZhciBQYXJ0aWNsZVNlZWRlciA9IGZ1bmN0aW9uIChuLCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCwgbWF4X3ZlbG9jaXR5X2NvbXBvbmVudCkge1xuXHRjb25zb2xlLmxvZyhtYXhfdmVsb2NpdHlfY29tcG9uZW50KTtcblx0dmFyIHBhcnRpY2xlcyA9IFtdO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSB7XG5cdFx0cGFydGljbGVzLnB1c2goe1xuXHRcdFx0Y29vcmRpbmF0ZXM6IFtcblx0XHRcdFx0cmFuZCgwLCB3aWR0aCksXG5cdFx0XHRcdHJhbmQoMCwgaGVpZ2h0KSxcblx0XHRcdFx0cmFuZCgwLCBkZXB0aClcblx0XHRcdF0sXG5cdFx0XHR2ZWxvY2l0eTogW1xuXHRcdFx0XHRyYW5kKC0xKm1heF92ZWxvY2l0eV9jb21wb25lbnQqMTAwLCBtYXhfdmVsb2NpdHlfY29tcG9uZW50KjEwMCkvMTAwLFxuXHRcdFx0XHRyYW5kKC0xKm1heF92ZWxvY2l0eV9jb21wb25lbnQqMTAwLCBtYXhfdmVsb2NpdHlfY29tcG9uZW50KjEwMCkvMTAwLFxuXHRcdFx0XHRyYW5kKC0xKm1heF92ZWxvY2l0eV9jb21wb25lbnQqMTAwLCBtYXhfdmVsb2NpdHlfY29tcG9uZW50KjEwMCkvMTAwXG5cdFx0XHRdXG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gcGFydGljbGVzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXJ0aWNsZVNlZWRlcjsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwYXJ0aWNsZXMpIHtcblx0Zm9yICh2YXIgaSA9IDE7IGkgPCBwYXJ0aWNsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgdG1wID0gcGFydGljbGVzW2ldO1xuXG5cdFx0Zm9yICh2YXIgaiA9IGk7IGogPiAwOyBqLS0pIHtcblx0XHRcdGlmIChqID4gMCAmJiBwYXJ0aWNsZXNbai0xXS5jb29yZGluYXRlc1swXSA+IHRtcC5jb29yZGluYXRlc1swXSkge1xuXHRcdFx0XHRwYXJ0aWNsZXNbal0gPSBwYXJ0aWNsZXNbai0xXTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHBhcnRpY2xlc1tqXSA9IHRtcDtcblx0fVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwYXJ0aWNsZXMsIHdpZHRoLCBoZWlnaHQsIGRlcHRoKSB7XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwYXJ0aWNsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBwYXJ0aWNsZSA9IHBhcnRpY2xlc1tpXTtcclxuXHJcblx0XHR2YXIgeCA9IHBhcnRpY2xlLmNvb3JkaW5hdGVzWzBdK3BhcnRpY2xlLnZlbG9jaXR5WzBdO1xyXG5cdFx0dmFyIHkgPSBwYXJ0aWNsZS5jb29yZGluYXRlc1sxXStwYXJ0aWNsZS52ZWxvY2l0eVsxXTtcclxuXHRcdHZhciB6ID0gcGFydGljbGUuY29vcmRpbmF0ZXNbMl0rcGFydGljbGUudmVsb2NpdHlbMl07XHJcblxyXG5cdFx0aWYgKHggPiB3aWR0aCB8fCB4IDwgMCkge1xyXG5cdFx0XHRwYXJ0aWNsZS52ZWxvY2l0eVswXSAqPSAtMTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoeSA+IGhlaWdodCB8fCB5IDwgMCkge1xyXG5cdFx0XHRwYXJ0aWNsZS52ZWxvY2l0eVsxXSAqPSAtMTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoeiA+IGRlcHRoIHx8IHogPCAwKSB7XHJcblx0XHRcdHBhcnRpY2xlLnZlbG9jaXR5WzJdICo9IC0xO1xyXG5cdFx0fVxyXG5cclxuXHRcdHBhcnRpY2xlLmNvb3JkaW5hdGVzWzBdICs9IHBhcnRpY2xlLnZlbG9jaXR5WzBdO1xyXG5cdFx0cGFydGljbGUuY29vcmRpbmF0ZXNbMV0gKz0gcGFydGljbGUudmVsb2NpdHlbMV07XHJcblx0XHRwYXJ0aWNsZS5jb29yZGluYXRlc1syXSArPSBwYXJ0aWNsZS52ZWxvY2l0eVsyXTtcclxuXHR9XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocGFydGljbGVzLCBpbmRleCwgcmFkaXVzKSB7XG5cdHZhciBwYXJ0aWNsZSA9IHBhcnRpY2xlc1tpbmRleF07XG5cdHZhciByX3NxciA9IE1hdGgucG93KHJhZGl1cywgMik7XG5cdHZhciB4X21heCA9IHBhcnRpY2xlLmNvb3JkaW5hdGVzWzBdK3JhZGl1cztcblx0dmFyIHlfbWF4ID0gcGFydGljbGUuY29vcmRpbmF0ZXNbMV0rcmFkaXVzO1xuXHR2YXIgel9tYXggPSBwYXJ0aWNsZS5jb29yZGluYXRlc1syXStyYWRpdXM7XG5cblxuXHR2YXIgaW5fcmFuZ2UgPSBbXTtcblxuXHRmb3IgKHZhciBpID0gaW5kZXgrMTsgaSA8IHBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBjdXJfcCA9IHBhcnRpY2xlc1tpXTtcblx0XHRpZiAoY3VyX3AuY29vcmRpbmF0ZXNbMF0gPD0geF9tYXgpIHtcblx0XHRcdHZhciBzID0gTWF0aC5zcXJ0KE1hdGgucG93KFxuXHRcdFx0XHRwYXJ0aWNsZS5jb29yZGluYXRlc1swXS1jdXJfcC5jb29yZGluYXRlc1swXSwgMikgXG5cdFx0XHRcdCsgTWF0aC5wb3cocGFydGljbGUuY29vcmRpbmF0ZXNbMV0tY3VyX3AuY29vcmRpbmF0ZXNbMV0sIDIpXG5cdFx0XHRcdCsgTWF0aC5wb3cocGFydGljbGUuY29vcmRpbmF0ZXNbMl0tY3VyX3AuY29vcmRpbmF0ZXNbMl0sIDIpKTtcblx0XHRcdFxuXHRcdFx0aWYgKGN1cl9wLmNvb3JkaW5hdGVzWzFdIDw9IHlfbWF4ICYmIGN1cl9wLmNvb3JkaW5hdGVzWzJdIDw9IHpfbWF4ICYmIHMgPD0gcmFkaXVzKSB7XG5cdFx0XHRcdGluX3JhbmdlLnB1c2goe1xuXHRcdFx0XHRcdHBhcnRpY2xlOiBjdXJfcCxcblx0XHRcdFx0XHRkaXN0YW5jZTogc1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGluX3JhbmdlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChtaW4sIG1heCkge1xuXHRyZXR1cm4gbWluKyhNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkqTWF0aC5wb3coMTAsIE1hdGguZmxvb3IoTWF0aC5sb2cxMChtYXgpKSsxKSklKG1heC1taW4pKTtcbn07IiwidmFyIFBhcnRpY2xlU2VlZGVyID0gcmVxdWlyZSgnLi9QYXJ0aWNsZVNlZWRlcicpO1xudmFyIFBhcnRpY2xlU29ydGVyID0gcmVxdWlyZSgnLi9QYXJ0aWNsZVNvcnRlcicpO1xudmFyIFJhZGl1c1NlYXJjaCA9IHJlcXVpcmUoJy4vUmFkaXVzU2VhcmNoJyk7XG52YXIgUGFydGljbGVWZWxvY2l0eSA9IHJlcXVpcmUoJy4vUGFydGljbGVWZWxvY2l0eScpO1xuXG4kKGZ1bmN0aW9uICgpIHtcblx0dmFyIHdpZHRoID0gJCh3aW5kb3cpLmlubmVyV2lkdGgoKTtcblx0dmFyIGhlaWdodCA9ICQod2luZG93KS5pbm5lckhlaWdodCgpO1xuXHR2YXIgZGVwdGggPSBoZWlnaHQ7XG5cdHZhciByYWRpdXMgPSBoZWlnaHQvMjtcblx0dmFyIGNvdW50ID0gMjA7XG5cblx0dmFyIHBhcnRpY2xlcyA9IFBhcnRpY2xlU2VlZGVyKGNvdW50LCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCwgNSk7XG5cblx0dmFyIGMgPSAkKCcjY29udGFpbmVyJyk7XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwYXJ0aWNsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRwYXJ0aWNsZXNbaV0ubmFtZSA9IGkrMTtcblx0XHRwYXJ0aWNsZXNbaV0uZG9tID0gJCgnPGRpdj48L2Rpdj4nKTtcblx0XHRwYXJ0aWNsZXNbaV0uZG9tLmNzcyh7XG5cdFx0XHR0b3A6IChpKjQwKSArICdweCdcblx0XHR9KTtcblxuXHRcdGMuYXBwZW5kKHBhcnRpY2xlc1tpXS5kb20pO1xuXHR9XG5cblxuXHR2YXIgYW5pbWF0ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRQYXJ0aWNsZVZlbG9jaXR5KHBhcnRpY2xlcywgd2lkdGgsIGhlaWdodCwgZGVwdGgpO1xuXHRcdFBhcnRpY2xlU29ydGVyKHBhcnRpY2xlcyk7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0cGFydGljbGVzW2ldLmRvbS5odG1sKFxuXHRcdFx0XHQnPGI+JyArIHBhcnRpY2xlc1tpXS5uYW1lICsgJzwvYj4nICsgXG5cdFx0XHRcdCc6JyArIFxuXHRcdFx0XHRwYXJ0aWNsZXNbaV0uY29vcmRpbmF0ZXNbMF0gKyBcblx0XHRcdFx0JywnICtcblx0XHRcdFx0cGFydGljbGVzW2ldLmNvb3JkaW5hdGVzWzFdICsgXG5cdFx0XHRcdCcsJyArXG5cdFx0XHRcdHBhcnRpY2xlc1tpXS5jb29yZGluYXRlc1syXVxuXHRcdFx0KTtcblxuXHRcdFx0cGFydGljbGVzW2ldLmRvbS5kYXRhKCdpbmRleCcsIGkpO1xuXG5cdFx0XHRwYXJ0aWNsZXNbaV0uZG9tLmNzcyh7XG5cdFx0XHRcdGJhY2tncm91bmQ6ICcjMzMzJyxcblx0XHRcdFx0d2lkdGg6ICgwLjUqcGFydGljbGVzW2ldLmNvb3JkaW5hdGVzWzBdKSArICdweCcsXG5cdFx0XHRcdHRvcDogKGkqNDApICsgJ3B4J1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBpbnRlcnZhbCA9IHNldEludGVydmFsKGFuaW1hdGUsIDUwMCk7XG5cblx0JCgnI3RvZycpLmNsaWNrKGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoaW50ZXJ2YWwgPT09IG51bGwpIHtcblx0XHRcdGludGVydmFsID0gc2V0SW50ZXJ2YWwoYW5pbWF0ZSwgNTAwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG5cdFx0XHRpbnRlcnZhbCA9IG51bGw7XG5cdFx0fVxuXHR9KTtcblxuXHQkKCcjY29udGFpbmVyID4gZGl2JykuY2xpY2soZnVuY3Rpb24gKCkge1xuXHRcdGNvbnNvbGUubG9nKCdIRUhFJyk7XG5cdFx0dmFyIGluZGV4ID0gJCh0aGlzKS5kYXRhKCdpbmRleCcpO1xuXHRcdHZhciBwb2ludHMgPSBSYWRpdXNTZWFyY2gocGFydGljbGVzLCBpbmRleCwgMTAwKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRwb2ludHNbaV0ucGFydGljbGUuZG9tLmNzcygnYmFja2dyb3VuZCcsICcjZjAwJyk7XG5cdFx0fVxuXHR9KTtcbn0pOyJdfQ==
