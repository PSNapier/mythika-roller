import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('rng', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns value in range 1 to max inclusive when random is 0', () => {
    expect(rng(10)).toBe(1);
  });

  it('returns max when random is just below 1', () => {
    Math.random.mockReturnValue(0.999);
    expect(rng(10)).toBe(10);
  });

  it('returns integer in [1, max] for various max values', () => {
    Math.random.mockReturnValue(0.5);
    const result = rng(6);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(6);
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe('rngRange', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns min when random is 0', () => {
    expect(rngRange(1, 10)).toBe(1);
  });

  it('returns max when random is just below 1', () => {
    Math.random.mockReturnValue(0.999);
    expect(rngRange(1, 10)).toBe(10);
  });

  it('returns integer in [min, max] inclusive', () => {
    Math.random.mockReturnValue(0.5);
    const result = rngRange(2, 5);
    expect(result).toBeGreaterThanOrEqual(2);
    expect(result).toBeLessThanOrEqual(5);
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe('randomizer', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns empty string for empty array', () => {
    expect(randomizer([])).toBe('');
  });

  it('returns single element when array has one item', () => {
    expect(randomizer(['a'])).toBe('a');
  });

  it('returns element from array', () => {
    const arr = ['a', 'b', 'c'];
    Math.random.mockReturnValue(0);
    expect(randomizer(arr)).toBe('a');
    Math.random.mockReturnValue(0.99);
    expect(randomizer(arr)).toBe('c');
  });
});

describe('onlyUnique', () => {
  it('filters duplicates', () => {
    const arr = ['a', 1, 'a', 2, '1'];
    expect(arr.filter(onlyUnique)).toEqual(['a', 1, 2, '1']);
  });

  it('keeps all when unique', () => {
    expect([1, 2, 3].filter(onlyUnique)).toEqual([1, 2, 3]);
  });
});

describe('sortByArray', () => {
  it('sorts by given order', () => {
    const arrayToSort = ['apple', 'banana', 'cherry', 'date'];
    const sortOrder = ['banana', 'date', 'apple', 'cherry'];
    expect(arrayToSort.sortByArray(sortOrder)).toEqual(['banana', 'date', 'apple', 'cherry']);
  });

  it('handles partial order', () => {
    const arr = ['c', 'a', 'b'];
    expect(arr.sortByArray(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
  });
});

describe('capitalizeStr', () => {
  it('capitalizes first letter', () => {
    expect('hello'.capitalizeStr()).toBe('Hello');
  });

  it('capitalizes after space', () => {
    expect('hello world'.capitalizeStr()).toBe('Hello World');
  });

  it('capitalizes after hyphen', () => {
    expect('hello-world'.capitalizeStr()).toBe('Hello-World');
  });

  it('capitalizes after slash', () => {
    expect('hello/world'.capitalizeStr()).toBe('Hello/World');
  });
});
