// Pure roll logic - extracted for testability
// Dependencies: rng, rngRange, randomizer, onlyUnique, String.prototype.capitalizeStr, Array.prototype.sortByArray

export function checkBloodlinePure(parent1, parent2) {
  const p1Bloodline = parent1.bloodline
    .filter(Boolean)
    .filter((ancestor) => !ancestor.includes("A#"));
  const p2Bloodline = parent2.bloodline
    .filter(Boolean)
    .filter((ancestor) => !ancestor.includes("A#"));
  const inbredIds = p1Bloodline.filter((ancestor) => p2Bloodline.includes(ancestor));
  return {
    parent1Bloodline: p1Bloodline,
    parent2Bloodline: p2Bloodline,
    inbred: inbredIds.length > 0,
    inbredIds,
  };
}

export function calcLitterAmountPure(parent1, parent2, selections, rngFn, rngRangeFn) {
  if (selections.soulApocalypse && rngFn(100) <= 40) {
    return { amount: 4, usedItem: "soul apocalypse" };
  }
  if (selections.fertilityElk && rngFn(100) <= 40) {
    return { amount: 4, usedItem: "fertility elk" };
  }
  if (parent1.rank === "runt" || parent2.rank === "runt") {
    return { amount: rngRangeFn(1, 3) };
  }
  if (parent1.rank === "omega" || parent2.rank === "omega") {
    return { amount: rngRangeFn(2, 3) };
  }
  if (parent1.rank === "beta" || parent2.rank === "beta") {
    return { amount: rngRangeFn(2, 4) };
  }
  if (parent1.rank === "alpha" || parent2.rank === "alpha") {
    return { amount: rngRangeFn(3, 4) };
  }
  return { amount: 1 };
}

export function phenoReader(genoArray, dictionary) {
  const output = [];
  genoArray.forEach((genoStr) => {
    const genoSplit = genoStr.split("/");
    let coat = "";
    for (const key in dictionary.coatColours) {
      dictionary.coatColours[key].forEach((coatDict) => {
        if (genoSplit.includes(coatDict[1])) coat = coatDict[0];
      });
    }
    const markings = [];
    for (const key in dictionary.markings) {
      dictionary.markings[key].forEach((markingsDict) => {
        if (genoSplit.includes(markingsDict[1])) markings.push(markingsDict[0]);
      });
    }
    const temp =
      markings.length > 0
        ? `${coat.capitalizeStr()} with ${markings.join(", ").capitalizeStr()}`
        : `${coat.capitalizeStr()}`;
    output.push(temp);
  });
  return output;
}

export function rollSkillsRunesPure(parent1, parent2, selections, dictionary) {
  const skills = dictionary.skills.reduce((obj, skill) => {
    obj[skill] = 0;
    return obj;
  }, {});
  const runes = dictionary.runes.reduce((obj, rune) => {
    obj[rune] = 0;
    return obj;
  }, {});

  let extraPass = 0;
  if (selections.runeSpirit) extraPass += 10;
  if (selections.furion) skills.attack += 1;
  if (selections.shellpin) skills.defence += 1;
  if (selections.stamvaul) skills.speed += 1;

  function rollSkillRunes(skillRune) {
    for (const key in skillRune) {
      let totalPass = 0;
      [parent1[key], parent2[key]].forEach((parentKey) => {
        totalPass += Math.floor((parentKey || 0) / 10) + extraPass;
      });
      skillRune[key] += totalPass;
    }
  }
  rollSkillRunes(skills);
  rollSkillRunes(runes);

  const skillsString = Object.entries(skills)
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => `+${value} ${key.capitalizeStr()}`)
    .join(", ");
  const runesString = Object.entries(runes)
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => `+${value} ${key.capitalizeStr()}`)
    .join(", ");
  const output = [];
  if (skillsString) output.push(`Skills: ${skillsString}`);
  if (runesString) output.push(`Runes: ${runesString}`);
  return output.join("\n");
}
