import { ComponentFixture, TestBed } from '@angular/core/testing';


import { AccountSolConsumoListComponent } from './account-sol-consumo-list.component';

describe('AccountSolConsumoListComponent', () => {
  let component: AccountSolConsumoListComponent;
  let fixture: ComponentFixture<AccountSolConsumoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountSolConsumoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSolConsumoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
