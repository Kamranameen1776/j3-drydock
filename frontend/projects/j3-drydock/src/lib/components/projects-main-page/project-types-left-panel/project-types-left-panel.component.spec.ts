import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTypesLeftPanelComponent } from './project-types-left-panel.component';

describe('ProjectTypesLeftPanelComponent', () => {
  let component: ProjectTypesLeftPanelComponent;
  let fixture: ComponentFixture<ProjectTypesLeftPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectTypesLeftPanelComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTypesLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
