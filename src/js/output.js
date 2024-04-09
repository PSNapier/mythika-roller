// OUTPUT

function roll() {
	document.getElementById('output').innerHTML = ``;

	let parent1 = {};
	let parent2 = {};
	function getParentData(parentId) {
		return {
			geno: '',
			species: document.getElementById(`${parentId}species`).value,
			rank: document.getElementById(`${parentId}rank`).value,
			build: document.getElementById(`${parentId}build`).value,
			earTrait: document.getElementById(`${parentId}eartrait`).value,
			tailTrait: document.getElementById(`${parentId}tailtrait`).value,
			bonusTrait: document.getElementById(`${parentId}bonustrait`).value,
			mutation: document.getElementById(`${parentId}mutation`).value,
			hereditaryTraits: document.getElementById(`${parentId}hereditarytraits`).value,
		};
	}
	function getParents() {
		parent1 = getParentData('parent1');
		parent2 = getParentData('parent2');
		// console.log(parent1, parent2);
	}
	getParents();

	let selections = {};
	function getSelections() {
		return {
			nerosLuck: document.getElementById(`nerosluck`).checked,
			arativasSpirit: document.getElementById(`arativasspirit`).checked,
			solasdrake: document.getElementById(`solasdrake`).checked,
			shadowsdrake: document.getElementById(`shadowsdrake`).checked,
			furion: document.getElementById(`furion`).checked,
			shellpin: document.getElementById(`shellpin`).checked,
			stamvaul: document.getElementById(`stamvaul`).checked,
			toleranceCrystal: document.getElementById(`tolerancecrystal`).checked,
			behophenoix: document.getElementById(`behopheonix`).checked,
			runeSpirit: document.getElementById(`runespirit`).checked,
			fertilityElk: document.getElementById(`fertilityelk`).checked,
		}
	}
	selections = getSelections();
	console.log(selections);

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

		function rollGender() {
			return randomizer(['female', 'male']).capitalizeStr();
		}

		let output = `${mythikaCount}) ${rollSpecies()}, ${rollGender()}, Status, ___ Rank
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