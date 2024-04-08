// OUTPUT

function roll() {
	document.getElementById('output').innerHTML = ``;

	let parent1 = {};
	let parent2 = {};
	function getParents() {
		parent1 = {
			geno: '',
			species: document.getElementById('parent1species').value,
			rank: document.getElementById('parent1rank').value,
			build: document.getElementById('parent1build').value,
			earTrait: document.getElementById('parent1eartrait').value,
			tailTrait: document.getElementById('parent1tailtrait').value,
			bonusTrait: document.getElementById('parent1bonustrait').value,
			mutation: document.getElementById('parent1mutation').value,
			hereditaryTraits: document.getElementById('parent1hereditarytraits').value,
		}
		parent2 = {
			geno: '',
			species: document.getElementById('parent2species').value,
			rank: document.getElementById('parent2rank').value,
			build: document.getElementById('parent2build').value,
			earTrait: document.getElementById('parent2eartrait').value,
			tailTrait: document.getElementById('parent2tailtrait').value,
			bonusTrait: document.getElementById('parent2bonustrait').value,
			mutation: document.getElementById('parent2mutation').value,
			hereditaryTraits: document.getElementById('parent2hereditarytraits').value,
		}
		console.log(parent1, parent2);
	}
	getParents();

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
				for (let k = 0; k < dictionary.speciesIllegalCrosses.length; k++) {
					if (a !== b && dictionary.speciesIllegalCrosses[k].includes(a) && dictionary.speciesIllegalCrosses[k].includes(b)) {
						species = 'illegal cross'
						return false;
					}
				}
				if (parent1.species === a && parent2.species === b || parent1.species === b && parent2.species === a) {
					return true;
				}
				return false;
			}

			main:
			for (let i = 0; i < dictionary.species.length; i++) {
				if (checkParents(dictionary.species[i], dictionary.species[i])) {
					species = dictionary.species[i];
					break;
				}
				for (let j = i + 1; j < dictionary.species.length; j++) {
					if (checkParents(dictionary.species[i], dictionary.species[j])) {
						species = randomizer([dictionary.species[i], dictionary.species[j]]);
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
