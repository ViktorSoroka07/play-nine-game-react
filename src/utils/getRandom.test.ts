import { getRandom } from './getRandom';

describe('getRandom', () => {
  it('returns a number between 1 and 9', () => {
    for (let i = 0; i < 100; i++) {
      const result = getRandom();
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(9);
      expect(Number.isInteger(result)).toBe(true);
    }
  });
});
