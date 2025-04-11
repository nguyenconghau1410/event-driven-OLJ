import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRatingComponent } from './detail-rating.component';

describe('DetailRatingComponent', () => {
  let component: DetailRatingComponent;
  let fixture: ComponentFixture<DetailRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailRatingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
