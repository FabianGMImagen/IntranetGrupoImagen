import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAdvertenciaUpdateSolpedidoComponent } from './dialog-advertencia-update-solpedido.component';

describe('DialogAdvertenciaUpdateSolpedidoComponent', () => {
  let component: DialogAdvertenciaUpdateSolpedidoComponent;
  let fixture: ComponentFixture<DialogAdvertenciaUpdateSolpedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAdvertenciaUpdateSolpedidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAdvertenciaUpdateSolpedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
