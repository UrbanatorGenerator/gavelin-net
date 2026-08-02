// Maps each insight article to its translations. Slugs differ per language, so the
// language prefix alone cannot be swapped to derive an alternate URL.
export interface AlternateSet {
  sv: string;
  en: string;
  es: string;
}

export const alternateSets: AlternateSet[] = [
  { sv: "/sv/insikter/manniskans-eq-och-ai-i-forsaljning/", en: "/en/insights/human-eq-and-ai-in-sales/", es: "/es/perspectivas/eq-humana-e-ia-en-ventas/" },
  { sv: "/sv/insikter/odysseus-att-bli-ledare/", en: "/en/insights/odysseus-becoming-a-leader/", es: "/es/perspectivas/odiseo-como-se-forja-un-lider/" },
  { sv: "/sv/insikter/antagandeglappet/", en: "/en/insights/assumption-gap/", es: "/es/perspectivas/brecha-de-suposiciones/" },
  { sv: "/sv/insikter/affaren-dor-efter-ja/", en: "/en/insights/deal-dies-after-yes/", es: "/es/perspectivas/acuerdo-muere-despues-del-si/" },
  { sv: "/sv/insikter/intaktsarkitektur-reset/", en: "/en/insights/revenue-architecture-reset/", es: "/es/perspectivas/arquitectura-de-ingresos/" },
  { sv: "/sv/insikter/hastighetsfallen/", en: "/en/insights/velocity-trap/", es: "/es/perspectivas/trampa-de-la-velocidad/" },
  { sv: "/sv/insikter/deal-framework/", en: "/en/insights/deal-framework/", es: "/es/perspectivas/framework-deal/" },
  { sv: "/sv/insikter/affarer-fastnar-pa-80/", en: "/en/insights/deals-stalled-at-80/", es: "/es/perspectivas/acuerdos-estancados-en-80/" },
  { sv: "/sv/insikter/dolda-anledningen-kunder-stannar/", en: "/en/insights/hidden-reason-buyers-stall/", es: "/es/perspectivas/razon-oculta-compradores-se-frenan/" },
  { sv: "/sv/insikter/osynliga-kvoten/", en: "/en/insights/invisible-quota/", es: "/es/perspectivas/cuota-invisible/" },
  { sv: "/sv/insikter/fran-timmar-till-minuter/", en: "/en/insights/from-hours-to-minutes/", es: "/es/perspectivas/de-horas-a-minutos/" },
  { sv: "/sv/insikter/kontroll-vs-sjalvstandighet/", en: "/en/insights/control-vs-enablement/", es: "/es/perspectivas/control-vs-autonomia/" },
  { sv: "/sv/insikter/revenue-ops-blind-spot/", en: "/en/insights/revenue-ops-blind-spot/", es: "/es/perspectivas/punto-ciego-revenue-ops/" },
  { sv: "/sv/insikter/fran-brandkamp-till-prognos/", en: "/en/insights/from-firefighting-to-forecasting/", es: "/es/perspectivas/de-apagar-fuegos-a-pronosticar/" },
  { sv: "/sv/insikter/precision-prospektering/", en: "/en/insights/precision-prospecting/", es: "/es/perspectivas/prospeccion-de-precision/" },
  { sv: "/sv/insikter/mott-uno/", en: "/en/insights/meet-uno/", es: "/es/perspectivas/conoce-uno/" },
  { sv: "/sv/insikter/sluta-alska-din-losning/", en: "/en/insights/stop-loving-your-solution/", es: "/es/perspectivas/deja-de-amar-tu-solucion/" },
  { sv: "/sv/insikter/skala-kaos/", en: "/en/insights/scaling-chaos/", es: "/es/perspectivas/escalar-el-caos/" },
  { sv: "/sv/insikter/gillbarhet-slar-fortroende/", en: "/en/insights/likeability-beats-trust/", es: "/es/perspectivas/simpatia-supera-confianza/" },
  { sv: "/sv/insikter/nar-ai-saljer-utan-dig/", en: "/en/insights/when-ai-starts-selling/", es: "/es/perspectivas/cuando-ia-empieza-a-vender/" },
  { sv: "/sv/insikter/salja-till-ai-savvy-kopare/", en: "/en/insights/selling-to-ai-savvy-buyers/", es: "/es/perspectivas/vender-al-comprador-experto-en-ia/" },
  { sv: "/sv/insikter/ai-agenter-doden-for-b-spelaren/", en: "/en/insights/ai-agents-death-of-b-player/", es: "/es/perspectivas/agentes-ia-muerte-del-jugador-b/" },
  { sv: "/sv/insikter/kopare-undviker-ditt-saljteam/", en: "/en/insights/buyers-avoid-your-sales-team/", es: "/es/perspectivas/compradores-evitan-tu-equipo/" },
  { sv: "/sv/insikter/revolutionera-din-saljvardag-med-ai/", en: "/en/insights/revolutionize-your-sales-day-with-ai/", es: "/es/perspectivas/revoluciona-tu-dia-de-ventas/" },
];

export const alternatesByUrl: Record<string, AlternateSet> = Object.fromEntries(
  alternateSets.flatMap(set => [[set.sv, set], [set.en, set], [set.es, set]])
);
