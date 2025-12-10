import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import 'chart.js/auto';
import { Chart } from 'chart.js';
import { HydrometryService } from '../../../../services/hydrometry/hydrometry.service';
import { ObservationTR } from '../../../../models/observation.model';

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget.html',
  styleUrls: ['./widget.scss'],
})
export class Widget implements OnChanges {
  @Input() stationCode: string | null = null;

  loading = signal(false);
  error = signal<string | null>(null);

  private hChart?: Chart;
  private qChart?: Chart;

  constructor(private hydro: HydrometryService) {}

  async ngOnChanges(ch: SimpleChanges) {
    if (!ch['stationCode']) return;
    const code = this.stationCode;
    if (!code) {
      this.destroyChart();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const fields = 'date_obs,resultat_obs,grandeur_hydro';
      const [trH, trQ] = await Promise.all([
        this.fetchTRWithFallback(code, 'H', fields),
        this.fetchTRWithFallback(code, 'Q', fields),
      ]);

      const seriesH = this.toSeries(trH, 'H');
      const seriesQ = this.toSeries(trQ, 'Q');

      this.renderHChart(seriesH.labels, seriesH.values);
      this.renderQChart(seriesQ.labels, seriesQ.values);
    } catch (e) {
      console.error(e);
      this.error.set('Erreur de chargement des séries');
      this.destroyChart();
    } finally {
      this.loading.set(false);
    }
  }

  // Essaie 7j → 30j → 90j jusqu’à trouver des points
  private async fetchTRWithFallback(
    code: string,
    grandeur: 'H' | 'Q',
    fields: string,
  ): Promise<ObservationTR[]> {
    const windows = [7, 30, 90];
    for (const days of windows) {
      const data = await this.hydro.getObservationsByStationTr(code, {
        grandeur,
        days,
        size: 3000,
        sort: 'asc', // asc pour affichage naturel
        fields,
      });
      if (data?.length) return data;
    }
    return [];
  }

  // Construit labels (3 lettres du jour) et values agrégées par jour (moyenne)
  private toSeries(list: ObservationTR[], grandeur: 'H' | 'Q') {
    const items = [...(list || [])].sort((a, b) => +new Date(a.date_obs) - +new Date(b.date_obs));

    // Bucket par jour (YYYY-MM-DD)
    const buckets = new Map<string, number[]>();
    for (const o of items) {
      const d = new Date(o.date_obs);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      let v = Number(String(o.resultat_obs).replace(',', '.'));
      if (grandeur === 'H' && v > 10) v = v / 100; // cm -> m (heuristique)
      if (!Number.isFinite(v)) continue;
      const arr = buckets.get(key) ?? [];
      arr.push(v);
      buckets.set(key, arr);
    }

    // Derniers 7 jours seulement
    const keys = Array.from(buckets.keys()).sort(); // tri croissant par date
    const last7 = keys.slice(-7);

    const dayLabel = (key: string) => {
      const d = new Date(key);
      // 'lun', 'mar', 'mer', ...
      return d.toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 3);
    };

    const labels = last7.map(dayLabel);
    const values = last7.map((k) => {
      const arr = buckets.get(k)!;
      const avg = arr.reduce((s, x) => s + x, 0) / arr.length;
      return +avg.toFixed(3);
    });

