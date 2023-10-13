import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardJobsMainComponent } from './standard-jobs-main.component';

describe('StandardJobsComponent', () => {
  let component: StandardJobsMainComponent;
  let fixture: ComponentFixture<StandardJobsMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StandardJobsMainComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardJobsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
