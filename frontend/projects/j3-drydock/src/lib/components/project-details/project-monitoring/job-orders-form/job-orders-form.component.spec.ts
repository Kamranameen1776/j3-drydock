import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrdersFormComponent } from './job-orders-form.component';

describe('JobOrdersFormComponent', () => {
  let component: JobOrdersFormComponent;
  let fixture: ComponentFixture<JobOrdersFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JobOrdersFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobOrdersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
