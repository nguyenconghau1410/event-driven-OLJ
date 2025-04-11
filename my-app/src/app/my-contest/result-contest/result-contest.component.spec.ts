import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultContestComponent } from './result-contest.component';

describe('ResultContestComponent', () => {
  let component: ResultContestComponent;
  let fixture: ComponentFixture<ResultContestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultContestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultContestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
