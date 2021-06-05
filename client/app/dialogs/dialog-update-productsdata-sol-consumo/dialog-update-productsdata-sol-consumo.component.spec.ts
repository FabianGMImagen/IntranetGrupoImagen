import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUpdateProductsdataSolConsumoComponent } from './dialog-update-productsdata-sol-consumo.component';

describe('DialogUpdateProductsdataSolConsumoComponent', () => {
  let component: DialogUpdateProductsdataSolConsumoComponent;
  let fixture: ComponentFixture<DialogUpdateProductsdataSolConsumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUpdateProductsdataSolConsumoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUpdateProductsdataSolConsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
