export type Locale = (typeof locales)[number];

export const locales = ['en', 'de','fr','es'] as const;
export const defaultLocale: Locale = 'en';