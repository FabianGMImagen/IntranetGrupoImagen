import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DirauthComponent } from './dirauth.component';

describe('DirauthComponent', () => {
  let component: DirauthComponent;
  let fixture: ComponentFixture<DirauthComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DirauthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
