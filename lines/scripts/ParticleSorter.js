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