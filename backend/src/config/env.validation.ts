// Fail fast at startup instead of running with missing or weak secrets.
// Wired into ConfigModule.forRoot({ validate }) in app.module.ts.

const ALWAYS_REQUIRED = ['DATABASE_URL', 'JWT_SECRET'] as const;

// Razorpay throws on construction without keys, and CORS needs an explicit origin,
// so production refuses to start without them rather than failing later.
const PRODUCTION_REQUIRED = ['FRONTEND_URL', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'] as const;

const MIN_PRODUCTION_JWT_SECRET_LENGTH = 32;

export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const isProduction = config.NODE_ENV === 'production';
  const required: readonly string[] = isProduction
    ? [...ALWAYS_REQUIRED, ...PRODUCTION_REQUIRED]
    : ALWAYS_REQUIRED;

  const missing = required.filter((key) => !String(config[key] ?? '').trim());
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (isProduction && String(config.JWT_SECRET).length < MIN_PRODUCTION_JWT_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET must be at least ${MIN_PRODUCTION_JWT_SECRET_LENGTH} characters in production`,
    );
  }

  return config;
}

// SWAGGER_ENABLED overrides the default (on everywhere except NODE_ENV=production),
// so the cloud dev backend can run in production mode and still expose /api/docs.
export function isSwaggerEnabled(env: Record<string, string | undefined>): boolean {
  const flag = env.SWAGGER_ENABLED?.trim().toLowerCase();
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return env.NODE_ENV !== 'production';
}

// FRONTEND_URL may hold several comma-separated origins (e.g. custom domain + Netlify URL).
export function parseAllowedOrigins(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}
