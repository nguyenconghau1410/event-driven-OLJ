import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProblemComponent } from './detail-problem.component';

describe('DetailProblemComponent', () => {
  let component: DetailProblemComponent;
  let fixture: ComponentFixture<DetailProblemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailProblemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
