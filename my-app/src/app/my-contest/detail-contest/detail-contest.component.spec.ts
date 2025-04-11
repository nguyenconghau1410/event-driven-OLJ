import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailContestComponent } from './detail-contest.component';

describe('DetailContestComponent', () => {
  let component: DetailContestComponent;
  let fixture: ComponentFixture<DetailContestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailContestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailContestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
