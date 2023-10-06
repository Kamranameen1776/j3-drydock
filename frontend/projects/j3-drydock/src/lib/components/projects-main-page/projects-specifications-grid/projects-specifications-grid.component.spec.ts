import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsSpecificationsGridComponent } from './projects-specifications-grid.component';

describe('ProjectsSpecificationsGridComponent', () => {
  let component: ProjectsSpecificationsGridComponent;
  let fixture: ComponentFixture<ProjectsSpecificationsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsSpecificationsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsSpecificationsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
