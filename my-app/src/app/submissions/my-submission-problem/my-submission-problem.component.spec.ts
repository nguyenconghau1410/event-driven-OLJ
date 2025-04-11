import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySubmissionProblemComponent } from './my-submission-problem.component';

describe('MySubmissionProblemComponent', () => {
  let component: MySubmissionProblemComponent;
  let fixture: ComponentFixture<MySubmissionProblemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySubmissionProblemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MySubmissionProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
