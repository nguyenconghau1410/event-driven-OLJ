import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryContestComponent } from './history-contest.component';

describe('HistoryContestComponent', () => {
  let component: HistoryContestComponent;
  let fixture: ComponentFixture<HistoryContestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryContestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryContestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
