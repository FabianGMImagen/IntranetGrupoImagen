import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthcatComponent } from './authcat.component';

describe('AuthcatComponent', () => {
  let component: AuthcatComponent;
  let fixture: ComponentFixture<AuthcatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthcatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthcatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
