import { parseAllowedOrigins, validateEnv } from './env.validation';

const STRONG_SECRET = 'x'.repeat(32);

const productionEnv = {
  NODE_ENV: 'production',
  DATABASE_URL: 'postgresql://u:p@host/db',
  JWT_SECRET: STRONG_SECRET,
  FRONTEND_URL: 'https://example.org',
  RAZORPAY_KEY_ID: 'rzp_test_x',
  RAZORPAY_KEY_SECRET: 'secret',
};

describe('validateEnv', () => {
  it('accepts a complete production config', () => {
    expect(validateEnv(productionEnv)).toBe(productionEnv);
  });

  it('only requires DATABASE_URL and JWT_SECRET outside production', () => {
    const devEnv = { NODE_ENV: 'development', DATABASE_URL: 'postgresql://x', JWT_SECRET: 'short' };
    expect(() => validateEnv(devEnv)).not.toThrow();
  });

  it('rejects a missing JWT_SECRET in every environment', () => {
    expect(() => validateEnv({ DATABASE_URL: 'postgresql://x' })).toThrow(/JWT_SECRET/);
  });

  it('treats blank values as missing', () => {
    expect(() => validateEnv({ ...productionEnv, DATABASE_URL: '   ' })).toThrow(/DATABASE_URL/);
  });

  it('lists every missing production variable', () => {
    const { FRONTEND_URL, RAZORPAY_KEY_SECRET, ...rest } = productionEnv;
    expect(() => validateEnv(rest)).toThrow(/FRONTEND_URL, RAZORPAY_KEY_SECRET/);
  });

  it('rejects a short JWT_SECRET in production', () => {
    expect(() => validateEnv({ ...productionEnv, JWT_SECRET: 'too-short' })).toThrow(/at least 32/);
  });
});

describe('parseAllowedOrigins', () => {
  it('splits, trims and drops trailing slashes and empty entries', () => {
    expect(parseAllowedOrigins(' https://a.org/ , https://b.netlify.app,, ')).toEqual([
      'https://a.org',
      'https://b.netlify.app',
    ]);
  });

  it('returns an empty list when unset', () => {
    expect(parseAllowedOrigins(undefined)).toEqual([]);
  });
});
