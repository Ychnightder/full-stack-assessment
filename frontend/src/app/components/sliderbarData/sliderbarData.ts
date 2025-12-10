import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayCardComponent } from './components/card/display-card.component';
import { HydrometryService } from '../../services/hydrometry/hydrometry.service';
import { Station } from '../../models/station.models';
import { Widget } from './components/widget/widget';

@Component({
  selector: 'app-sliderbar-data',
  templateUrl: 'sliderbarData.html',
  imports: [CommonModule, DisplayCardComponent, Widget],
  styleUrls: ['sliderbarData.scss'],
})
export class SliderbarDataComponent implements OnInit {
  @Input() stationCode: string | null = null;
  @Output() close = new EventEmitter<void>(); // nouvel événement
  stationCurrent = signal<Station | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private hydro: HydrometryService) {}

  async ngOnChanges(ch: SimpleChanges) {
    if (!ch['stationCode']) return;
    const code = this.stationCode;
    if (!code) {
      this.stationCurrent.set(null);
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      const st = await this.hydro.getStationById(code);
      this.stationCurrent.set(st as Station);
    } catch (e: any) {
      this.error.set('Erreur de chargement');
      this.stationCurrent.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  clearStation() {
    // ne modifie pas l'@Input ici
    this.stationCurrent.set(null);
    this.close.emit(); // informe App de fermer
  }

  ngOnInit() {}
}
