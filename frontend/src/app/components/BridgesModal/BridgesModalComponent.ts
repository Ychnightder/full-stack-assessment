import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfrastructureService } from '../../services/infrasructure/infrastructure.service';

import { Infrastructure, InfrastructureLL } from '../../models/infrastructure.model';
import { extractCoordinates } from '../../helpers/extractCoordinates';
import { formatCoordinates } from '../../helpers/formatCoordinates';

@Component({
  selector: 'app-bridges-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './BridgesModal.html',
  styleUrls: ['./BridgesModal.scss'],
})
export class BridgesModalComponent implements OnInit {
  isOpen = signal(false);
  bridges = signal<Infrastructure[]>([]);

  constructor(private infrastructureService: InfrastructureService) {}

  ngOnInit() {
    this.loadBridges();
  }

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  async loadBridges() {
    const list = await this.infrastructureService.getBridges();
    this.bridges.set(list);
  }

  formVisible: boolean = false;
  formAdd: boolean = true;
  formModel: InfrastructureLL = {
    name: '',
    Latitude: '',
    Longitude: '',
  };

  /* ---------- form controls ---------- */

  openAddForm() {
    this.formVisible = true;
    this.formAdd = true;
    this.formModel = {
      bridge_id: '',
      name: '',
      Latitude: '',
      Longitude: '',
    };
  }
  openEditForm(current: Infrastructure) {
    this.formVisible = true;
    this.formAdd = false;
    this.formModel = {
      bridge_id: current.bridge_id,
      name: current.name,
      Latitude: extractCoordinates(current.location).split(' ')[1],
      Longitude: extractCoordinates(current.location).split(' ')[0],
    };
  }

  extractCoordinates(point: string): string {
    return extractCoordinates(point);
  }

  /* ---------- submit ---------- */
  submitForm() {
    if (this.formAdd) {
      this.addBridge();
    } else {
      this.updateBridge();
    }
  }
  closeForm() {
    this.formVisible = false;
    this.formAdd = true;
    this.formModel = {
      bridge_id: '',
      name: '',
      Latitude: '',
      Longitude: '',
    };
  }
  /* ---------- CRUD actions ---------- */
  private async addBridge() {
    let idRandom = 'B' + Math.random().toString(36).substring(2, 9);
    for (let bridge of this.bridges()) {
      if (bridge.bridge_id === idRandom) {
        idRandom = 'B' + Math.random().toString(36).substring(2, 9);
      }
    }

    const data = {
      bridge_id: idRandom,
      name: this.formModel.name,
      location: formatCoordinates({
        latitude: this.formModel.Latitude,
        longitude: this.formModel.Longitude,
      }),
    };

    const result = await this.infrastructureService.createBridge(data);
    if (result) {
      this.loadBridges();
      this.closeForm();
    }
  }

  private async updateBridge() {
    if (!this.formModel) return;

    const data = {
      bridge_id: this.formModel.bridge_id,
      name: this.formModel.name,
      location: formatCoordinates({
        latitude: this.formModel.Latitude,
        longitude: this.formModel.Longitude,
      }),
    };
    const result = await this.infrastructureService.updateBridge(this.formModel.bridge_id!, data);
    if (result) {
      this.loadBridges();
      this.closeForm();
    }
  }

  async deleteBridge(bridge: Infrastructure) {
    const result = await this.infrastructureService.deleteBridge(bridge.bridge_id);
    if (result !== null) {
      this.loadBridges();
    }
  }
}


