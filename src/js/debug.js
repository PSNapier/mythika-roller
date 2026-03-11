// DEBUG - Shift+D+B randomizes form for test rolls

(function () {
  let seqIndex = 0;
  let resetTimeout;

  function resetSequence() {
    seqIndex = 0;
  }

  function getAllOptions(obj) {
    if (Array.isArray(obj)) return obj;
    return Object.values(obj).flat();
  }

  function randomizeForm() {
    ['parent1', 'parent2'].forEach((parent) => {
      // Geno: coat/marking format from dictionary
      const allCoats = getAllOptions(dictionary.coatColours);
      const coat = randomizer(allCoats);
      const allMarkings = [];
      for (const key in dictionary.markings) {
        dictionary.markings[key].forEach((m) => allMarkings.push(m[1]));
      }
      const markingCount = rngRange(0, 3);
      const markings = [];
      for (let i = 0; i < markingCount; i++) {
        markings.push(randomizer(allMarkings));
      }
      const genoStr = [coat[1], ...markings].filter(Boolean).join('/');
      const genoEl = document.getElementById(`${parent}geno`);
      if (genoEl) genoEl.value = genoStr;

      // Selects
      const selects = {
        species: dictionary.species,
        rank: dictionary.rank,
        build: getAllOptions(dictionary.build),
        eartrait: dictionary.physicalTraits.ears,
        tailtrait: dictionary.physicalTraits.tail,
        bonustrait: dictionary.physicalTraits.bonus,
        mutation: [...dictionary.mutations.random, ''],
        hereditarytraits: getAllOptions(dictionary.hereditaryTraits),
      };
      for (const [id, options] of Object.entries(selects)) {
        const el = document.getElementById(`${parent}${id}`);
        if (el) {
          if (el.multiple) {
            const opts = Array.from(el.options).filter((o) => o.value);
            Array.from(el.options).forEach((opt) => (opt.selected = false));
            const pick = rngRange(0, Math.min(2, opts.length));
            const chosen = new Set();
            for (let i = 0; i < pick; i++) {
              const opt = randomizer(opts.filter((o) => !chosen.has(o)));
              if (opt) {
                chosen.add(opt);
                opt.selected = true;
              }
            }
          } else {
            const val = randomizer(options.filter(Boolean));
            el.value = val || '';
          }
        }
      }

      // Stats (skills + runes)
      [...dictionary.skills, ...dictionary.runes].forEach((key) => {
        const el = document.getElementById(`${parent}${key.replace(/\s/g, '')}`);
        if (el) el.value = rngRange(0, 50);
      });
    });

    // Items & pets checkboxes
    const allItemIds = [
      'nerosluck', 'arativasspirit', 'soulapocalypse', 'solasdrake', 'shadowsdrake',
      'furion', 'shellpin', 'stamvaul', 'tolerancecrystal', 'unknownmixturea',
      'unknownmixtureb', 'behophoenix', 'runespirit', 'fertilityelk', 'mutationkingsassistant',
    ];
    allItemIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.checked = Math.random() < 0.3;
    });
  }

  document.addEventListener('keydown', (e) => {
    if (seqIndex === 0 && e.shiftKey && (e.key === 'd' || e.key === 'D')) {
      seqIndex = 1;
    } else if (seqIndex === 1 && (e.key === 'b' || e.key === 'B')) {
      randomizeForm();
      resetSequence();
      return;
    } else if (e.key !== 'Shift') {
      resetSequence();
    }

    clearTimeout(resetTimeout);
    resetTimeout = setTimeout(resetSequence, 1500);
  });
})();
