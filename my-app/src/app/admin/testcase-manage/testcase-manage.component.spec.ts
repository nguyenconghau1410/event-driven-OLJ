import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestcaseManageComponent } from './testcase-manage.component';

describe('TestcaseManageComponent', () => {
  let component: TestcaseManageComponent;
  let fixture: ComponentFixture<TestcaseManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestcaseManageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestcaseManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
