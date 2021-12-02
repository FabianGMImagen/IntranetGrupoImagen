import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SolicitudesRegistradasComponent } from './solicitudes-registradas.component';

describe('SolicitudesRegistradasComponent', () => {
  let component: SolicitudesRegistradasComponent;
  let fixture: ComponentFixture<SolicitudesRegistradasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudesRegistradasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesRegistradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
