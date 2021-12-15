import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHistorySolpedidoComponent } from './dialog-history-solpedido.component';

describe('DialogHistorySolpedidoComponent', () => {
  let component: DialogHistorySolpedidoComponent;
  let fixture: ComponentFixture<DialogHistorySolpedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogHistorySolpedidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHistorySolpedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
