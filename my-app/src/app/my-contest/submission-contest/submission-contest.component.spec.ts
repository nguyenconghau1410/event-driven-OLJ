import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionContestComponent } from './submission-contest.component';

describe('SubmissionContestComponent', () => {
  let component: SubmissionContestComponent;
  let fixture: ComponentFixture<SubmissionContestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionContestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubmissionContestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
