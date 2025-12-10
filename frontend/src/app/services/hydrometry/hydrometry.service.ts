import { Injectable } from '@angular/core';
import axios from 'axios';
import {
  Grandeur,
  ObservationElab,
  ObservationTR,
  UniObservation,
} from './../../models/observation.model';
import { Station } from './../../models/station.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HydrometryService {
  static pickLast(arg0: UniObservation[], arg1: string): any {
    throw new Error('Method not implemented.');
  }
  static delta24h(arg0: UniObservation[], arg1: string): any {
    throw new Error('Method not implemented.');
  }
  static mergeSort(arg0: unknown[]) {
    throw new Error('Method not implemented.');
  }
  private API_BASE_URL_HYDROMETRY = environment.API_BASE_URL_HYDROMETRY;
  private API_BASE_URL_OBSERVATIONS = environment.API_BASE_URL_OBSERVATIONS;
  private CODE_DEPARTEMENT = environment.CODE_DEPARTEMENT;

  constructor() {}

  /**
   * recuperation de station par son id
   *
   * @async
   * @param {string} code_station
   * @returns {Promise<Station | null>}
   */
  async getStationById(code_station: string): Promise<Station | null> {
    const url = `${this.API_BASE_URL_HYDROMETRY}stations/?code_station=${code_station}`;
    try {
      const response = await axios.get<{ data: Station[] }>(url);
      const stations = response.data.data;
      return stations.length > 0 ? stations[0] : null;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la station ${code_station} :`, error);
      return null;
    }
  }

  /**
   * recupère les stations hydrométriques pour le département
   * @async
   *
   * @returns {Promise<Station[]>}
   */
  async getStationsByDepartement(): Promise<Station[]> {
    const url = `${this.API_BASE_URL_HYDROMETRY}stations?code_departement=${this.CODE_DEPARTEMENT}`;
    try {
      const response = await axios.get<{ data: Station[] }>(url);
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des stations :', error);
      return [];
    }
  }

  /**
   * recupère les observation  d'une station
   *
   * @async
   * @param {string} code_station
   * @returns {Promise<ObservationTR[]>}
   */
  async getObservationsByStationTr(
    code_station: string,
    opts?: {
      grandeur?: 'H' | 'Q';
      days?: number; // fenêtre en jours (par défaut 7)
      size?: number; // nombre max de points (par défaut 1000)
      sort?: 'asc' | 'desc'; // tri par date (par défaut desc)
      fields?: string; // champs à retourner
    },
  ): Promise<ObservationTR[]> {
    const today = new Date();
    const last = new Date(today);
    // last.setDate(today.getDate() - (opts?.days ?? 7));

    const date_debut = last.toISOString().split('T')[0];
    const date_fin = today.toISOString().split('T')[0];

    // Hubeau: observations_tr → code_entite + grandeur_hydro
    const params = new URLSearchParams({
      code_entite: code_station, // utilise le code station fourni
      date_debut,
      date_fin,
      size: String(opts?.size ?? 1000),
      sort: String(opts?.sort ?? 'desc'),
    });
    if (opts?.grandeur) params.set('grandeur_hydro', opts.grandeur);
    if (opts?.fields) params.set('fields', opts.fields);

    const url = `${this.API_BASE_URL_OBSERVATIONS}observations_tr?${params.toString()}`;

    try {
      const response = await axios.get<{ data: ObservationTR[] }>(url);
      return response.data.data;
    } catch (error) {
      console.error(`Erreur observations_tr ${code_station}:`, error);
      return [];
    }
  }

  async getObservationsByStationElab(
    code_station: string,
    opts?: {
      grandeur?: string; // ex: HIXM
      days?: number;
      size?: number;
      sort?: 'asc' | 'desc';
      fields?: string;
    },
  ): Promise<ObservationElab[]> {
    const today = new Date();
    const last = new Date(today);
    last.setDate(today.getDate() - (opts?.days ?? 30)); // souvent plus espacées

    const date_debut = last.toISOString().split('T')[0];
    const date_fin = today.toISOString().split('T')[0];

    // Hubeau: obs_elab → code_entite + grandeur_hydro_elab
    const params = new URLSearchParams({
      code_entite: code_station,
      date_debut,
      date_fin,
      size: String(opts?.size ?? 1000),
      sort: String(opts?.sort ?? 'desc'),
    });
    if (opts?.grandeur) params.set('grandeur_hydro_elab', opts.grandeur);
    if (opts?.fields) params.set('fields', opts.fields);

    const url = `${this.API_BASE_URL_OBSERVATIONS}obs_elab?${params.toString()}`;

    try {
      const response = await axios.get<{ data: ObservationElab[] }>(url);
      return response.data.data;
    } catch (error) {
      console.error(`Erreur obs_elab ${code_station}:`, error);
      return [];
    }
  }
}
