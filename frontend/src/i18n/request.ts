import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export const locales = ["en", "te", "hi"] as const;
export const DEFAULT_LOCALE = "en";
export type Locale = (typeof locales)[number];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get("locale")?.value ?? DEFAULT_LOCALE;
  const locale: Locale = (locales as readonly string[]).includes(raw)
    ? (raw as Locale)
    : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
