// INPUT

function addTextInput(type) {
	['parent1', 'parent2'].forEach((parent) => {
		let wrapper = document.createElement('div');
		wrapper.classList.add('flex', 'pt-2', 'justify-start');

		let label = document.createElement('div');
		label.classList.add('pr-2');
		label.innerText = `${type.capitalizeStr()}`;
		wrapper.appendChild(label);

		let input = document.createElement('input');
		input.id = `${parent}${type}`;
		input.type = 'text';
		input.classList.add('text-neutral-900');
		wrapper.appendChild(input);

		document.getElementById(`${parent}genetics`).appendChild(wrapper);
	})
}
addTextInput('bloodline');
addTextInput('geno');

function addSelect(id, dict) {
	['parent1','parent2'].forEach((parent) => {
		// wrapper div
		let wrapper = document.createElement('div');
		wrapper.classList.add('flex', 'pt-2', 'sm:justify-start');

		// label div
		let label = document.createElement('div');
		label.classList.add('pr-2');
		label.innerText = `${id.capitalizeStr()}`;
		wrapper.appendChild(label);

		// select
		let select = document.createElement('select');
		select.id = `${parent}${id.replace(' ', '')}`;
		select.classList.add('text-neutral-900', 'small-caps');
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
				option.value = dict[i];
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
					option.value = dict[key][i];
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
		document.getElementById(`${parent}genetics`).appendChild(wrapper);
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

['parent1hereditarytraits', 'parent2hereditarytraits'].forEach((parent) => {
	document.getElementById(parent).multiple = true;
});

function addNumberInput(type) {
	['parent1', 'parent2'].forEach((parent) => {
		let wrapper = document.createElement('div');
		wrapper.classList.add('grid', 'grid-rows-2', 'm-1', 'justify-center');

		let label = document.createElement('div');
		label.classList.add('text-center');
		label.innerText = `${type.capitalizeStr()}`;
		wrapper.appendChild(label);

		let input = document.createElement('input');
		input.id = `${parent}${type.replace(/\s/g, '')}`;
		input.type = 'number';
		input.classList.add('text-neutral-900', 'w-[60px]', 'px-1');
		wrapper.appendChild(input);

		document.getElementById(`${parent}stats`).appendChild(wrapper);
	})
}
dictionary.skills.forEach(skill => addNumberInput(skill));
dictionary.runes.forEach(rune => addNumberInput(rune));

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
	'behophoenix',
	'rune spirit',
	'fertility elk',
	'mutation king\'s assistant'
];

function addItems(id, dict) {
	for (let i = 0; i < dict.length; i++) {
		let wrapper = document.createElement('div');
		wrapper.classList.add('flex', 'pt-2', 'justify-start');

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

addItems('items', items);
addItems('pets', pets);