import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailContestCreatorComponent } from './detail-contest-creator.component';

describe('DetailContestCreatorComponent', () => {
  let component: DetailContestCreatorComponent;
  let fixture: ComponentFixture<DetailContestCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailContestCreatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailContestCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
