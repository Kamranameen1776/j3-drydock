import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedPmsJobsAndFindingsComponent } from './linked-pms-jobs-and-findings.component';

describe('PmsJobsComponent', () => {
  let component: LinkedPmsJobsAndFindingsComponent;
  let fixture: ComponentFixture<LinkedPmsJobsAndFindingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LinkedPmsJobsAndFindingsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedPmsJobsAndFindingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
