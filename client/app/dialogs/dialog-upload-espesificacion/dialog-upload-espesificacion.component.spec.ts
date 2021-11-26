import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUploadEspesificacionComponent } from './dialog-upload-espesificacion.component';

describe('DialogUploadEspesificacionComponent', () => {
  let component: DialogUploadEspesificacionComponent;
  let fixture: ComponentFixture<DialogUploadEspesificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUploadEspesificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUploadEspesificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
