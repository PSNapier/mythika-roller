// INPUT

// auto populate parents
// go through dictionary and populate input UI based upon available options

function addSelect(id, array) { // array = ['string', 'string,'...]
	['parent1','parent2'].forEach((parent) => {
		let select = document.createElement('select');
		select.id = `${parent}${id}`;
		select.classList .add('text-neutral-900');
		document.getElementById(parent).appendChild(select);
		for (let i = 0; i < array.length; i++) {
			let option = document.createElement('option');
			option.value = array[i].replace(' ', '-');
			option.text = array[i].capitalizeStr();
			select.appendChild(option);
		}
	})
}

// create a select menu based on dictionary.species and add it to parent1 div
addSelect('species', dictionary.species);

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