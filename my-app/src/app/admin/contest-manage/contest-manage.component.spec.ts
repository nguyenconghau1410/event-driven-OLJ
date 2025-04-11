import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestManageComponent } from './contest-manage.component';

describe('ContestManageComponent', () => {
  let component: ContestManageComponent;
  let fixture: ComponentFixture<ContestManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContestManageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContestManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
