import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayLegendComponent } from './display-legend.component';

describe('DisplayLegendComponent', () => {
  let fixture: ComponentFixture<DisplayLegendComponent>;
  let component: DisplayLegendComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayLegendComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayLegendComponent);
    component = fixture.componentInstance;

    component.StatusStations = [
      { type: 'operational', label: 'Opérationnelle' },
      { type: 'non-operational', label: 'Non opérationnelle' },
      { type: 'infrastructure', label: 'Infrastructure' },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders legend items', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.card-legend').length).toBe(3);
  });

  it('shows correct icons', () => {
    const el: HTMLElement = fixture.nativeElement;
    const srcs = Array.from(el.querySelectorAll('.icon img')).map((i) => i.getAttribute('src'));
    expect(srcs).toContain('/assets/images/stations/pin-operationnal.svg');
    expect(srcs).toContain('/assets/images/stations/pin-n-operationnal.svg');
    expect(srcs).toContain('/assets/images/bridges/pin-bridge.svg');
  });
});
