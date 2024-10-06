import { describe, it, expect, assert, beforeEach} from "vitest";
import { calculateDiscount, canDrive, fetchData, getCoupons, isPriceInRange, isValidUsername, Stack, validateUserInput } from "../src/core";

describe('getCoupons', () => {
  it('should return a non-empty array', () => {
    const coupons = getCoupons();

    expect(Array.isArray(coupons)).toBe(true);
    expect(coupons.length).toBeGreaterThan(0);
  })

  it('should return an array of coupons: each coupon code is a non-empty string', () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('code');
      expect(coupon.code).toBeTypeOf("string");
      expect(coupon.code.trim()).not.toBe('');
    });
  })

  it('should return an array of coupons: each coupon discount is between 0 (exclusive) and 1 (exclusive)', () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('discount');
      expect(coupon.discount).toBeTypeOf("number");
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  })

})


describe('calculateDiscount', () => {
  it('should return discounted price if given valid code', () => {
    let result = calculateDiscount(10, 'SAVE10');
    expect(result).toBe(9);

    result = calculateDiscount(10, 'SAVE20');
    expect(result).toBe(8);
  })

  it('should handle non-numeric price', () => {
    const result = calculateDiscount('10', 'SAVE10');
    expect(result).toMatch(/invalid/i);
  })

  it('should handle negative price', () => {
    const result = calculateDiscount(-1, 'SAVE10');
    expect(result).toMatch(/invalid/i);
  })

  it('should handle non-string discount code', () => {
    const result = calculateDiscount(10, 10);
    expect(result).toMatch(/invalid/i);
  })

  it('should handle invalid string discount code', () => {
    const result = calculateDiscount(10, 'SAVEINVALIDCODE');
    expect(result).toBe(10);
  })
})

describe('validateUserInput', () => {
  it('should return a successful validation message when given valid user name and age', () => {
    const validUsername = 'usr';
    const validAge = 18;

    const result = validateUserInput(validUsername, validAge);

    expect(result).match(/success/i);
  })

  it('should return an error message when given username less than 3 characters', () => {
    const invalidUsername = 'ab';
    const validAge = 18;

    const result = validateUserInput(invalidUsername, validAge);

    expect(result).match(/invalid/i);
  })

  it('should return an error message when given username with more than 255 characters', () => {
    const invalidUsername = 'a'.repeat(256);
    const validAge = 18;

    const result = validateUserInput(invalidUsername, validAge);

    expect(result).match(/invalid/i);
  })

  it('should return an error message when given a numeric username', () => {
    const invalidUsername = 123;
    const validAge = 18;

    const result = validateUserInput(invalidUsername, validAge);

    expect(result).match(/invalid/i);
  })

  it('should return an error message when given an age less than 18', () => {
    const validUsername = 'usr';
    const invalidAge = 17;

    const result = validateUserInput(validUsername, invalidAge);

    expect(result).match(/invalid/i);
  })

  it('should return an error message when given an age greater than 127', () => {
    const validUsername = 'usr';
    const invalidAge = 128;

    const result = validateUserInput(validUsername, invalidAge);

    expect(result).match(/invalid/i);
  })

  it('should return an error message when given a string age', () => {
    const validUsername = 'usr';
    const invalidAge = '18';

    const result = validateUserInput(validUsername, invalidAge);

    expect(result).match(/invalid/i);
  })

  it('should return an error message when given invalid username and age', () => {
    const invalidUsername = 'ab';
    const invalidAge = 17;

    const result = validateUserInput(invalidUsername, invalidAge);
    
    expect(result).match(/invalid/i);
    expect(result).match(/age/i);
    expect(result).match(/username/i);
  })
})

describe('isPriceInRange', () => {
  // it('should return false when the price is outside the range', () => {
  //   const resultWhenPriceLessThanMininum = isPriceInRange(-10, 0, 100);
  //   expect(resultWhenPriceLessThanMininum).toBe(false);
   
  //   const resultWhenPriceGreaterThanMaximum = isPriceInRange(200, 0, 100);
  //   expect(resultWhenPriceGreaterThanMaximum).toBe(false);
  // })

  // it('should return true when the price is on the boundary', () => {
  //   const resultWhenPriceEqualsMininum = isPriceInRange(0, 0, 100);
  //   expect(resultWhenPriceEqualsMininum).toBe(true);
   
  //   const resultWhenPriceEqualsMaximum = isPriceInRange(100, 0, 100);
  //   expect(resultWhenPriceEqualsMaximum).toBe(true);
  // })

  // it('should return true when the price is inside range between min and max', () => {
  //   const resultWhenPriceWithinMinAndMax = isPriceInRange(10, 0, 100);
  //   expect(resultWhenPriceWithinMinAndMax).toBe(true);
  // })
 
  const MAX_PRICE = 100;
  const MIN_PRICE = 0;

  it.each([
    { description: 'min < price < max' , price: 10,             expectedResult: true },
    { description: 'price = min',        price: MIN_PRICE,      expectedResult: true },
    { description: 'price = max',        price: MAX_PRICE,      expectedResult: true },
    { description: 'price < min ',       price: MIN_PRICE - 1,  expectedResult: false },
    { description: 'price > max',        price: MAX_PRICE + 1,  expectedResult: false },
  ]) ('should return $expectedResult when $description', ({ price, expectedResult }) => {
    const actualResult = isPriceInRange(price, MIN_PRICE, MAX_PRICE);
    expect(actualResult).toBe(expectedResult);
  })
})

