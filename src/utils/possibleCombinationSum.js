export function possibleCombinationSum(arr, n) {
  if (arr.indexOf(n) >= 0) {
    return true;
  }

  if (arr[0] > n) {
    return false;
  }

  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }

  const listSize = arr.length;
  const combinationsCount = 1 << listSize;

  for (let i = 1; i < combinationsCount; i++) {
    let combinationSum = 0;

    for (let j = 0; j < listSize; j++) {
      if (i & (1 << j)) {
        combinationSum += arr[j];
      }
    }

    if (n === combinationSum) {
      return true;
    }
  }

  return false;
}
