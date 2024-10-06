// Lesson: Writing your first tests
export function max(a, b) {
  // if (a > b) return a;
  // else if (b > a) return b;
  // return a;

  return a >= b ? a : b;
}

// Exercise
export function fizzBuzz(n) {
  if (n % 3 === 0 && n % 5 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return n.toString();
}

export function calculateAverage(numbers) {
  // if (numbers.length === 0) return Number.NaN;
  // if (numbers.length === 1) return (numbers[0]) / 1;
  // if (numbers.length === 2) return (numbers[0] + numbers[1]) / 2;
  // return (numbers[0] + numbers[1] + numbers[2]) / 3;

  const numOfNumbers = numbers.length; 

  if (numOfNumbers === 0) return Number.NaN;

  const sum = numbers.reduce((accum, num) => accum + num, 0);
  return sum / numOfNumbers;
}

export function factorial(num) {
  if (num < 0) return undefined;
  if (num === 0) return 1;
  // if (num === 4) return 4 * 3 * 2 * 1; // 4 * factorial(3)
  // if (num === 3) return 3 * 2 * 1; // 3 * factorial(2)
  // if (num === 2) return 2 * 1; // 2 * factorial(1)
  // if (num === 1) return 1 * 1; // 1 * factorial(0)

  // return num * factorial(num - 1);

  let product = 1;
  
  for (let i = num; i > 1; i -= 1) {
    product = product * i;
  }

  return product;
}