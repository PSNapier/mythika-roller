function reload() {
	window.location.reload();
}

function rng(max) {
	const rng = Math.floor(Math.random() * max) + 1;
	return rng;
}

function rngRange(min, max) {
	const rng = Math.floor(Math.random() * (max - min + 1)) + min;
	return rng;
}

function randomizer(array) {
	// console.log(array);
	if (array.length > 0) {
		const random = array[Math.floor(Math.random() * array.length)];
		return random;
	} else {
		return '';
	}
}

function onlyUnique(value, index, self) {
		return self.indexOf(value) === index;
}
// let a = ['a', 1, 'a', 2, '1'];
// let unique = a.filter( onlyUnique );// returns ['a', 1, 2, '1']

// string.capitalizeStr();
// TODO: capitalize no worky with opening parenthesis even though regexr says it should?
String.prototype.capitalizeStr = function() {
	return this.replace(/(?:^|\(|\s|-|\/)\S/g, function(a) { return a.toUpperCase();});
};