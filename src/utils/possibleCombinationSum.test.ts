import { possibleCombinationSum } from './possibleCombinationSum';

describe('possibleCombinationSum', () => {
  it('returns true when n is directly in array', () => {
    expect(possibleCombinationSum([1, 2, 3], 2)).toBe(true);
  });

  it('returns false when smallest number is greater than n', () => {
    expect(possibleCombinationSum([5, 6, 7], 4)).toBe(false);
  });

  it('returns true when numbers can combine to target', () => {
    expect(possibleCombinationSum([1, 3, 5, 7], 8)).toBe(true);
  });

  it('returns false when no combination can reach target', () => {
    expect(possibleCombinationSum([2, 4, 6], 5)).toBe(false);
  });

  it('returns false for an empty board', () => {
    expect(possibleCombinationSum([], 3)).toBe(false);
  });

  it('drops values larger than the target before searching', () => {
    expect(possibleCombinationSum([1, 2, 9], 3)).toBe(true);
  });
});
