export interface Geometry {
  type: string;
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Station {
  code_site: string;
  libelle_site: string;
  code_station: string;
  libelle_station: string;
  type_station: string;
  coordonnee_x_station: number;
  coordonnee_y_station: number;
  code_projection: number;
  longitude_station: number;
  latitude_station: number;
  influence_locale_station: number;
  commentaire_station?: string | null;
  altitude_ref_alti_station?: number | null;
  code_systeme_alti_site?: string | null;
  code_commune_station: string;
  libelle_commune: string;
  code_departement: string;
  libelle_departement: string;
  code_region: string;
  libelle_region: string;
  code_cours_eau: string;
  libelle_cours_eau: string;
  uri_cours_eau: string;
  descriptif_station?: string | null;
  date_maj_station?: string;
  date_ouverture_station?: string;
  date_fermeture_station?: string | null;
  commentaire_influence_locale_station?: string | null;
  code_regime_station?: number;
  qualification_donnees_station?: number;
  code_finalite_station?: string;
  type_contexte_loi_stat_station?: number;
  type_loi_station?: number;
  code_sandre_reseau_station?: string | null;
  date_debut_ref_alti_station?: string | null;
  date_activation_ref_alti_station?: string | null;
  date_maj_ref_alti_station?: string | null;
  en_service: boolean;
  geometry?: Geometry;
}

export const MOCK_STATION: Station = {
  code_site: 'X2405010',
  libelle_site: 'La Lane à Valderoure [Malamaire]',
  code_station: 'X240501001',
  libelle_station: 'La Lane à Valderoure [Malamaire]',
  type_station: 'STD',
  coordonnee_x_station: 994882,
  coordonnee_y_station: 6305796,
  code_projection: 26,
  longitude_station: 6.664341306,
  latitude_station: 43.789590526,
  influence_locale_station: 1,
  commentaire_station: null as any,
  altitude_ref_alti_station: null as any,
  code_systeme_alti_site: null as any,
  code_commune_station: '06154',
  libelle_commune: 'VALDEROURE',
  code_departement: '06',
  code_region: '93',
  libelle_region: "PROVENCE-ALPES-COTE D'AZUR",
  code_cours_eau: 'X2400500',
  libelle_cours_eau: 'La Lane',
  uri_cours_eau: 'http://id.eaufrance.fr/CEA/X2400500',
  descriptif_station: null as any,
  date_maj_station: '2021-05-12T00:00:00Z',
  date_ouverture_station: '1977-08-01T00:00:00Z',
  date_fermeture_station: '1994-10-31T00:00:00Z',
  commentaire_influence_locale_station: null as any,
  code_regime_station: 1,
  qualification_donnees_station: 12,
  code_finalite_station: '1 2',
  type_contexte_loi_stat_station: 1,
  type_loi_station: 1,
  code_sandre_reseau_station: null as any,
  date_debut_ref_alti_station: null as any,
  date_activation_ref_alti_station: null as any,
  date_maj_ref_alti_station: null as any,
  libelle_departement: 'ALPES-MARITIMES',
  en_service: false,
};
