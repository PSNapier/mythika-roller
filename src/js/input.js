// INPUT

function addGeno() {
	['parent1', 'parent2'].forEach((parent) => {
		let wrapper = document.createElement('div');
		wrapper.classList.add('flex', 'pt-2', 'justify-center');

		let label = document.createElement('div');
		label.classList.add('pr-2');
		label.innerText = `Geno`;
		wrapper.appendChild(label);

		let input = document.createElement('input');
		input.id = `${parent}geno`;
		input.type = 'text';
		input.classList.add('text-neutral-900');
		wrapper.appendChild(input);

		document.getElementById(parent).appendChild(wrapper);
	})
}

addGeno();

function addSelect(id, dict) {
	['parent1','parent2'].forEach((parent) => {
		// wrapper div
		let wrapper = document.createElement('div');
		wrapper.classList.add('flex', 'pt-2', 'justify-center');

		// label div
		let label = document.createElement('div');
		label.classList.add('pr-2');
		label.innerText = `${id.capitalizeStr()}`;
		wrapper.appendChild(label);

		// select
		let select = document.createElement('select');
		select.id = `${parent}${id.replace(' ', '')}`;
		select.classList.add('text-neutral-900');
		wrapper.appendChild(select);

		// default value
		let option = document.createElement('option');
		option.value = '';
		option.text = 'Select';
		select.appendChild(option);

		// option vs optgroup
		function singleTier() { // dict = ['string', 'string,'...]
			for (let i = 0; i < dict.length; i++) {
				let option = document.createElement('option');
				option.value = dict[i].replace(' ', '-');
				option.text = dict[i].capitalizeStr();
				select.appendChild(option);
			}
		}

		function multiTier() { // dict = {key: ['string', 'string,'...]...}
			for (let key in dict) { 
				let optGroup = document.createElement('optgroup');
				optGroup.label = `${key.capitalizeStr()}`;
				for (let i = 0; i < dict[key].length; i++) {
					let option = document.createElement('option');
					option.value = dict[key][i].replace(' ', '-');
					option.text = dict[key][i].capitalizeStr();
					optGroup.appendChild(option);
				}
				select.appendChild(optGroup);
			}
		}

		if (dict.constructor === Array) {
			singleTier();
		}
		else if (dict.constructor === Object) {
			multiTier();
		}

		// combine
		document.getElementById(parent).appendChild(wrapper);
	})
}

// create a select menu based on dictionary.species and add it to parent1 div
addSelect('species', dictionary.species);
addSelect('rank', dictionary.rank);
addSelect('build', dictionary.build);
addSelect('ear trait', dictionary.physicalTraits.ears);
addSelect('tail trait', dictionary.physicalTraits.tail);
addSelect('bonus trait', dictionary.physicalTraits.bonus);
addSelect('mutation', dictionary.mutations.random);
addSelect('hereditary traits', dictionary.hereditaryTraits);

const items = [
	'nero\'s luck',
	'arativa\'s spirit',
	'solasdrake',
	'shadowsdrake',
	'furion',
	'shellpin',
	'stamvaul',
	'tolerance crystal',
	'unknown mixture a',
	'unknown mixture b',
];
const pets = [
	'behopheonix',
	'rune spirit',
	'fertility elk',
];

function addItems(id, dict) {
	for (let i = 0; i < dict.length; i++) {
		let wrapper = document.createElement('div');
		wrapper.classList.add('flex', 'pt-2', 'justify-center');

		let checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = dict[i].replace(/\s/g, '').replace(/\'/g, '');
		wrapper.appendChild(checkbox);

		let label = document.createElement('div');
		label.classList.add('pr-2');
		label.innerText = `${dict[i].capitalizeStr()}`;
		wrapper.appendChild(label);

		document.getElementById(id).appendChild(wrapper);
	}
}

addItems('selections', items);
addItems('selections', pets);