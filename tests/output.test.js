import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  checkBloodlinePure,
  calcLitterAmountPure,
  phenoReader,
  rollSkillsRunesPure,
} from '../src/js/roll-logic.js';

describe('checkBloodlinePure', () => {
  it('returns inbred: false when no bloodline overlap', () => {
    const parent1 = { bloodline: ['A', 'B'] };
    const parent2 = { bloodline: ['C', 'D'] };
    const result = checkBloodlinePure(parent1, parent2);
    expect(result.inbred).toBe(false);
    expect(result.inbredIds).toEqual([]);
  });

  it('returns inbred: true and inbredIds when overlap exists', () => {
    const parent1 = { bloodline: ['A', 'B', 'X'] };
    const parent2 = { bloodline: ['C', 'X'] };
    const result = checkBloodlinePure(parent1, parent2);
    expect(result.inbred).toBe(true);
    expect(result.inbredIds).toContain('X');
  });

  it('filters out A# ancestors', () => {
    const parent1 = { bloodline: ['A', 'A#123'] };
    const parent2 = { bloodline: ['A'] };
    const result = checkBloodlinePure(parent1, parent2);
    expect(result.parent1Bloodline).not.toContain('A#123');
    expect(result.parent1Bloodline).toContain('A');
  });
});

describe('calcLitterAmountPure', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 4 when soulApocalypse selected and rng passes', () => {
    const p1 = { rank: 'alpha' };
    const p2 = { rank: 'alpha' };
    const selections = { soulApocalypse: true, fertilityElk: false };
    const result = calcLitterAmountPure(p1, p2, selections, rng, rngRange);
    expect(result.amount).toBe(4);
    expect(result.usedItem).toBe('soul apocalypse');
  });

  it('returns 4 when fertilityElk selected and rng passes', () => {
    const p1 = { rank: 'alpha' };
    const p2 = { rank: 'alpha' };
    const selections = { soulApocalypse: false, fertilityElk: true };
    const result = calcLitterAmountPure(p1, p2, selections, rng, rngRange);
    expect(result.amount).toBe(4);
    expect(result.usedItem).toBe('fertility elk');
  });

  it('returns 1–3 for runt rank', () => {
    const p1 = { rank: 'runt' };
    const p2 = { rank: 'alpha' };
    const selections = {};
    Math.random.mockReturnValue(0);
    const result = calcLitterAmountPure(p1, p2, selections, rng, rngRange);
    expect(result.amount).toBe(1);
    Math.random.mockReturnValue(0.999);
    const result2 = calcLitterAmountPure(p1, p2, selections, rng, rngRange);
    expect(result2.amount).toBe(3);
  });

  it('returns 3–4 for alpha rank', () => {
    const p1 = { rank: 'alpha' };
    const p2 = { rank: 'alpha' };
    const selections = {};
    Math.random.mockReturnValue(0);
    const result = calcLitterAmountPure(p1, p2, selections, rng, rngRange);
    expect(result.amount).toBe(3);
  });
});

describe('phenoReader', () => {
  it('maps geno to pheno using dictionary', () => {
    const geno = ['Day/Acc/Bla'];
    const result = phenoReader(geno, dictionary);
    expect(result.length).toBe(1);
    expect(result[0]).toContain('Daybreak');
    expect(result[0]).toContain('Accents');
  });

  it('handles coat without markings', () => {
    const geno = ['Day'];
    const result = phenoReader(geno, dictionary);
    expect(result.length).toBe(1);
    expect(result[0]).toContain('Daybreak');
  });
});

describe('rollSkillsRunesPure', () => {
  it('uses defence key from dictionary (regression)', () => {
    const p1 = { attack: 0, speed: 0, defence: 0, elemancy: 0, medic: 0, dark: 0, void: 0 };
    const p2 = { attack: 0, speed: 0, defence: 0, elemancy: 0, medic: 0, dark: 0, void: 0 };
    const selections = { shellpin: true };
    const result = rollSkillsRunesPure(p1, p2, selections, dictionary);
    expect(result).toContain('+1 Defence');
  });

  it('adds speed from stamvaul', () => {
    const p1 = { attack: 0, speed: 0, defence: 0, elemancy: 0, medic: 0, dark: 0, void: 0 };
    const p2 = { attack: 0, speed: 0, defence: 0, elemancy: 0, medic: 0, dark: 0, void: 0 };
    const selections = { stamvaul: true };
    const result = rollSkillsRunesPure(p1, p2, selections, dictionary);
    expect(result).toContain('+1 Speed');
  });

  it('adds attack from furion', () => {
    const p1 = { attack: 0, speed: 0, defence: 0, elemancy: 0, medic: 0, dark: 0, void: 0 };
    const p2 = { attack: 0, speed: 0, defence: 0, elemancy: 0, medic: 0, dark: 0, void: 0 };
    const selections = { furion: true };
    const result = rollSkillsRunesPure(p1, p2, selections, dictionary);
    expect(result).toContain('+1 Attack');
  });

  it('calculates pass from parent stats', () => {
    const p1 = { attack: 25, speed: 0, defence: 0, elemancy: 0, medic: 0, dark: 0, void: 0 };
    const p2 = { attack: 15, speed: 0, defence: 0, elemancy: 0, medic: 0, dark: 0, void: 0 };
    const selections = {};
    const result = rollSkillsRunesPure(p1, p2, selections, dictionary);
    expect(result).toContain('Attack');
    expect(result).toMatch(/\+[3-9] Attack/);
  });
});
