import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SolicitudComponent } from './solicitud.component';

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
