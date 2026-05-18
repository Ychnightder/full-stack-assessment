import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Composant d’affichage d’un toggle visibilité:
// - Standalone, rend une ligne cliquable avec checkbox + icône œil ouvert/fermé selon l’état.
// - checked: signal boolean central; émet via checkedChange pour informer le parent.

@Component({
  selector: 'app-display-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-checkbox" (click)="toggleByClick($event)">
      <input class="checkbox" type="checkbox" [checked]="checked()" (change)="toggle($event)" />

      <ng-container *ngIf="checked(); else eyeClosed">
        <!-- Icône œil ouvert -->
        <svg
          width="21"
          height="18"
          viewBox="0 0 21 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.3377 5.68421L13.3636 8.67789V8.52632C13.3636 7.77254 13.0619 7.04964 12.5249 6.51664C11.9879 5.98365 11.2595 5.68421 10.5 5.68421H10.3377ZM6.23318 6.44211L7.71273 7.91053C7.665 8.10947 7.63636 8.30842 7.63636 8.52632C7.63636 9.28009 7.93807 10.003 8.4751 10.536C9.01214 11.069 9.74052 11.3684 10.5 11.3684C10.71 11.3684 10.92 11.34 11.1205 11.2926L12.6 12.7611C11.9605 13.0737 11.2541 13.2632 10.5 13.2632C9.23419 13.2632 8.02023 12.7641 7.12517 11.8758C6.23011 10.9874 5.72727 9.7826 5.72727 8.52632C5.72727 7.77789 5.91818 7.07684 6.23318 6.44211ZM0.954545 1.20316L3.13091 3.36316L3.56045 3.78947C1.98545 5.02105 0.744545 6.63158 0 8.52632C1.65136 12.6853 5.72727 15.6316 10.5 15.6316C11.9795 15.6316 13.3923 15.3474 14.6809 14.8358L15.0914 15.2337L17.8786 18L19.0909 16.7968L2.16682 0M10.5 3.78947C11.7658 3.78947 12.9798 4.28853 13.8748 5.17686C14.7699 6.06519 15.2727 7.27003 15.2727 8.52632C15.2727 9.13263 15.1486 9.72 14.9291 10.2505L17.7259 13.0263C19.1577 11.8421 20.3032 10.2884 21 8.52632C19.3486 4.36737 15.2727 1.42105 10.5 1.42105C9.16364 1.42105 7.88455 1.65789 6.68182 2.08421L8.75318 4.12105C9.29727 3.91263 9.87955 3.78947 10.5 3.78947Z"
            fill="#62748E"
          />
        </svg>
      </ng-container>
      <ng-template #eyeClosed>
        <!-- Icône œil fermé -->
        <svg
          width="21"
          height="14"
          viewBox="0 0 21 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5 4.2C11.2595 4.2 11.9879 4.495 12.5249 5.0201C13.0619 5.5452 13.3636 6.25739 13.3636 7C13.3636 7.74261 13.0619 8.4548 12.5249 8.9799C11.9879 9.505 11.2595 9.8 10.5 9.8C9.74052 9.8 9.01214 9.505 8.4751 8.9799C7.93807 8.4548 7.63636 7.74261 7.63636 7C7.63636 6.25739 7.93807 5.5452 8.4751 5.0201C9.01214 4.495 9.74052 4.2 10.5 4.2ZM10.5 0C15.2727 0 19.3486 2.90267 21 7C19.3486 11.0973 15.2727 14 10.5 14C5.72727 14 1.65136 11.0973 0 7C1.65136 2.90267 5.72727 0 10.5 0ZM2.08091 7C2.85242 8.54029 4.05043 9.83803 5.53873 10.7457C7.02703 11.6534 8.74592 12.1346 10.5 12.1346C12.2541 12.1346 13.973 11.6534 15.4613 10.7457C16.9496 9.83803 18.1476 8.54029 18.9191 7C18.1476 5.45971 16.9496 4.16197 15.4613 3.2543C13.973 2.34662 12.2541 1.86544 10.5 1.86544C8.74592 1.86544 7.02703 2.34662 5.53873 3.2543C4.05043 4.16197 2.85242 5.45971 2.08091 7Z"
            fill="#62748E"
          />
        </svg>
      </ng-template>

      <p class="label">{{ label }}</p>
    </div>
  `,

  styles: [
    `
      @use 'variables' as *;
      @use 'mixins' as *;
      .bg-checkbox {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        background: $color-red; /* Redondant: sera écrasé juste après */
        width: 75%;
        height: 50px;
        border-radius: 6px;
        background: $color-grey; /* Couleur finale utilisée */
        font-size: 14px;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -moz-user-select: none;
        .checkbox {
          margin-left: 14px;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }
        .label {
          max-width: 70%;
          white-space: wrap;
          display: inline-block;
          font-weight: 500;
          cursor: pointer;
        }
      }
    `,
  ],
})
export class DisplayToggleComponent {
  @Input() label: string = '';
  @Output() checkedChange = new EventEmitter<boolean>();
  checked = signal(false); // état interne

  // Synchronise l’état sur changement direct du checkbox.
  toggle(event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this.checked.set(value);
    this.checkedChange.emit(value);
  }

  // Permet de cliquer partout sur la carte pour inverser l’état (hors input).
  toggleByClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'input') return;
    const value = !this.checked();
    this.checked.set(value);
    this.checkedChange.emit(value);
  }
}
