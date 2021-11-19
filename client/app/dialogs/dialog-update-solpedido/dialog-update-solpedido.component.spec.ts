import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUpdateSolpedidoComponent } from './dialog-update-solpedido.component';

describe('DialogUpdateSolpedidoComponent', () => {
  let component: DialogUpdateSolpedidoComponent;
  let fixture: ComponentFixture<DialogUpdateSolpedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUpdateSolpedidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUpdateSolpedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
