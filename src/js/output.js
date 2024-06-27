// OUTPUT

function roll() {
	document.getElementById('output').innerHTML = ``;

	let parent1 = {};
	let parent2 = {};
	function getParentData(parentId) {
		let skillsRunes = [...dictionary.skills, ...dictionary.runes].reduce((obj, key) => {
			obj[key] = parseInt(document.getElementById(`${parentId}${key.replace(/\s/g, '')}`).value || 0);
			return obj;
		}, {});

		return {
			bloodline: document.getElementById(`${parentId}bloodline`).value.replace(/\,/g, '').split(' || ')[0].split(' '),
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
			...skillsRunes
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
			behophoenix: document.getElementById(`behophoenix`).checked,
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
	let inbredMessage = '';
	let selectionsUsed = [];
	let deceased = false;
	let chimera = false;
	let harlequin = false;

	function checkBloodline() {
		[parent1, parent2].forEach(parent => {
			parent.bloodline = parent.bloodline.filter(Boolean).filter(ancestor => !ancestor.includes('A#'));
		});

		parent1.bloodline.forEach(ancestor => {
			if (parent2.bloodline.includes(ancestor)) {
				inbredIds.push(ancestor);
				inbred = true;
			}
		});
		// console.log(parent1.bloodline, parent2.bloodline, inbred, inbredIds);
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

			[parent1, parent2].forEach(parent => {
				let parentTrait = parent.hereditaryTraits.replace(' DNA I', '');
				if (dictionary.species.includes(parentTrait)) {
					parent.species = rng(100) <= 60 ? parentTrait : parent.species;
				}
			});

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

			if (selections.toleranceCrystal && parent1.species !== '' && parent2.species !== '') {
				selectionsUsed.push('tolerance crystal');
				species = randomizer([parent1.species, parent2.species]);
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
				if (inbred) {
					let x = rng(100);
					status = x <= 60 ? 'deceased' : x <= 90 ? 'inbred' : 'inbred - healthy';
				}
				rank = 'runt';
			}
			else if (parent1.rank === 'omega' || parent2.rank === 'omega') {
				status = rng(100) <= 40 ? 'deceased' : 'healthy';
				if (inbred) {
					let x = rng(100);
					status = x <= 40 ? 'deceased' : x <= 80 ? 'inbred' : 'inbred - healthy';
				}
				rank = 'runt';
			}
			else if (parent1.rank === 'beta' || parent2.rank === 'beta') {
				status = rng(100) <= 20 ? 'deceased' : 'healthy';
				if (inbred) {
					let x = rng(100);
					status = x <= 20 ? 'deceased' : x <= 80 ? 'inbred' : 'inbred - healthy';
				}
				rank = rng(100) <= 5 ? 'omega' : 'runt';
			}
			else if (parent1.rank === 'alpha' || parent2.rank === 'alpha') {
				status = rng(100) <= 5 ? 'deceased' : 'healthy';
				if (inbred) {
					let x = rng(100);
					status = x <= 10 ? 'deceased' : x <= 60 ? 'inbred' : 'inbred - healthy';
				}
				rank = rng(100) <= 30 ? 'omega' : 'runt';
			}
			else {
				status = rng(100) <= 60 ? 'deceased' : 'healthy';
				if (inbred) {
					let x = rng(100);
					status = x <= 60 ? 'deceased' : x <= 90 ? 'inbred' : 'inbred - healthy';
				}
				rank = 'runt';
			}

			if (status === 'deceased' && selections.behophoenix) {
				selectionsUsed.push('behophoenix');
				status = rng(100) <= 10 ? 'healthy' : 'deceased';
			}
			if (inbred && selections.shadowsdrake) {
				selectionsUsed.push('shadowsdrake');
				status = 'inbred - healthy';
			}

			if (status === 'inbred') {
				console.log('yas');
				let mutation = randomizer(dictionary.mutations.inbred);
				status = `inbred - ${mutation}`;

				if (mutation === 'respiratory') {
					inbredMessage = `You have 2 weeks to take your pup to Evrah's daycare and save them.`;
				}
				else if (mutation === 'anorexia') {
					inbredMessage = `Take the pup to Evrah's daycare to help them recover.`;
				}
				else if (mutation === 'dehydrated') {
					inbredMessage = `Give the pup a bottle of water.`;
				}
				else if (mutation === 'skin allergies') {
					inbredMessage = `Use soothing cream to heal it.`;
				}
			}

			if (status === 'deceased') {
				deceased = true;
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
			let output = '';

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
					output = rng(100) <= 5 + extraPass ? randomizer(dictionary.mutations.random) : '';
				}
				else {
					output = rng(100) <= 5 + extraPass ? randomizer(dictionary.mutations.inbred) : '';
				}
			}
			else if (parent1.mutation === parent2.mutation) {
				output = rng(100) <= 15 + extraPass ? parent1.mutation : '';
			}
			else if (parent1.mutation !== '' && parent2.mutation !== '') {
				output = rng(100) <= 8 + extraPass ? randomizer([parent1.mutation, parent2.mutation]) : '';
			}
			else if (parent1.mutation !== '') {
				output = rng(100) <= 8 + extraPass ? parent1.mutation : '';
			}
			else if (parent2.mutation !== '') {
				output = rng(100) <= 8 + extraPass ? parent2.mutation : '';
			}

			if (output === 'chimera') {
				chimera = true;
			}
			if (output === 'harlequin') {
				harlequin = true;
			}
			if (output !== 'chimera' && output !== 'harlequin') {
				selectionsUsed.splice(selectionsUsed.indexOf('mutation kings assistant'), 1);
			}

			if (output !== '') {
				return `\nM: ${output.capitalizeStr()}`;
			}
			return output;
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
			if (parent1Geno[0] === '') {
				parent1Geno[0] = 'Day';
			}
			if (parent2Geno[0] === '') {
				parent2Geno[0] = 'Day';
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

		function phenoReader(geno) {
			let output = [];
			geno.forEach(geno => {
				let genoSplit = geno.split('/');

				let coat = '';
				for (let key in dictionary.coatColours) {
					dictionary.coatColours[key].forEach(coatDict => {
						if (genoSplit.includes(coatDict[1])) {
							coat = coatDict[0];
						}
					});
				}

				let markings = [];
				for (let key in dictionary.markings) {
					dictionary.markings[key].forEach(markingsDict => {
						if (genoSplit.includes(markingsDict[1])) {
							markings.push(markingsDict[0]);
						}
					});
				}

				let temp = '';
				if (markings.length > 0) {
					temp = `${coat.capitalizeStr()} with ${markings.join(', ').capitalizeStr()}`;
				}
				else {
					temp = `${coat.capitalizeStr()}`;
				}

				output.push(temp);
			});
			
			return output;
		}

		function handleGenoPheno() {
			let parent1Geno = parent1.geno;
			let parent2Geno = parent1.geno;
			if (parent1.genoSecondary !== '' && rng(100) <= 50) {
				parent1Geno = parent1.genoSecondary;
			}
			if (parent2.genoSecondary !== '' && rng(100) <= 50) {
				parent2Geno = parent2.genoSecondary;
			}

			let geno = [];
			let pheno = [];
			if (chimera || harlequin) {
				geno = [rollGeno(parent1Geno, parent2Geno), rollGeno(parent1Geno, parent2Geno)];
				pheno = phenoReader(geno);
			}
			else {
				geno = [rollGeno(parent1Geno, parent2Geno)];
				pheno = phenoReader(geno);
			}
			// console.log(chimera, geno, pheno);

			return `G: ${geno.join(' || ')}
			P: ${pheno.join(' || ')}`;
		}

		function rollSkillsRunes() {
			let skills = dictionary.skills.reduce((obj, skill) => {
				obj[skill] = 0;
				return obj;
			}, {});

			let runes = dictionary.runes.reduce((obj, rune) => {
				obj[rune] = 0;
				return obj;
			}, {});

			let extraPass = 0;
			if (selections.runeSpirit) {
				selectionsUsed.push('rune spirit');
				extraPass += 10;
			}
			if (selections.furion) {
				skills.attack += 1;
			}
			if (selections.shellpin) {
				skills.defense += 1;
			}
			if (selections.stamvaul) {
				skills.speed += 1;
			}

			function rollSkillRunes(skillRune) {
				for (let key in skillRune) { 
					[parent1[key], parent2[key]].forEach(parentKey => {
						let parentSkillRune = Math.max(Math.min(50, parentKey), 10);
						for (let i = 0; i <= parentSkillRune; i++) {
							skillRune[key] += rng(100) <= parentSkillRune + extraPass ? 1 : 0;
						}
					});
				}
			}
			rollSkillRunes(skills);
			rollSkillRunes(runes);

			let skillsString = Object.entries(skills).map(([key, value]) => `+${value} ${key.capitalizeStr()}`).join(', ');
			let runesString = Object.entries(runes).map(([key, value]) => `+${value} ${key.capitalizeStr()}`).join(', ');

			return `Skills: ${skillsString}\nRunes: ${runesString}`;
		}

		function rollHereditaryTraits() {
			let traits = [];
			let traitProbabilities = {
				common: 40,
				uncommon: 30,
				rare: 20,
				unique: 10,
			};

			[parent1.hereditaryTraits, parent2.hereditaryTraits].forEach(trait => {
				let rarity = Object.keys(dictionary.hereditaryTraits).find(key => dictionary.hereditaryTraits[key].includes(trait));
				if (rarity && rng(100) <= traitProbabilities[rarity]) {
					traits.push(trait);
				}
			});

			if (traits.length !== 0) {
				return `\nHereditary Traits:\n${traits.map(string => `- ${string}`).join('\n').capitalizeStr()}`;
			}
			return '';
		}

		let output = '';
		output += `${mythikaCount}) ${rollSpecies()}, ${rollGender()}, ${rollStatusRank()}`;
		output += `\nB: ${[rollBuild(), rollPhysical()].filter(Boolean).join(', ')}`;
		output += `${rollMutation()}`;
		output += `\n${handleGenoPheno()}`;
		output += `\n${rollSkillsRunes()}`;
		output += `${rollHereditaryTraits()}`;

		return output;
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
		if (inbredMessage !== '') {
			offspring.innerHTML += `\n${inbredMessage}`;
		}
		document.getElementById('output').appendChild(offspring);
	}

	if (selectionsUsed.filter(Boolean).length > 0) {
		const used = document.createElement('div');
		used.innerHTML = `Breeding used ${selectionsUsed.filter(onlyUnique).join(', ').capitalizeStr()}`;
		document.getElementById('output').prepend(used);
	}

	const deceasedAlert = document.createElement('div');
	if (deceased) {
		deceasedAlert.innerHTML = `Unfortunately, one of your pups was born deceased. Head over to Nova’s Contracts to resurrect your pup.`;
	}
	document.getElementById('output').appendChild(deceasedAlert);
}
