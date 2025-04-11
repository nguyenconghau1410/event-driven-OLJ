import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemManageComponent } from './problem-manage.component';

describe('ProblemManageComponent', () => {
  let component: ProblemManageComponent;
  let fixture: ComponentFixture<ProblemManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProblemManageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProblemManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
