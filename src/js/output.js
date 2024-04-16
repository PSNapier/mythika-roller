// OUTPUT

function roll() {
	document.getElementById('output').innerHTML = ``;

	let parent1 = {};
	let parent2 = {};
	function getParentData(parentId) {
		return {
			geno: document.getElementById(`${parentId}geno`).value.split('/'),
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
			unknownMixtureA: document.getElementById(`unknownmixturea`).checked,
			unknownMixtureB: document.getElementById(`unknownmixtureb`).checked,
		}
	}
	selections = getSelections();
	// console.log(selections);

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
			if (selections.unknownMixtureA) {
				return 'Male';
			}
			else if (selections.unknownMixtureB) {
				return 'Female';
			}
			else if (selections.arativasSpirit) {
				return rng(100) <= 60 ? 'Female' : 'Male';
			}
			else if (selections.nerosLuck) {
				return rng(100) <= 60 ? 'Male' : 'Female';
			}
			else {
				return randomizer(['Female', 'Male']);
			}
		}

		function rollRank() {
			if (parent1.rank === 'runt' || parent2.rank === 'runt') {
				return 'Runt';
			}
			else if (parent1.rank === 'omega' || parent2.rank === 'omega') {
				return 'Runt';
			}
			else if (parent1.rank === 'beta' || parent2.rank === 'beta') {
				return rng(100) <= 5 ? 'Omega' : 'Runt';
			}
			else if (parent1.rank === 'alpha' || parent2.rank === 'alpha') {
				return rng(100) <= 30 ? 'Omega' : 'Runt';
			}
			else {
				return 'Runt';
			}
		}

		function rollBuild() {
			let build = '';
			let buildProbabilities = [
				// [gene1, gene2, probability of rolling gene2]
				['common','common', 100],
				['common','uncommon', 25],
				['common','rare', 10],
				['uncommon','uncommon', 100],
				['uncommon','rare', 40],
				['rare','rare', 100],
			];

			let parent1Build = {
				rarity: '',
				gene: '',
			}
			let parent2Build = {
				rarity: '',
				gene: '',
			}
			for (let key in dictionary.build) {
				dictionary.build[key].forEach(build => {
					if (parent1.build === build) {
						parent1Build.gene = build;
						parent1Build.rarity = key;
					}
					if (parent2.build === build) {
						parent2Build.gene = build;
						parent2Build.rarity = key;
					}
				});
			}

			buildProbabilities.forEach(([rarity1, rarity2, probability]) => {
				if (parent1Build.rarity === parent2Build.rarity) {
					build = randomizer([parent1Build.gene, parent2Build.gene]);
				}
				else if (parent1Build.rarity === rarity1 && parent2Build.rarity === rarity2) {
					build = rng(100) <= probability ? parent2Build.gene : parent1Build.gene;
				}
				else if (parent1Build.rarity === rarity2 && parent2Build.rarity === rarity1) {
					build = rng(100) <= probability ? parent1Build.gene : parent2Build.gene;
				}
			});
			
			return build !== '' ? `${build.capitalizeStr()} Build` : 'Natural Build';
		}

		function rollPhysical() {
			console.log(parent1, parent2);

			let parentEarTrait = randomizer([parent1.earTrait, parent2.earTrait].filter(Boolean));
			let ears = rng(100) <= 10 ? parentEarTrait : '';

			let parentTailTrait = randomizer([parent1.tailTrait, parent2.tailTrait].filter(Boolean));
			let tail = rng(100) <= 10 ? parentTailTrait : '';

			let parentBonusTrait = randomizer([parent1.bonusTrait, parent2.bonusTrait].filter(Boolean));
			let bonus = rng(100) <= 10 ? parentBonusTrait : '';

			return [ears, tail, bonus].filter(Boolean).join(', ').capitalizeStr();
		}

		function rollGeno() {
			// coat colour
			let parent1Coat = {
				rarity: '',
				gene: '',
			}
			let parent2Coat = {
				rarity: '',
				gene: '',
			}
			for (let key in dictionary.coatColours) {
				dictionary.coatColours[key].forEach(coat => {
					if (parent1.geno.includes(coat[1])) {
						parent1Coat.gene = coat[1];
						parent1Coat.rarity = key;
					}
					if (parent2.geno.includes(coat[1])) {
						parent2Coat.gene = coat[1];
						parent2Coat.rarity = key;
					}
				});
			}

			let coat = ''
			let coatProbabilities = [
				// [gene1, gene2, probability of rolling gene2]
				['common','common', 100],
				['common','uncommon', 25],
				['common','rare', 10],
				['uncommon','uncommon', 100],
				['uncommon','rare', 40],
				['rare','rare', 100],
			];
			coatProbabilities.forEach(([rarity1, rarity2, probability]) => {
				if (parent1Coat.rarity === parent2Coat.rarity) {
					coat = randomizer([parent1Coat.gene, parent2Coat.gene]);
				}
				else if (parent1Coat.rarity === rarity1 && parent2Coat.rarity === rarity2) {
					coat = rng(100) <= probability ? parent2Coat.gene : parent1Coat.gene;
				}
				else if (parent1Coat.rarity === rarity2 && parent2Coat.rarity === rarity1) {
					coat = rng(100) <= probability ? parent1Coat.gene : parent2Coat.gene;
				}
			});

			// markings
			let markings = [];
			function shouldPushMarking(key) {
				const probabilities = {
					'common': 40,
					'uncommon': 20,
					'rare': 10,
					'unique': 5
				};

				return rng(100) <= probabilities[key];
			}
			[parent1, parent2].forEach(parent => {
				for (let key in dictionary.markings) {
					dictionary.markings[key].forEach(marking => {
						if (parent.geno.includes(marking[1]) && shouldPushMarking(key)) {
							markings.push(marking[1]);
						}
					});
				}
			});

			return [coat, ...markings.filter(onlyUnique).sortByArray(dictionary.markingsSorted)].join('/');
		}

		let output = `${mythikaCount}) ${rollSpecies()}, ${rollGender()}, Status, ${rollRank()} Rank
		B: ${[rollBuild(), rollPhysical()].filter(Boolean).join(', ')}
		M: (Mutation)
		G: ${rollGeno()}
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
