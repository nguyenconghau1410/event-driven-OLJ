import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyContestComponent } from './my-contest.component';

describe('MyContestComponent', () => {
  let component: MyContestComponent;
  let fixture: ComponentFixture<MyContestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyContestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyContestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
