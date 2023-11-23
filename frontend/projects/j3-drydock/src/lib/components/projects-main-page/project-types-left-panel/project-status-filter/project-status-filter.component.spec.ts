import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStatusFilterComponent } from './project-status-filter.component';

describe('ProjectStatusFilterComponent', () => {
  let component: ProjectStatusFilterComponent;
  let fixture: ComponentFixture<ProjectStatusFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectStatusFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectStatusFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
