import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmsJobsComponent } from './pms-jobs.component';

describe('PmsJobsComponent', () => {
  let component: PmsJobsComponent;
  let fixture: ComponentFixture<PmsJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmsJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmsJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
