const normalizeToIntegers = require('../src/normalize-to-integers');
const assert = require('assert');
const _ = require('lodash');

describe('normalizeToIntegers()', function() {
  it('should return inputs when sum of numbers is zero', function () {
    assert.deepStrictEqual([], normalizeToIntegers([], 100));
    assert.deepStrictEqual([0], normalizeToIntegers([0], 100));
    assert.deepStrictEqual([1, -1], normalizeToIntegers([1, -1], 100));
  });
  it('should return zero when target = 0', function () {
    assert.deepStrictEqual([0, 0, 0], normalizeToIntegers([3, 3, 3], 0));
  });
  it('sum of returned numbers should equal to target value', function () {
    const result = normalizeToIntegers([3, 3, 3], 100);
    assert.strictEqual(3, result.length);
    assert.strictEqual(100, _.sum(result));
  });
  it('should return first numbers when pass returned numbers', function () {
    var numbers = [
      [60, 10, 15, 15],  // first numbers (sum = 100)
      [78, 13, 19, 20],  // returned numbers (sum = 130)
    ];
    assert.deepStrictEqual(numbers[1], normalizeToIntegers(numbers[0], _.sum(numbers[1])));
    assert.deepStrictEqual(numbers[0], normalizeToIntegers(numbers[1], _.sum(numbers[0])));
  });
  describe('error should be less than 1', function () {
    this.timeout(0);  // disable timeout

    const diffFromIdeal = function(numbers, normalizedNumbers, targetInt) {
      const sumNumbers = numbers.reduce((sum, n) => sum + n, 0);
      return numbers.map((n, index) => {
        if (n === 0) return 0;
        const ideal = n / sumNumbers * targetInt;
        const normalized = normalizedNumbers[index];
        return Math.abs(ideal - normalized);
      });
    };

    const testNumbers = function(inputs, target) {
      const result = normalizeToIntegers(inputs, target);
      const diffs = diffFromIdeal(inputs, result, target)
      const maxDiff = _.max(diffs);
      try {
        assert.strictEqual(target, _.sum(result));
        assert(maxDiff < 1);
        assert(_.every(result, (n) => 0 <= n));
      } catch (e) {
        console.log(inputs, target);
        console.log(result);
        console.log(diffs);
        throw e;
      }
    }

    it('brute force', function () {
      _.each([1, 2, 100, 200, 300], (target) => {
      _.each([10, 20, 30, 40, 50, 60, 70, 80, 90], (a) => {
      _.each([10, 20, 30, 40, 50, 60, 70, 80, 90], (b) => {
      _.each([10, 20, 30, 40, 50, 60, 70, 80, 90], (c) => {
      _.each([10, 20, 30, 40, 50, 60, 70, 80, 90], (d) => {
      _.each([10, 20, 30, 40, 50, 60, 70, 80, 90], (e) => {
        testNumbers([a, b, c, d, e], target);
      }); }); }); }); }); });
    });

    it('random', function () {
      _.times(10000, () => {
        const inputs = _.times(100, () => Math.random() * 10);
        const target = Math.round(Math.random() * 100);
        testNumbers(inputs, target);
      });
    });
  });
});
