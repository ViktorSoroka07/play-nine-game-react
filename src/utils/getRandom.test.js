import { getRandom } from './getRandom';

describe('getRandom', () => {
  it('returns an integer between 1 and 9', () => {
    for (let i = 0; i < 100; i += 1) {
      const value = getRandom();
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(9);
    }
  });
});
