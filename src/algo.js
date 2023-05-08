const searchLongestPalindrome = () => {
  const str = `^#${"radar".split('').join('#')}#$`;
  const pldrmLengthArr = new Array(str.length).fill(0);
  let center = 0;
  let rightBoundary = 0;

  for (let i = 1; i < str.length - 1; i++) {
    const i_mirror = 2 * center - i;
    if (i < rightBoundary) {
      pldrmLengthArr[i] = Math.min(rightBoundary - i, pldrmLengthArr[i_mirror]);
    }

    while (str[i - 1 - pldrmLengthArr[i]] === str[i + 1 + pldrmLengthArr[i]]) {
      pldrmLengthArr[i]++;
    }

    if (i + pldrmLengthArr[i] > rightBoundary) {
      center = i;
      rightBoundary = i + pldrmLengthArr[i];
    }
  }

  let maxLen = 0;
  let centerOfPldrmIdx = 0;
  for (let i = 1; i < str.length - 1; i++) {
    if (pldrmLengthArr[i] > maxLen) {
      maxLen = pldrmLengthArr[i];
      centerOfPldrmIdx = i;
    }
  }

  const startIdx = (centerOfPldrmIdx - maxLen) / 2;
  const endIdx = startIdx + maxLen;
  return console.log(s.substring(startIdx, endIdx));
}