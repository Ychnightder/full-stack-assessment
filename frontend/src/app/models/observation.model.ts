export interface ObservationElab {
  // Observation “élaborée” (validée/experte)
  code_site: string;
  code_station: string;
  grandeur_hydro_elab: string; // ex: 'HIXM'
  date_obs_elab: string; // Date de la mesure (ISO)
  resultat_obs_elab: number; // Valeur mesurée/estimée
  date_prod?: string; // Date de production (fallback si date_obs_elab absente)
  libelle_statut?: string; // Ex: "Donnée validée"
  libelle_methode?: string; // Ex: "Expertisée"
  libelle_qualification?: string;
  longitude?: number;
  latitude?: number;
}

export interface ObservationTR {
  // Observation “temps réel” (brute)
  code_site: string;
  code_station: string;
  grandeur_hydro: string; // 'H' (niveau), 'Q' (débit), etc.
  date_obs: string; // Date de la mesure (ISO)
  resultat_obs: number; // Valeur mesurée
  libelle_statut?: string; // Ex: "Brute"
  libelle_methode_obs?: string; // Ex: "Mesurée"
  libelle_qualification_obs?: string;
  longitude?: number;
  latitude?: number;
}

// Type unifié utilisé par le frontend pour manipuler les observations
export type Grandeur = 'H' | 'Q' | 'HIXM' | string;

export interface UniObservation {
  code_station: string; // Identifiant station
  date_obs: string; // Date ISO (normalisée)
  grandeur: Grandeur; // Type de mesure (H/Q/HIXM/...)
  value: number; // Valeur numérique
  statut?: string; // Statut textuel (Brute/Validée)
  qualif?: string; // Qualité ("Bonne"/"Non qualifiée"/...)
}

/**
 * Convertit une observation temps réel (ObservationTR) vers le format unifié UniObservation.
 * - But: avoir un seul format dans l’app (date_obs, grandeur, value).
 * - Si la valeur n’est pas numérique, retourne null (facile à filtrer).
 */
export function fromTR(o: ObservationTR): UniObservation | null {
  const v = Number(o.resultat_obs);
  if (!Number.isFinite(v)) return null; // garde seulement les valeurs valides

  return {
    code_station: o.code_station,
    date_obs: o.date_obs, // date TR
    grandeur: o.grandeur_hydro, // H/Q/...
    value: v, // valeur numeric
    statut: o.libelle_statut, // ex: "Brute"
    qualif: o.libelle_qualification_obs, // ex: "Non qualifiée"
  };
}

/**
 * Convertit une observation élaborée (ObservationElab) vers UniObservation.
 * - Choisit date_obs_elab si disponible, sinon date_prod (fallback).
 * - Retourne null si la valeur n’est pas numérique.
 */
export function fromELAB(o: ObservationElab): UniObservation | null {
  const v = Number(o.resultat_obs_elab);
  if (!Number.isFinite(v)) return null;

  return {
    code_station: o.code_station,
    date_obs: o.date_obs_elab ?? o.date_prod ?? '', // normalise la date
    grandeur: o.grandeur_hydro_elab, // ex: HIXM
    value: v,
    statut: o.libelle_statut, // ex: "Donnée validée"
    qualif: o.libelle_qualification, // ex: "Bonne"
  };
}

/**
 * Filtre les éléments null et trie les observations unifiées par date croissante.
 * - Utile pour préparer une série avant calcul de tendances ou “dernier point”.

 */
export function mergeSort(items: (UniObservation | null)[]): UniObservation[] {
  const filtered = items.filter((o): o is UniObservation => o !== null);
  // Trie chronologiquement (du plus ancien au plus récent)
  return filtered.sort((a, b) => +new Date(a.date_obs) - +new Date(b.date_obs));
}

/**
 * Sélectionne la dernière observation d’une grandeur donnée (ex: 'H' pour niveau d’eau).
 * - Cherche la grandeur et retourne la plus récente.
 * - Si aucune observation pour cette grandeur, retourne null.
 */
export function pickLast(arr: UniObservation[], g: Grandeur): UniObservation | null {
  const sub = arr.filter((o) => o.grandeur === g);
  if (!sub.length) return null;

  // Compare les dates et prend la max
  return sub.reduce((a, b) => (+new Date(a.date_obs) > +new Date(b.date_obs) ? a : b));
}

/**
 * Calcule la variation sur ~24h pour une grandeur donnée.
 * - Trie la série, prend le dernier point (end) et le point “au plus proche” d’il y a 24h (start).
 * - Retourne end.value - start.value arrondi à 2 décimales.
 * - Si la série est trop courte (<2 points) ou valeurs invalides → null.
 */
export function delta24h(arr: UniObservation[], g: Grandeur): number | null {
  // Série filtrée et triée par date
  const sub = mergeSort(arr.filter((o) => o.grandeur === g));

  if (sub.length < 2) return null;

  const end = sub[sub.length - 1]; // dernier point
  const endT = +new Date(end.date_obs);
  const dayAgo = endT - 24 * 3600 * 1000; // timestamp -24h

  // start = point le plus ancien dans la série qui est ≤ end - 24h
  let start = sub[0];
  for (const o of sub) {
    if (+new Date(o.date_obs) <= dayAgo) start = o;
    else break; // dès qu’on dépasse dayAgo, on s’arrête
  }

  const d = end.value - start.value;
  return Number.isFinite(d) ? +d.toFixed(2) : null;
}
