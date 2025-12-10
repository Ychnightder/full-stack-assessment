import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import {
  Infrastructure,
  InfrastructureCreate,
  InfrastructureLL,
  InfrastructureUpdate,
} from '../../models/infrastructure.model';
@Injectable({
  providedIn: 'root',
})
export class InfrastructureService {
  //url de l'api
  private apiUrl = environment.API_BASE_URL_BACKEND;
  private apiUrlReference = environment.API_BASE_URL_BACKEND_REFERENCE;
  constructor() {}

  async getBridges() {
    try {
      const response = await axios.get(this.apiUrl);
      return response.data; // retourne les données du backend
    } catch (error) {
      console.error('Erreur lors de la récupération des ponts :', error);
      return []; // retourne un tableau vide si erreur
    }
  }

  async createBridge(data: InfrastructureCreate) {
    try {
      const response = await axios.post(`${this.apiUrlReference}`, data, {
        headers: {
          'Content-Type': 'application/json', // utile si le backend attend du JSON
        },
      });
      return response.data; // retourne les données du backend
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Erreur Axios lors de la création du pont :',
          error.response?.data || error.message,
        );
      } else {
        console.error('Erreur inconnue lors de la création du pont :', error);
      }
      return null; // retourne null si erreur
    }
  }

  async deleteBridge(bridge_id: string) {
    try {
      const response = await axios.delete(`${this.apiUrlReference}${bridge_id}/`);
      return response.data; // retourne les données du backend
    } catch (error) {
      console.error('Erreur lors de la suppression du pont :', error);
      return null; // retourne null si erreur
    }
  }

  async updateBridge(bridge_id: string, data: InfrastructureUpdate | InfrastructureLL) {
    try {
      const response = await axios.put(`${this.apiUrlReference}${bridge_id}/`, data);
      return response.data; // retourne les données du backend
    } catch (error) {
      console.error('Erreur lors de la mise à jour du pont :', error);
      return null; // retourne null si erreur
    }
  }

  async getSingleBridge(bridge_id: string) {
    try {
      const response = await axios.get(`${this.apiUrlReference}${bridge_id}/`);
      return response.data; // retourne les données du backend
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du pont :', error);
      return null; // retourne null si erreur
    }
  }
}
