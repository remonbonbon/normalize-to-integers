(function(global) {
  'use strict;'

  function _sortByDiffAbs(a, b) {
    // ascending sort
    if(a.diffAbs > b.diffAbs) return -1;
    if(a.diffAbs < b.diffAbs) return 1;
    return 0;
  }

  function _sortByIndex(a, b) {
    // descending sort
    if(a.index > b.index) return 1;
    if(a.index < b.index) return -1;
    return 0;
  }

  function normalizeToIntegers(numbers, targetInt) {
    const sumNumbers = numbers.reduce((sum, n) => sum + n, 0);
    if (0 === sumNumbers) {
      // This condition causes division by zero.
      return numbers;
    }

    var normalized = numbers.map((num, index) => {
      const ideal = num / sumNumbers * targetInt;
      const rounded = Math.round(ideal);
      return {
        original: num,
        ideal: ideal,
        rounded: rounded,
        diff: rounded - ideal,
        diffAbs: Math.abs(rounded - ideal),
        index: index,
      };
    });

    var sumRounded = normalized.reduce((sum, n) => sum + n.rounded, 0);
    var j = 0;
    const normalizedLength = normalized.length;
    while(sumRounded !== targetInt) {
      normalized.sort(_sortByDiffAbs);
      for(j = 0; j < normalizedLength; j += 1) {
        if (sumRounded < targetInt) {
          if (0 > normalized[j].diff) {
            normalized[j].rounded += 1;
            normalized[j].diff = normalized[j].rounded - normalized[j].ideal;
            normalized[j].diffAbs = Math.abs(normalized[j].diff);
            sumRounded += 1;
            break;
          }
        } else {
          if (0 < normalized[j].diff) {
            normalized[j].rounded -= 1;
            normalized[j].diff = normalized[j].rounded - normalized[j].ideal;
            normalized[j].diffAbs = Math.abs(normalized[j].diff);
            sumRounded -= 1;
            break;
          }
        }
      }
    }

    normalized.sort(_sortByIndex);
    return normalized.map((a) => a.rounded);
  }

  if ('process' in global) {
    module.exports = normalizeToIntegers;
  }
})((this || 0).self || global);
