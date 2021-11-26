import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUpdateSolpedidoProductosComponent } from './dialog-update-solpedido-productos.component';

describe('DialogUpdateSolpedidoProductosComponent', () => {
  let component: DialogUpdateSolpedidoProductosComponent;
  let fixture: ComponentFixture<DialogUpdateSolpedidoProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUpdateSolpedidoProductosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUpdateSolpedidoProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
