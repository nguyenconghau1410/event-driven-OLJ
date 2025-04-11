import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProblemManageComponent } from './detail-problem-manage.component';

describe('DetailProblemManageComponent', () => {
  let component: DetailProblemManageComponent;
  let fixture: ComponentFixture<DetailProblemManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailProblemManageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailProblemManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
