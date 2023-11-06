import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsComponent } from './project-details.component';
import { SpecificationGridService } from '../../services/specifications/specification.service';
import { SpecificationTopDetailsService } from '../../services/specifications/specification-top-details.service';

describe('ProjectDetailsComponent', () => {
  let component: ProjectDetailsComponent;
  let fixture: ComponentFixture<ProjectDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectDetailsComponent],
      providers: [SpecificationGridService, SpecificationTopDetailsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
