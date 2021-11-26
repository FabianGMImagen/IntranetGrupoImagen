import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SolicitudComprasComponent } from './solicitud-compras.component';

describe('SolicitudComprasComponent', () => {
  let component: SolicitudComprasComponent;
  let fixture: ComponentFixture<SolicitudComprasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
