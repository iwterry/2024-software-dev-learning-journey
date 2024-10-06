import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getDiscount, getPriceInCurrency, getShippingInfo, isOnline, login, renderPage, signUp, submitOrder } from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';
import { getShippingQuote } from '../src/libs/shipping';
import { trackPageView } from '../src/libs/analytics';
import { charge } from '../src/libs/payment';
import security from '../src/libs/security';
import { sendEmail } from '../src/libs/email';

// mocking a module
//     - every exported function in the module will be replaced with a mock function
vi.mock('../src/libs/currency');
vi.mock('../src/libs/shipping');
vi.mock('../src/libs/analytics');
vi.mock('../src/libs/payment');

// partial mocking of a module
vi.mock('../src/libs/email', async (factory) => {
  const origModule = await factory();
  
  // only the sendEmail function is being mocked, and not the other functions exported by the module
  return {
    ...origModule,
    sendEmail: vi.fn()
  }
});

describe('test suite', () => {
  it('test case', () => {
    const greet = vi.fn();

    // greet.mockReturnValue('Hello');
    // console.log(greet());
    
    greet.mockImplementation((name) => 'Hello ' + name);
    console.log(greet('John'));

    // greet.mockResolvedValue('Hello World!');
    // greet().then((data) => console.log(data));

    // expect(greet).toHaveBeenCalled();
    // expect(greet).toHaveBeenCalledOnce();
    expect(greet).toHaveBeenCalledWith('John');
  })

  it('exercise 1: mock functions', () => {
    const sendText = vi.fn().mockImplementation((message) => 'ok');
    const result = sendText('Hello');
    expect(sendText).toHaveBeenCalled();
    expect(result).toMatch(/ok/i);
  })
})

describe('getPriceInCurrency', () => {
  it('should return price in target currency', () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);
    const price = getPriceInCurrency(10, 'AUD');
    expect(price).toBe(15);
  })
})

describe('getShippingInfo', () => {
  it('should return error message when shipping info is unavailable', () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);
    const result = getShippingInfo('Texas');
    expect(result).toMatch(/unavailable/i);
  })

  it('should return a message about the shipping info', () => {
    vi.mocked(getShippingQuote).mockReturnValue({
      cost: 10,
      estimatedDays: 5
    });

    const result = getShippingInfo('Texas');

    expect(result).toMatch('$10');
    expect(result).toMatch(/5 days/i);
  })
})

describe('renderPage', () => {
  it('should return correct content', async () => {
    const result = await renderPage();
    expect(result).toMatch(/content/i);
  })

  it('should trackPageView with the correct argument', async () => {
    vi.mocked(trackPageView).mockImplementation((path) => null);
    await renderPage();
    expect(trackPageView).toHaveBeenCalledWith('/home');
  })
})

describe('submitOrder', () => {
  beforeEach(() => {
    vi.mocked(charge).mockClear()
  })

  it('should return success when payment succeeded', async () => {
    vi.mocked(charge).mockResolvedValue({
      status: 'successful'
    });

    const result = await submitOrder({ totalAmount: 10 }, 'cc_test');
    
    expect(result).toMatchObject({
      success: true
    });
  })

  it('should call payment service once with correct arguments when payment succeeded', async () => {
    vi.mocked(charge).mockResolvedValue({
      status: 'successful'
    });

    await submitOrder({ totalAmount: 10 }, 'cc_test');
    
    expect(charge).toHaveBeenCalledOnce();
    expect(charge).toHaveBeenCalledWith('cc_test', 10);
  })

  it('should return error when payment failed', async () => {
    vi.mocked(charge).mockResolvedValue({
      status: 'failed'
    });

    const result = await submitOrder({ totalAmount: 10 }, 'cc_test');

    expect(result).toMatchObject({
      success: false,
      error: 'payment_error'
    });
  })

  it('should call payment service once with correct arguments when payment failed', async () => {
    vi.mocked(charge).mockResolvedValue({
      status: 'failed'
    });

    await submitOrder({ totalAmount: 10 }, 'cc_test');
    
    expect(charge).toHaveBeenCalledOnce();
    expect(charge).toHaveBeenCalledWith('cc_test', 10);
  })
})

describe('signUp', () => {
  beforeEach(() => {
    vi.mocked(sendEmail).mockClear();
  })

  it('should return false if email is not valid', async() => {
    const result = await signUp('invalidEmail');

    expect(result).toBe(false);
  })

  it('should return true if email is valid', async() => {
    const validEmail = 'john@email.com';

    const result = await signUp(validEmail);

    expect(result).toBe(true);
  })

  it('should send one welcome email if email is valid', async() => {
    const validEmail = 'john@email.com';

    await signUp(validEmail);

    const [emailUsed, welcomeMessage] = vi.mocked(sendEmail).mock.calls[0];
   
    expect(sendEmail).toHaveBeenCalledOnce();
    expect(emailUsed).toBe(validEmail);
    expect(welcomeMessage).toMatch(/welcome/i)
  })
})

describe('login', () => {
  it('should email the one-time login code', async() => {
    const spy = vi.spyOn(security, 'generateCode');
    const email = 'name@domain.com';

    await login(email);

    const gerarateCode = String(spy.mock.results[0].value);
    expect(sendEmail).toBeCalledWith(email, gerarateCode);
  })
})

describe('isOnline', () => {
  it('should return false if current hour is outside opening hours', () => {
    vi.setSystemTime('2024-01-01 07:59');
    expect(isOnline()).toBe(false);

    vi.setSystemTime('2024-01-01 20:01');
    expect(isOnline()).toBe(false);
  })
})

describe('getDiscount', () => {
  it('should be the correct discount when it is Christmas', () => {
    vi.setSystemTime('2024-12-25 00:00');
    expect(getDiscount()).toBe(0.2);

    vi.setSystemTime('2024-12-25 23:59');
    expect(getDiscount()).toBe(0.2);
  })

  it('should be no discount when it is not Christmas', () => {
    vi.setSystemTime('2024-12-24 23:59');
    expect(getDiscount()).toBe(0);

    vi.setSystemTime('2024-12-26 00:00');
    expect(getDiscount()).toBe(0);
  })
})