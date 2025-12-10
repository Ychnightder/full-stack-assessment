import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar';
import { Map } from './components/map/map';
import { SliderbarDataComponent } from './components/sliderbarData/sliderbarData';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  imports: [CommonModule, SidebarComponent, Map, SliderbarDataComponent],
  styleUrls: ['./app.scss', '../styles.scss'],
})
export class App {
  selectedStationCode = signal<string | null>(null);
  showOnlyActive = signal(false);
  showSliderbar = signal(true);

  onStationCode(code: string) {
    this.selectedStationCode.set(code);
    this.showSliderbar.set(true); // réaffiche à chaque sélection
  }

  onClosePanel() {
    this.showSliderbar.set(false); // masque le panel
  }
}
