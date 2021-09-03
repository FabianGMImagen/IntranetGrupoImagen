import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolconsumointEditComponent } from './solconsumoint-edit.component';

describe('SolconsumointEditComponent', () => {
  let component: SolconsumointEditComponent;
  let fixture: ComponentFixture<SolconsumointEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolconsumointEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolconsumointEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
