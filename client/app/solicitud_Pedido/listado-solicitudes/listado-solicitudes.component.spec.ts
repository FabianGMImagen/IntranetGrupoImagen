import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListadoSolicitudesComponent } from "./listado-solicitudes.component";

describe('ListadoSolicitudesComponent', () => {
  let component: ListadoSolicitudesComponent;
  let fixture: ComponentFixture<ListadoSolicitudesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoSolicitudesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
