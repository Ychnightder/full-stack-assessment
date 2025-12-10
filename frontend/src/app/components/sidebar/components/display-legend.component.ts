import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/*
  Composant d’affichage d’une légende:
  - Reçoit via @Input un tableau d’items (type, label, description).
  - Chaque item affiche une icône SVG différente selon le type.
  - Mise en page: colonne, cartes flex avec icône + texte.
  - Les SVG inline évitent des requêtes externes mais alourdissent le template.
  - Amélioration possible: externaliser les SVG dans un petit composant ou constantes.
*/
@Component({
  selector: 'app-legend',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="legend-container">
      <!-- Boucle sur les items de légende -->
      <div class="legend-item" *ngFor="let item of StatusStations">
        <div
          class="card-legend"
          [ngClass]="{
            'non-operational-card': item.type === 'non-operational',
            'operational-border': item.type === 'operational',
            'non-operational-border': item.type === 'non-operational',
            'infrastructure-border': item.type === 'infrastructure',
          }"
        >
          <!-- Zone icône -->
          <div class="icon">
            <ng-container [ngSwitch]="item.type">
              <!-- Icône station opérationnelle -->
              <img
                src="/assets/images/stations/pin-operationnal.svg"
                *ngSwitchCase="'operational'"
                alt="icon infrastructure operationnelle"
              />
              <!-- Icône non operationnelle  -->
              <img
                src="/assets/images/stations/pin-n-operationnal.svg"
                *ngSwitchCase="'non-operational'"
                alt="icon infrastructure non operationnelle"
              />
              <!-- Icône infrastructure  -->
              <img
                src="/assets/images/bridges/pin-bridge.svg"
                *ngSwitchCase="'infrastructure'"
                alt="icon infrastructure operationnelle"
              />
            </ng-container>
          </div>

          <!-- Libellé + description -->
          <div class="label-description">
            <div class="label">{{ item.label }}</div>
            <div class="description" *ngIf="item.description">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @import 'variables';
      @import 'reset';
      @import 'mixins';

      .legend-container {
        display: flex;
        flex-direction: column;
        gap: 25px;

        .card-legend {
          display: flex;
          align-items: center;
          padding-left: 10px;
          width: 90%;
          height: 65px;
          border-radius: 6px;
          background: $color-grey;
          font-size: 14px;
          // border: 1px solid transparent; // default
        }

        .non-operational-card {
          height: 70px;
        }

        .operational-border {
          border: 1px solid rgba(168, 218, 220, 0.84); // vert
        }

        .non-operational-border {
          border: 1px solid rgba(230, 57, 70, 0.19); // rouge
        }

        .infrastructure-border {
          border: 1px solid rgba(29, 53, 87, 0.19); // bleu
        }

        .icon {
          width: 40px;
          margin-right: 8px;
          background: transparent;
        }

        .label-description {
          .label {
            font-weight: 500;
          }
          .description {
            font-size: 13px;
            color: $color-greyBlue;
          }
        }
      }
    `,
  ],
})
export class DisplayLegendComponent {
  // Entrée: tableau de statuts pour construire la légende.
  @Input() StatusStations: {
    type: 'operational' | 'non-operational' | 'infrastructure';
    label: string;
    description?: string;
  }[] = [];
}
