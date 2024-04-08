// INPUT
const parent1 = {
	geno: '',
	rank: 'runt',
	species: 'velox',
}
const parent2 = {
	geno: '',
	rank: 'runt',
	species: 'hexin',
}
const selections = {
	nerosSpirit: false,
	arativasSpirit: false,
	mixtureA: false,
	mixtureB: false,
	fertilityElk: false,
	soulApocalypse: false,
	toleranceCrystal: true,
}

// OUTPUT
function roll() {
	document.getElementById('output').innerHTML = ``;

	function calcLitterAmount() {
		let itemCheck = selections.soulApocalypse || selections.fertilityElk;
		if (itemCheck && rng(100) <= 40) {
			console.log('yas');
			return 4;
		}

		if (parent1.rank === 'runt' || parent2.rank === 'runt') {
			return rngRange(1,3);
		}
		else if (parent1.rank === 'omega' || parent2.rank === 'omega') {
			return rngRange(2,3);
		}
		else if (parent1.rank === 'beta' || parent2.rank === 'beta') {
			return rngRange(2,4);
		}
		else if (parent1.rank === 'alpha' || parent2.rank === 'alpha') {
			return rngRange(3,4);
		}

		return 1;
	}
	let litterAmount = calcLitterAmount();

	function newMythika(mythikaCount) {
		function rollSpecies() {
			let species = '[none]';

			function checkParents(a, b) {
				// console.log(a, b);
				for (let k = 0; k < illegalCrosses.length; k++) {
					if (illegalCrosses[k].includes(a) && illegalCrosses[k].includes(b)) {
						species = 'illegal cross'
						return false;
					}
				}
				if (parent1.species === a && parent2.species === b || parent1.species === b && parent2.species === a) {
					return true;
				}
				return false;
			}

			let dictionary = [
				'velox',
				'hexin',
				'enquisitors',
				'mishka',
				'arcid',
				'mykrons',
				'zinner',
				'ziemel',
				'zephies',
				'minkins',
				'funia',
				'vilkren',
				'fluffer',
				'wakanka',
			]
			let illegalCrosses = [
				['velox', 'mykrons'],
				['velox', 'zephies'],
				['velox', 'minkins'],
				['velox', 'funia'],
				['velox', 'vilkren'],
				['hexin', 'mykrons'],
				['hexin', 'zephies'],
				['hexin', 'minkins'],
				['hexin', 'funia'],
				['hexin', 'vilkren'],
				['mishka', 'arcid'],
				['mishka', 'mykrons'],
				['mishka', 'zinner'],
				['mishka', 'ziemel'],
				['mishka', 'funia'],
				['mishka', 'vilkren'],
				['enquisitors', 'mykrons'],
				['enquisitors', 'zinner'],
				['enquisitors', 'ziemel'],
				['enquisitors', 'zephies'],
				['enquisitors', 'minkins'],
				['enquisitors', 'funia'],
				['enquisitors', 'vilkren'],
				['arcid', 'mishka'],
				['arcid', 'zephies'],
				['arcid', 'minkins'],
				['arcid', 'vilkren'],
				['mykrons', 'zephies'],
				['mykrons', 'minkins'],
				['mykrons', 'funia'],
				['mykrons', 'vilkren'],
				['zinner', 'zephies'],
				['zinner', 'minkins'],
				['zinner', 'vilkren'],
				['ziemel', 'zephies'],
				['ziemel', 'minkins'],
				['ziemel', 'vilkren'],
			]

			main:
			for (let i = 0; i < dictionary.length; i++) {
				if (checkParents(dictionary[i], dictionary[i])) {
					species = dictionary[i];
					break;
				}
				for (let j = i + 1; j < dictionary.length; j++) {
					if (checkParents(dictionary[i], dictionary[j])) {
						species = randomizer([dictionary[i], dictionary[j]]);
						break main;
					}
				}
			}

			return species.capitalizeStr();
		}

		let output = `${mythikaCount}) ${rollSpecies()}, Gender, Status, ___ Rank
		B: ___ Build, ____ Ears, ____ Tail, ___ Bonus Trait
		M: (Mutation)
		G: (Genotype)
		P: (Phenotype)
		Skills: +1 Attack, +1 Speed, +1 Defence
		Runes: +1 Elemancy, +1 Medic, +1 Dark, +1 Void
		Hereditary Traits:
		(List hereditary traits here)`;
		return output;
	}

	for (let i = 1; i <= litterAmount; i++) {
		const element = document.createElement('div');
		element.innerHTML = `${newMythika(i)}`;
		document.getElementById('output').appendChild(element);
	}
}
