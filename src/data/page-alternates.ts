// Translation map for the section and landing pages. Slugs are localised, so the
// language prefix alone cannot be swapped to derive an alternate URL.
// A language is omitted when no translation of that page exists.
export type PageAlternateSet = Partial<Record<'sv' | 'en' | 'es', string>>;

export const pageAlternateSets: PageAlternateSet[] = [
  { sv: "/sv/ai-information/", en: "/en/ai-information/", es: "/es/informacion-ia/" },
  { sv: "/sv/insikter/", en: "/en/insights/", es: "/es/perspectivas/" },
  { sv: "/sv/kontakt/", en: "/en/contact/", es: "/es/contacto/" },
  { sv: "/sv/expertomraden/", en: "/en/expertise/", es: "/es/areas-de-expertise/" },
  { sv: "/sv/radgivning/", en: "/en/advisory/", es: "/es/asesoria/" },
  { sv: "/sv/utbildning-workshops/", en: "/en/training-workshops/", es: "/es/formacion-talleres/" },
  { sv: "/sv/forsaljningstransformation/", en: "/en/sales-transformation/" },
];

export const pageAlternatesByUrl: Record<string, PageAlternateSet> = Object.fromEntries(
  pageAlternateSets.flatMap(set =>
    Object.values(set).map(url => [url, set] as [string, PageAlternateSet])
  )
);
