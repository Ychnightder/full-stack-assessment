import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayToggleComponent } from './display-toggle.component';

describe('DisplayToggleComponent', () => {
  let fixture: ComponentFixture<DisplayToggleComponent>;
  let component: DisplayToggleComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
