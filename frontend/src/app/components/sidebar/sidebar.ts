import { Component, signal, Output, EventEmitter, Input } from '@angular/core';
import { Station } from '../../models/station.models';
import { DisplayToggleComponent } from './components/display-toggle.component';
import { DisplayLegendComponent } from './components/display-legend.component';
import { DisplayStatComponent } from './components/display-stat.component';
import { BridgesModalComponent } from '../BridgesModal/BridgesModalComponent';

@Component({
  selector: 'app-sidebar',
  imports: [
    DisplayToggleComponent,
    DisplayLegendComponent,
    DisplayStatComponent,
    BridgesModalComponent,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  // Définir les types de statuts des stations
  StatusStations: {
    type: 'operational' | 'non-operational' | 'infrastructure';
    label: string;
    description?: string;
  }[] = [
    { type: 'operational', label: 'Station Opérationnelle', description: 'Données API' },
    { type: 'non-operational', label: 'Station Non-opérationnelle', description: 'Hors service' },
    { type: 'infrastructure', label: 'Infrastructure', description: 'Ponts' },
  ];

  @Output() checkedChange = new EventEmitter<boolean>();
  onToggleChanged(v: boolean) {
    this.checkedChange.emit(v);
  }

  @Output() WithoutData = new EventEmitter<boolean>();
  checkedNoDataChange(v: boolean) {
    this.checkedChange.emit(v);
  }
}
