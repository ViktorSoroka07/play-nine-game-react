/**
 * Can any subset of `arr` add up to exactly `n`?
 *
 * `arr` must be sorted ascending - the two early exits below rely on the
 * smallest value being first and the largest last.
 */
export function possibleCombinationSum(arr: number[], n: number): boolean {
  if (arr.includes(n)) {
    return true;
  }

  const smallest = arr[0];
  const largest = arr[arr.length - 1];

  if (smallest === undefined || largest === undefined) {
    return false;
  }

  if (smallest > n) {
    return false;
  }

  if (largest > n) {
    return possibleCombinationSum(arr.slice(0, -1), n);
  }

  // Every subset is a bit pattern over the list: bit j set means arr[j] is in.
  const combinationsCount = 1 << arr.length;

  for (let combination = 1; combination < combinationsCount; combination++) {
    let combinationSum = 0;

    for (const [index, value] of arr.entries()) {
      if (combination & (1 << index)) {
        combinationSum += value;
      }
    }

    if (n === combinationSum) {
      return true;
    }
  }

  return false;
}
