import { describe, it, expect } from 'vitest';

describe('dictionary structure', () => {
  it('has required keys', () => {
    expect(dictionary).toHaveProperty('species');
    expect(dictionary).toHaveProperty('speciesIllegalCrosses');
    expect(dictionary).toHaveProperty('build');
    expect(dictionary).toHaveProperty('coatColours');
    expect(dictionary).toHaveProperty('markings');
    expect(dictionary).toHaveProperty('markingsSorted');
    expect(dictionary).toHaveProperty('hereditaryTraits');
    expect(dictionary).toHaveProperty('skills');
    expect(dictionary).toHaveProperty('runes');
    expect(dictionary).toHaveProperty('physicalTraits');
    expect(dictionary).toHaveProperty('mutations');
  });

  it('speciesIllegalCrosses only uses species from dictionary.species', () => {
    const validSpecies = new Set(dictionary.species);
    for (const pair of dictionary.speciesIllegalCrosses) {
      expect(pair).toHaveLength(2);
      expect(validSpecies.has(pair[0])).toBe(true);
      expect(validSpecies.has(pair[1])).toBe(true);
    }
  });

  it('markingsSorted contains all marking codes from markings', () => {
    const expected = [];
    for (const key of Object.keys(dictionary.markings)) {
      for (const [full, code] of dictionary.markings[key]) {
        expected.push(code);
      }
    }
    expect(dictionary.markingsSorted).toEqual(expect.arrayContaining(expected));
    expect(dictionary.markingsSorted.length).toBe(expected.length);
  });

  it('skills includes defence (matches rollSkillsRunesPure usage)', () => {
    expect(dictionary.skills).toContain('defence');
  });

  it('build has common, uncommon, rare tiers', () => {
    expect(dictionary.build).toHaveProperty('common');
    expect(dictionary.build).toHaveProperty('uncommon');
    expect(dictionary.build).toHaveProperty('rare');
  });

  it('coatColours has common, uncommon, rare', () => {
    expect(dictionary.coatColours).toHaveProperty('common');
    expect(dictionary.coatColours).toHaveProperty('uncommon');
    expect(dictionary.coatColours).toHaveProperty('rare');
  });

  it('mutations has random and inbred arrays', () => {
    expect(Array.isArray(dictionary.mutations.random)).toBe(true);
    expect(Array.isArray(dictionary.mutations.inbred)).toBe(true);
  });
});
