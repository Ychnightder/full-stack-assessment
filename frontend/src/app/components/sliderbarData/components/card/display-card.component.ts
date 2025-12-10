import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HydrometryService } from '../../../../services/hydrometry/hydrometry.service';
import {
  ObservationTR,
  ObservationElab,
  UniObservation,
  Grandeur,
  fromTR,
  fromELAB,
  mergeSort,
  pickLast,
  delta24h,
} from '../../../../models/observation.model';

@Component({
  selector: 'app-card',
  // standalone: true,
  imports: [CommonModule],
  templateUrl: './display-card.html',
  styleUrls: ['./display-card.scss'],
})
export class DisplayCardComponent implements OnInit, OnChanges {
  @Input() stationCode: string | null = null;
  loading = signal(true);
  error = signal<string | null>(null);
  uniObs = signal<UniObservation[]>([]);

  // visible si on charge ET qu’aucune donnée n’est encore là
  hasData = computed(() => this.uniObs().length > 0);
  isLoading = computed(() => this.loading() && !this.hasData());

  // Dérivés pour les 4 cartes
  lastLevel = computed(() => pickLast(this.uniObs(), 'H')); // Niveau d’eau (H)
  lastFlow = computed(() => pickLast(this.uniObs(), 'Q')); // Débit (Q)
  levelTrend24h = computed(() => delta24h(this.uniObs(), 'H')); // Tendance m/24h
  flowTrend24h = computed(() => delta24h(this.uniObs(), 'Q')); // Optionnel

  lastUpdate = computed(() => {
    const arr = this.uniObs();
    if (!arr.length) return null;
    return arr[arr.length - 1].date_obs;
  });

  // Date formatée pour la carte "Dernière MAJ"
  formattedLastUpdate = computed(() => {
    const iso = this.lastUpdate();
    if (!iso) return null;
    const d = new Date(iso);
    const now = new Date();

    const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    // calcul "Aujourd’hui/Hier"
    const start = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
    const daysDiff = Math.floor((+start(now) - +start(d)) / 86400000);

    let dayLabel: string;
    if (daysDiff === 0) dayLabel = 'Aujourd’hui';
    else if (daysDiff === 1) dayLabel = 'Hier';
    else {
      const dateStr = d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      dayLabel = `${dateStr}`;
    }

    const full = d.toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' });
    return { time, dayLabel, fullTitle: full };
  });

  constructor(private hydro: HydrometryService) {}

  ngOnInit() {
    if (this.stationCode) this.fetch(this.stationCode);
  }

  ngOnChanges(ch: SimpleChanges) {
    if (ch['stationCode'] && this.stationCode) this.fetch(this.stationCode);
  }

  private async fetch(code: string) {
    this.loading.set(true);
    this.error.set(null);
    try {
      // TR: niveau 'H' et débit 'Q' (on peut faire deux appels ciblés pour réduire la charge)
      const [trH, trQ] = await Promise.all([
        this.hydro.getObservationsByStationTr(code, {
          grandeur: 'H',
          days: 7,
          size: 2000,
          sort: 'desc',
          fields:
            'date_obs,resultat_obs,grandeur_hydro,code_station,libelle_statut,libelle_qualification_obs',
        }),
        this.hydro.getObservationsByStationTr(code, {
          grandeur: 'Q',
          days: 7,
          size: 2000,
          sort: 'desc',
          fields:
            'date_obs,resultat_obs,grandeur_hydro,code_station,libelle_statut,libelle_qualification_obs',
        }),
      ]);

      // ÉLAB (optionnel) ex: HIXM
      const elab = await this.hydro.getObservationsByStationElab(code, {
        grandeur: 'HIXM',
        days: 365,
        size: 2000,
        sort: 'desc',
        fields:
          'date_obs_elab,resultat_obs_elab,grandeur_hydro_elab,code_station,libelle_statut,libelle_qualification',
      });

      const uni = mergeSort([...trH.map(fromTR), ...trQ.map(fromTR), ...elab.map(fromELAB)]).map(
        (o) => ({ ...o, grandeur: (o.grandeur || '').trim().toUpperCase() }),
      );

      this.uniObs.set(uni); // données prêtes
    } catch (e) {
      this.error.set('Erreur de chargement des observations');
      this.uniObs.set([]);
    } finally {
      this.loading.set(false); // stoppe le mode "loading"
    }
  }
}
