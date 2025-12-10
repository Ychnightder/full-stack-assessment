import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  signal,
  Output,
  EventEmitter,
} from '@angular/core';
import * as L from 'leaflet';
import { Station } from '../../models/station.models';
import { HydrometryService } from '../../services/hydrometry/hydrometry.service';
import { InfrastructureService } from '../../services/infrasructure/infrastructure.service';
import { Infrastructure } from '../../models/infrastructure.model';
import { extractCoordinates } from '../../helpers/extractCoordinates';
import { environment } from '../../../environments/environment.prod';
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.html',
  styleUrls: ['./map.scss', '../../../styles.scss'],
})
export class Map implements OnInit, OnChanges {
  
  stations = signal<Station[]>([]);
  filteredStations = signal<Station[]>([]);
  infrastructures = signal<Infrastructure[]>([]);
  selectedStation = signal<Station | null>(null);

  private map: any;
  private stationLayer = L.layerGroup();
  private infraLayer = L.layerGroup();

  @Input() showOnlyActive: boolean = false;
  @Output() stationSelected = new EventEmitter<Station | string>();
  @Output() stationCodeSelected = new EventEmitter<string>();

  private svgOperational = `
    <img
                  style="width: 40px; height:40px; "  
                 src="/assets/images/stations/pin-operationnal.svg"
                 alt="icon infrastructure operationnelle"
               />
   `;
  private svgNonOperational = `
             <img
               style="width: 40px; height:40px; "  

                 src="/assets/images/stations/pin-n-operationnal.svg"
                 alt="icon infrastructure non operationnelle"
               />
            `;
  private svgBridge = `
               <img
                  style="width: 40px; height:40px; "
                 src="/assets/images/bridges/pin-bridge.svg"
                 alt="icon infrastructure operationnelle"
               />
  `;

  constructor(
    private hydrometryService: HydrometryService,
    private infrastructureService: InfrastructureService
  ) {}

  async ngOnChanges(ch: SimpleChanges) {
    if (ch['showOnlyActive']) this.renderStations();
  }

  async ngOnInit() {
    const data = await this.hydrometryService.getStationsByDepartement();
    this.stations.set(data);
    this.filteredStations.set(data);
    const bridges = await this.infrastructureService.getBridges();
    this.infrastructures.set(bridges);
    this.configMap();
  }

  configMap() {
    this.map = L.map('map', {
      minZoom: environment.MIN_ZOOM,
      worldCopyJump: true,
    }).setView([environment.LATITUDE_DEFAULT, environment.LONGITUDE_DEFAULT], 7);

    const alpesMaritimesBounds = L.latLngBounds([
      [43.3, 6.6], // Coin sud-ouest
      [44.4, 7.8], // Coin nord-est
    ]);
    //  Restreindre la carte à ces limites
    this.map.setMaxBounds(alpesMaritimesBounds);
    this.map.setMaxBoundsViscosity?.(0.9);
    this.map.setMinZoom(environment.MIN_ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    this.stationLayer.addTo(this.map);
    this.infraLayer.addTo(this.map);

    // Option: centrer automatiquement sur les données
    const dataBounds = this.getStationsBounds();
    if (dataBounds) this.map.fitBounds(dataBounds, { padding: [30, 30], maxZoom: environment.MAX_ZOOM });

    this.renderStations();
    this.renderInfrastructures();
  }

  /**
   *
   */
  private getStationsBounds(): L.LatLngBounds | null {
    const pts: L.LatLngExpression[] = [];
    for (const s of this.stations()) {
      const lat = Number((s as any).latitude_station ?? (s as any).latitude);
      const lon = Number((s as any).longitude_station ?? (s as any).longitude);
      if (Number.isFinite(lat) && Number.isFinite(lon)) pts.push([lat, lon]);
    }
    return pts.length ? L.latLngBounds(pts as any) : null;
  }

  /**
   * renderStations
   * Met à jour la couche des stations sur la carte en fonction de la liste actuelle.
   * Gère la création des marqueurs et leurs icônes/événements.
   */
  private renderStations() {
    if (!this.map) return;
    this.stationLayer.clearLayers();
    const source = this.stations();
    const list = this.showOnlyActive ? source.filter((s) => s.en_service) : source;

    for (const s of list) {
      const lat = Number((s as any).latitude_station ?? (s as any).latitude);
      const lon = Number((s as any).longitude_station ?? (s as any).longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

      const icon = s.en_service
        ? this.divIcon(this.svgOperational, 'operational')
        : this.divIcon(this.svgNonOperational, 'non-operational');

      L.marker([lat, lon], { icon })
        .addTo(this.stationLayer)
        // .bindTooltip(s.libelle_station || s.code_station)
        .on('click', () => this.stationCodeSelected.emit(s.code_station));
    }
  }

  private renderInfrastructures() {
    if (!this.map) return;
    this.infraLayer.clearLayers();

    for (const b of this.infrastructures()) {
      const coords = extractCoordinates(b.location as any);
      if (!coords) continue;

      const [lonStr, latStr] = coords.split(/\s+/);
      const lat = Number(latStr),
        lon = Number(lonStr);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

      const icon = this.divIcon(this.svgBridge, 'bridge');
      L.marker([lat, lon], { icon })
        .addTo(this.infraLayer)
        .bindTooltip((b as any).name || 'Infrastructure');
    }
  }

  private divIcon(html: string, extraClass: string) {
    return L.divIcon({
      html,
      className: `custom-marker ${extraClass}`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  }
}
