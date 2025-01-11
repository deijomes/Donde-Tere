import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasTotalesComponent } from './ventas-totales.component';

describe('VentasTotalesComponent', () => {
  let component: VentasTotalesComponent;
  let fixture: ComponentFixture<VentasTotalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasTotalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasTotalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
