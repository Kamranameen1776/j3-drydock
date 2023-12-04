import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOrdersComponent } from './job-orders.component';

describe('JobOrdersComponent', () => {
  let component: JobOrdersComponent;
  let fixture: ComponentFixture<JobOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