    return { labels, values };
  }

  private renderHChart(labels: string[], valuesH: number[]) {
    const el = document.getElementById('hChart') as HTMLCanvasElement | null;
    if (!el) return;
    this.hChart?.destroy();
    const ctx = el.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 0, el.height);
    grad.addColorStop(0, 'rgba(46,124,246,0.25)');
    grad.addColorStop(1, 'rgba(46,124,246,0.02)');

    // moyenne simple des 7 jours
    const avgH = valuesH.reduce((s, v) => s + v, 0) / (valuesH.length || 1);
    const avgLineH = Array(valuesH.length).fill(+avgH.toFixed(3));

    this.hChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Niveau actuel',
            data: valuesH,
            borderColor: '#2E7CF6',
            backgroundColor: grad,
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 5,
            pointBackgroundColor: '#2E7CF6',
            borderWidth: 3,
          },
          {
            label: 'Moyenne',
            data: avgLineH,
            borderColor: '#2E7CF6',
            borderWidth: 2,
            borderDash: [6, 6],
            pointRadius: 0,
            fill: false,
            tension: 0,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { color: '#304562', boxWidth: 10, usePointStyle: true, pointStyle: 'circle' },
          },
          tooltip: {
            backgroundColor: 'rgba(255,255,255,0.95)',
            titleColor: '#304562',
            bodyColor: '#1f2937',
            borderColor: '#e6eef6',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              title: (items) => items[0]?.label ?? '',
              label: (ctx: any) => {
                const val = ctx.parsed.y;
                return ctx.dataset.label === 'Moyenne'
                  ? ` Moyenne : ${val.toFixed(2)} m`
                  : ` Niveau : ${val.toFixed(2)} m`;
              },
            },
          },
          title: {
            display: true,
            text: "Niveau d'eau (m)",
            color: '#304562',
            font: { weight: 600, size: 13 },
          },
        },
        scales: {
          x: {
            type: 'category',
            grid: { color: 'rgba(0,0,0,0.08)' },
            ticks: { color: '#6b7a90', font: { size: 12 }, maxRotation: 0, autoSkip: false },
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.08)', lineWidth: 1 },
            ticks: {
              color: '#304562',
              font: { size: 12 },
              stepSize: this.computeStep(valuesH, 6),
              callback: (v: number | string) => Number(v).toFixed(2) + ' m',
            },
            suggestedMin: this.padMin(valuesH, 0.1),
            suggestedMax: this.padMax(valuesH, 0.1),
            beginAtZero: false,
          },
        },
        interaction: { mode: 'index', intersect: false },
        animation: { duration: 250 },
      },
    });
  }

  private renderQChart(labels: string[], valuesQ: number[]) {
    const el = document.getElementById('qChart') as HTMLCanvasElement | null;
    if (!el) return;
    this.qChart?.destroy();
    const ctx = el.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 0, el.height);
    grad.addColorStop(0, 'rgba(124,58,237,0.25)');
    grad.addColorStop(1, 'rgba(124,58,237,0.02)');

    const avgQ = valuesQ.reduce((s, v) => s + v, 0) / (valuesQ.length || 1);
    const avgLineQ = Array(valuesQ.length).fill(+avgQ.toFixed(3));

    this.qChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Débit actuel',
            data: valuesQ,
            borderColor: '#1f57ff',
            backgroundColor: grad,
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 5,
            pointBackgroundColor: '#1f57ff',
            borderWidth: 3,
          },
          {
            label: 'Moyenne',
            data: avgLineQ,
            borderColor: '#1f57ff',
            borderWidth: 2,
            borderDash: [6, 6],
            pointRadius: 0,
            fill: false,
            tension: 0,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { color: '#304562', boxWidth: 10, usePointStyle: true },
          },
          tooltip: {
            backgroundColor: 'rgba(255,255,255,0.95)',
            titleColor: '#304562',
            bodyColor: '#1f2937',
            borderColor: '#e6eef6',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              title: (items) => items[0]?.label ?? '',
              label: (ctx: any) => {
                const val = ctx.parsed.y;
                return ctx.dataset.label === 'Moyenne'
                  ? ` Moyenne : ${val.toFixed(2)} m³/s`
                  : ` Débit : ${val.toFixed(2)} m³/s`;
              },
            },
          },
          title: {
            display: true,
            text: 'Débit (m³/s)',
            color: '#304562',
            font: { weight: 600, size: 13 },
          },
        },
        scales: {
          x: {
            type: 'category',
            grid: { color: 'rgba(0,0,0,0.08)' },
            ticks: { color: '#6b7a90', font: { size: 12 }, maxRotation: 0, autoSkip: false },
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.08)', lineWidth: 1 },
            ticks: {
              color: '#304562',
              font: { size: 12 },
              stepSize: this.computeStep(valuesQ, 6),
              callback: (v: number | string) => Number(v).toFixed(2) + ' m³/s',
            },
            suggestedMin: this.padMin(valuesQ, 0.1),
            suggestedMax: this.padMax(valuesQ, 0.1),
            beginAtZero: false,
          },
        },
        interaction: { mode: 'index', intersect: false },
        animation: { duration: 250 },
      },
    });
  }

  // Helpers pour pas et marges
  private padMin(arr: number[], pad = 0.1) {
    const min = Math.min(...arr);
    const range = Math.max(...arr) - min || 1;
    return +(min - range * pad).toFixed(3);
  }
  private padMax(arr: number[], pad = 0.1) {
    const max = Math.max(...arr);
    const range = max - Math.min(...arr) || 1;
    return +(max + range * pad).toFixed(3);
  }
  private computeStep(arr: number[], targetTicks = 7) {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min || 1;
    const raw = range / targetTicks;
    const steps = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50];
    return steps.find((s) => raw <= s) ?? steps[steps.length - 1];
  }

  private destroyChart() {
    this.hChart?.destroy();
    this.qChart?.destroy();
    this.hChart = undefined;
    this.qChart = undefined;
  }
}
