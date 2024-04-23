// OUTPUT

function roll() {
	document.getElementById('output').innerHTML = ``;

	let parent1 = {};
	let parent2 = {};
	function getParentData(parentId) {
		return {
			bloodline: document.getElementById(`${parentId}bloodline`).value.split(' || ')[0].split(' '),
			geno: document.getElementById(`${parentId}geno`).value.split(' || ')[0].split('/'),
			genoSecondary: document.getElementById(`${parentId}geno`).value.split(' || ').length > 1 ? document.getElementById(`${parentId}geno`).value.split(' || ')[1].split('/') : '',
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
		console.log(parent1, parent2);
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
			mutationKingsAssistant: document.getElementById(`mutationkingsassistant`).checked,
			unknownMixtureA: document.getElementById(`unknownmixturea`).checked,
			unknownMixtureB: document.getElementById(`unknownmixtureb`).checked,
		}
	}
	selections = getSelections();
	// console.log(selections);

	let inbred = false;
	let inbredIds = [];
	let selectionsUsed = [];

	function checkBloodline() {
		[parent1, parent2].forEach(parent => {
			parent.bloodline = parent.bloodline.filter(Boolean).filter(ancestor => !ancestor.includes('A#'));
		});
		// console.log(parent1.bloodline, parent2.bloodline);

		parent1.bloodline.forEach(ancestor => {
			if (parent2.bloodline.includes(ancestor)) {
				inbredIds.push(ancestor);
				inbred = true;
			}
		});
	}

	function calcLitterAmount() {
		if (selections.soulApocalypse && rng(100) <= 40) {
			selectionsUsed.push('soul apocalypse');
			return 4;
		}
		else if (selections.fertilityElk && rng(100) <= 40) {
			selectionsUsed.push('fertility elk');
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
				selectionsUsed.push('unknown mixture a');
				return 'Male';
			}
			else if (selections.unknownMixtureB) {
				selectionsUsed.push('unknown mixture b');
				return 'Female';
			}
			else if (selections.arativasSpirit) {
				selectionsUsed.push('arativas spirit');
				return rng(100) <= 60 ? 'Female' : 'Male';
			}
			else if (selections.nerosLuck) {
				selectionsUsed.push('neros luck');
				return rng(100) <= 60 ? 'Male' : 'Female';
			}
			else {
				return randomizer(['Female', 'Male']);
			}
		}

		function rollStatusRank() {
			let rank = '';
			let status = '';

			if (parent1.rank === 'runt' || parent2.rank === 'runt') {
				status = rng(100) <= 60 ? 'deceased' : 'healthy';
				rank = 'runt';
			}
			else if (parent1.rank === 'omega' || parent2.rank === 'omega') {
				status = rng(100) <= 40 ? 'deceased' : 'healthy';
				rank = 'runt';
			}
			else if (parent1.rank === 'beta' || parent2.rank === 'beta') {
				status = rng(100) <= 20 ? 'deceased' : 'healthy';
				rank = rng(100) <= 5 ? 'omega' : 'runt';
			}
			else if (parent1.rank === 'alpha' || parent2.rank === 'alpha') {
				status = rng(100) <= 5 ? 'deceased' : 'healthy';
				rank = rng(100) <= 30 ? 'omega' : 'runt';
			}
			else {
				status = rng(100) <= 60 ? 'deceased' : 'healthy';
				rank = 'runt';
			}

			if (status === 'deceased' && selections.behophenoix) {
				selectionsUsed.push('behopheonix');
				status = rng(100) <= 10 ? 'healthy' : 'deceased';
			}

			return `${status.capitalizeStr()}, ${rank.capitalizeStr()} Rank`;
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
			let parentEarTrait = randomizer([parent1.earTrait, parent2.earTrait].filter(Boolean));
			let ears = rng(100) <= 10 ? parentEarTrait : '';

			let parentTailTrait = randomizer([parent1.tailTrait, parent2.tailTrait].filter(Boolean));
			let tail = rng(100) <= 10 ? parentTailTrait : '';

			let parentBonusTrait = randomizer([parent1.bonusTrait, parent2.bonusTrait].filter(Boolean));
			let bonus = rng(100) <= 10 ? parentBonusTrait : '';

			return [ears, tail, bonus].filter(Boolean).join(', ').capitalizeStr();
		}

		function rollMutation() {
			let extraPass = 0;
			if (selections.solasdrake) {
				selectionsUsed.push('solasdrake');
				extraPass += 10;
			}
			if (selections.mutationKingsAssistant) {
				selectionsUsed.push('mutation kings assistant');
				extraPass += 10;
			}

			let healthy = true;
			if (parent1.mutation === '' && parent2.mutation === '') {
				if (healthy) {
					return rng(100) <= 5 + extraPass ? randomizer(dictionary.mutations.random) : '';
				}
				else {
					return rng(100) <= 5 + extraPass ? randomizer(dictionary.mutations.inbred) : '';
				}
			}
			else if (parent1.mutation === parent2.mutation) {
				return rng(100) <= 15 + extraPass ? parent1.mutation : '';
			}
			else if (parent1.mutation !== '' && parent2.mutation !== '') {
				return rng(100) <= 8 + extraPass ? randomizer([parent1.mutation, parent2.mutation]) : '';
			}
			else if (parent1.mutation !== '') {
				return rng(100) <= 8 + extraPass ? parent1.mutation : '';
			}
			else if (parent2.mutation !== '') {
				return rng(100) <= 8 + extraPass ? parent2.mutation : '';
			}
		}

		function rollGeno(parent1Geno, parent2Geno) {
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
					if (parent1Geno.includes(coat[1])) {
						parent1Coat.gene = coat[1];
						parent1Coat.rarity = key;
					}
					if (parent2Geno.includes(coat[1])) {
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
			function rollMarkings(parentGeno) {
				for (let key in dictionary.markings) {
					dictionary.markings[key].forEach(marking => {
						if (parentGeno.includes(marking[1]) && shouldPushMarking(key)) {
							markings.push(marking[1]);
						}
					});
				}
			}
			rollMarkings(parent1Geno);
			rollMarkings(parent2Geno);

			return [coat, ...markings.filter(onlyUnique).sortByArray(dictionary.markingsSorted)].filter(Boolean).join('/');
		}

		function rollGenoSecondary() {
			let chimera = false;
			let harlequin = false;
			if (chimera || harlequin) {
				// ...not the way chimera/harlquin is implemented in this system but neat code snippet wah wah
				return [rollGeno(parent1.geno, parent2.geno), rollGeno(parent1.genoSecondary, parent2.genoSecondary)].filter(Boolean).join(' // ')
			}
			else {
				let parent1Geno = parent1.geno;
				let parent2Geno = parent1.geno;
				if (parent1.genoSecondary !== '' && rng(100) <= 50) {
					parent1Geno = parent1.genoSecondary;
				}
				if (parent2.genoSecondary !== '' && rng(100) <= 50) {
					parent2Geno = parent2.genoSecondary;
				}
				return rollGeno(parent1Geno, parent2Geno);
			}
		}

		let output = `${mythikaCount}) ${rollSpecies()}, ${rollGender()}, ${rollStatusRank()}
		B: ${[rollBuild(), rollPhysical()].filter(Boolean).join(', ')}
		M: ${rollMutation().capitalizeStr()}
		G: ${rollGenoSecondary()}
		P: (Phenotype)
		Skills: +1 Attack, +1 Speed, +1 Defence
		Runes: +1 Elemancy, +1 Medic, +1 Dark, +1 Void
		Hereditary Traits:
		(List hereditary traits here)`;
		return output;
	}

	if (selectionsUsed.filter(Boolean).length > 0) {
		const used = document.createElement('div');
		used.innerHTML = `Breeding used ${selectionsUsed.join(', ').capitalizeStr()}`;
		document.getElementById('output').appendChild(used);
	}

	checkBloodline();
	const inbredAlert = document.createElement('div');
	if (inbred) {
		inbredAlert.innerHTML = `This combination has resulted in inbreeding through ${inbredIds.join(', ')}, which can result in mutations and birth defects, or even death.`;
	}
	else {
		inbredAlert.innerHTML = `This combination won't result in inbreeding.`;
	}
	document.getElementById('output').appendChild(inbredAlert);

	for (let i = 1; i <= litterAmount; i++) {
		const offspring = document.createElement('div');
		offspring.innerHTML = `${newMythika(i)}`;
		document.getElementById('output').appendChild(offspring);
	}
}
