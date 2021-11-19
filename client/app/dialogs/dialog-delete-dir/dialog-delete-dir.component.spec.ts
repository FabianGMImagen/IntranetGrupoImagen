import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteDirComponent } from './dialog-delete-dir.component';

describe('DialogDeleteDirComponent', () => {
  let component: DialogDeleteDirComponent;
  let fixture: ComponentFixture<DialogDeleteDirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDeleteDirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteDirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
