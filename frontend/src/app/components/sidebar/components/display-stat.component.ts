import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HydrometryService } from '../../../services/hydrometry/hydrometry.service';
import { InfrastructureService } from '../../../services/infrasructure/infrastructure.service';

/*
  Composant statistique du sidebar:
  - stats: signal réactif contenant un tableau { label, value } affiché dans une grille.
  - ngOnInit: appelle deux services asynchrones pour agréger les données:
      * hydrometryService.getStationsByDepartement(): liste des stations, comptage en service / hors service.
      * infrastructureService.getBridges(): nombre total des ponts (infrastructures).
  - Mise en forme: grille 2x3, carte centrale élargie pour "Ponts Enregistrés".
 
*/
@Component({
  selector: 'app-sidebar-statistics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-grid">
      <!-- Affichage de chaque statistique -->
      <div
        class="card"
        *ngFor="let stat of stats()"
        [ngClass]="{
          'ponts-card': stat.label === 'Ponts Enregistrés',
          'hors-service-number': stat.label === 'Hors service',
        }"
      >
        <div class="number">{{ stat.value }}</div>
        <div class="label">{{ stat.label }}</div>
      </div>
    </div>
  `,
  styles: [
    `
   @use 'variables' as *;
@use 'mixins' as *;

      .card-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(3, auto);
        place-items: center;
        gap: 10px;
      }

      .card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 7px;
        background: $color-grey;
        width: 85%;
        height: 100%;
        color: $color-lightBlue;
      }

      .number {
        margin-left: 10px;
        font-size: 24px;
        font-weight: 400;
      }

      .label {
        margin-left: 5px;
        font-size: 13px;
        color: $color-greyBlue;
      }

      .ponts-card {
        grid-column: 1 / span 2;
        width: 93%;
        color: $color-darkBlue;
      }

      .hors-service-number {
        color: $color-greyBlue;
      }
    `,
  ],
})
export class DisplayStatComponent implements OnInit {
  // Signal réactif contenant la liste des stats à afficher.
  stats = signal<{ label: string; value: number }[]>([]);

  constructor(
    private hydrometryService: HydrometryService,
    private infrastructureService: InfrastructureService,
  ) {}

  async ngOnInit() {
    // Récupération des stations et comptage des états.
    const stations = await this.hydrometryService.getStationsByDepartement();
    let ONservice = 0;
    let HorsService = 0;
    for (const station of stations) {
      if (station.en_service === true) ONservice++;
      else HorsService++;
    }

    // Récupération du nombre d’infrastructures (ponts).
    const infrastructures = await this.infrastructureService.getBridges();
    const Infrastructure = infrastructures.length;

    // Population des statistiques pour l’affichage.
    this.stats.set([
      { label: 'En service', value: ONservice },
      { label: 'Hors service', value: HorsService },
      { label: 'Ponts Enregistrés', value: Infrastructure },
      { label: 'Stations', value: stations.length },
    ]);
  }
}
