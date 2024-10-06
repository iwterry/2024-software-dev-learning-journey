import { describe, test, it, expect } from "vitest";
import { calculateAverage, factorial, fizzBuzz, max } from "../src/intro";

describe('max', () => {
  it('should return the first argument if it is greater', () => {
    // arrange
    const a = 2;
    const b = 1;
    // act 
    const result = max(a, b);
    // assert
    expect(result).toBe(2);
  });

  it('should return the second argument if it is greater', () => {
    // arrange
    const a = 1;
    const b = 2;
    // act 
    const result = max(a, b);
    // assert
    expect(result).toBe(2);
  });

  it('should return the first argument if both arguments are equal', () => {
    // arrange
    const a = 1;
    const b = 1;
    // act 
    const result = max(a, b);
    // assert
    expect(result).toBe(1);
  });
});

describe('fizzBuzz', () => {
  it('should return "FizzBuzz" when the argument is divisible by both 3 and 5', () => {
    const numDivisibleBy3And5 = 15;

    const result = fizzBuzz(numDivisibleBy3And5);

    expect(result).toBe('FizzBuzz');
  });

  it('should return "Fizz" when the argument is divisible by 3 and not 5', () => {
    const numDivisibleBy3AndNot5 = 6;

    const result = fizzBuzz(numDivisibleBy3AndNot5);

    expect(result).toBe('Fizz');
  });

  it('should return "Buzz" when the argument is divisible by 5 and not 3', () => {
    const numDivisibleBy5AndNot3 = 10;

    const result = fizzBuzz(numDivisibleBy5AndNot3);

    expect(result).toBe('Buzz');
  });

  it('should return the argument as a string when the argument is not divisible by 3 or 5', () => {
    const numNotDivisibleBy3Or5 = 7;

    const result = fizzBuzz(numNotDivisibleBy3Or5);

    expect(result).toBe('7');
  });
});

describe('calculateAverage', () => {
  it('should return a NaN when given an empty array', () => {
    const numbers = [];

    const result = calculateAverage(numbers);
    
    expect(result).toBe(Number.NaN);
  });

  it('should return the number in the array when given an array of one item', () => {
    const numbers = [1];

    const result = calculateAverage(numbers);
    
    expect(result).toBe(1);
  });

  it('should return the average of two numbers in the array when given an array of two items', () => {
    const numbers = [1, 2];

    const result = calculateAverage(numbers);
    
    expect(result).toBeCloseTo(1.5, 5);
  });

  it('should return the average of three numbers in the array when given an array of three items', () => {
    const numbers = [1, 2, 3];

    const result = calculateAverage(numbers);
    
    expect(result).toBeCloseTo(2, 5);
  });
});

describe('factorial', () => {
  it('should return 1 when given 0', () => {
    const num = 0;

    const result = factorial(num);

    expect(result).toBe(1);
  });

  it('should return 1 when given 1', () => {
    const num = 1;

    const result = factorial(num);

    expect(result).toBe(1);
  });

  it('should return 2 when given 2', () => {
    const num = 2;

    const result = factorial(num);

    expect(result).toBe(2);
  });

  it('should return 6 when given 3', () => {
    const num = 3;

    const result = factorial(num);

    expect(result).toBe(6);
  });

  it('should return 24  when given 4', () => {
    const num = 4;

    const result = factorial(num);

    expect(result).toBe(24);
  });

  it('should return undefined when given a negative number', () => {
    const negativeNum = -1;

    const result = factorial(negativeNum);

    expect(result).toBeUndefined();
  });


});