describe('isValidUsername', () => {
  const MININUM_USERNAME_LENGTH = 5;
  const MAXIMUM_USERNAME_LENGTH = 15;

  it('should return false when length of username is outside of boundary', () => {
    const resultWhenUsernameLengthIsLessThanMin = isValidUsername('a'.repeat(MININUM_USERNAME_LENGTH - 1));
    expect(resultWhenUsernameLengthIsLessThanMin).toBe(false);

    const resultWhenUsernameLengthIsGreaterThanMax = isValidUsername('a'.repeat(MAXIMUM_USERNAME_LENGTH + 1));
    expect(resultWhenUsernameLengthIsGreaterThanMax).toBe(false);
  })

  it('should return true when length of username is on the boundary', () => {
    const resultWhenUsernameLengthEqualsMin = isValidUsername('a'.repeat(MININUM_USERNAME_LENGTH));
    expect(resultWhenUsernameLengthEqualsMin).toBe(true);

    const resultWhenUsernameLengthEqualsMax = isValidUsername('a'.repeat(MAXIMUM_USERNAME_LENGTH));
    expect(resultWhenUsernameLengthEqualsMax).toBe(true);
  })

  it('should return true when length of username is inside the boundary', () => {
    const resultWhenUsernameLengthGreaterThanMin = isValidUsername('a'.repeat(MININUM_USERNAME_LENGTH + 1));
    expect(resultWhenUsernameLengthGreaterThanMin).toBe(true);

    const resultWhenUsernameLengthLessThanMax = isValidUsername('a'.repeat(MAXIMUM_USERNAME_LENGTH - 1));
    expect(resultWhenUsernameLengthLessThanMax).toBe(true);
  })

  it('should return false when given non-string username', () => {
    const resultWhenUsernameIsNumber = isValidUsername(3);
    expect(resultWhenUsernameIsNumber).toBe(false);

    const resultWhenUsernameIsNull = isValidUsername(null);
    expect(resultWhenUsernameIsNull).toBe(false);

    const resultWhenUsernameIsUndefined = isValidUsername(undefined);
    expect(resultWhenUsernameIsUndefined).toBe(false);
  })
})

describe('canDrive', () => {
  it('should return error message when given invalid country code', () => {
    const invalidCountryCode = 'INVALID';
    const age = 20;

    const result = canDrive(age, invalidCountryCode);

    expect(result).toMatch(/invalid/i);
  })

  it.each([
    { age: 16, countryCode: 'US', result: true },
    { age: 15, countryCode: 'US', result: false },
    { age: 17, countryCode: 'US', result: true },
    { age: 17, countryCode: 'UK', result: true },
    { age: 16, countryCode: 'UK', result: false },
    { age: 18, countryCode: 'UK', result: true },
  ]) ('should return $result for age $age and country code $countryCode', ({ age, countryCode, result: expectedResult }) => {
      const actualResult = canDrive(age, countryCode);
      expect(actualResult, expectedResult);
    })
})

describe('fetchData', () => {
  it ('should return a promise that will resolve to a nom-empty array of numbers', async () => {
    let result;

    result = await fetchData();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  })
})

describe('Stack', () => {
  let stack;

  beforeEach(() => {
    stack = new Stack();
  })

  describe('push', () => {
    it('should increase the size of stack by one each time when called', () => {
      expect(stack.size()).toBe(0);

      stack.push(1);
      expect(stack.size()).toBe(1);

      stack.push(1);
      expect(stack.size()).toBe(2);
    })
  })

  describe('pop', () => {
    it('should decrease the size of the stack by one and return an item from the stack opposite order that it came in', () => {
      stack.push(1);
      stack.push(3);
      expect(stack.size()).toBe(2);

      let item = stack.pop();
      expect(stack.size()).toBe(1);
      expect(item).toBe(3);

      item = stack.pop();
      expect(stack.size()).toBe(0);
      expect(item).toBe(1);
    })

    it('should throw error when stack is empty', () => {
      expect(() => stack.pop()).toThrowError(/empty/i);
    })
  })

  describe('peak', () => {
    it('should not change size of stack and return the item last recently add to stack', () => {
      stack.push(1);

      let item = stack.peek();

      expect(item).toBe(1);
      expect(stack.size()).toBe(1)


      stack.push(3);

      item = stack.peek();

      expect(item).toBe(3);
      expect(stack.size()).toBe(2)
    })

    it('should throw error when stack is empty', () => {
      expect(() => stack.peek()).toThrowError(/empty/i);
    })
  })

  describe('isEmpty', () => {
    it('should return true if no items in stack', () => {
      expect(stack.isEmpty()).toBe(true);

      stack.push(1);
      stack.pop();

      expect(stack.isEmpty()).toBe(true);
    })

    it('should return false when at least one item in stack', () => {
      stack.push(1);
      expect(stack.isEmpty()).toBe(false);

      stack.push(5);
      expect(stack.isEmpty()).toBe(false);
    })
  })

  describe('clear', () => {
    it('should empty stack', () => {
      stack.push(1);

      stack.clear();

      expect(stack.size()).toBe(0);
    })
  })


})