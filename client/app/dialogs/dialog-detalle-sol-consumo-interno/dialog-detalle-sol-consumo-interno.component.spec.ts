import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetalleSolConsumoInternoComponent } from './dialog-detalle-sol-consumo-interno.component';

describe('DialogDetalleSolConsumoInternoComponent', () => {
  let component: DialogDetalleSolConsumoInternoComponent;
  let fixture: ComponentFixture<DialogDetalleSolConsumoInternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetalleSolConsumoInternoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetalleSolConsumoInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
