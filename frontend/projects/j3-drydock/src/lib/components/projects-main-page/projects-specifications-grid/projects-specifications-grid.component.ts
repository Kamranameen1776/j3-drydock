import { Component, OnInit } from '@angular/core';
import { ProjectsSpecificationGridService } from './ProjectsSpecificationGridService';
import { eGridRowActions, FormModel, GridAction, IJbDialog } from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ProjectsService } from '../../../services/ProjectsService';
import { ProjectCreate, ProjectEdit } from '../../../models/interfaces/projects';
import { Router } from '@angular/router';
import { IProjectsForMainPageGridDto } from './dtos/IProjectsForMainPageGridDto';

@Component({
  selector: 'jb-projects-specifications-grid',
  templateUrl: './projects-specifications-grid.component.html',
  styleUrls: ['./projects-specifications-grid.component.scss'],
  providers: [ProjectsSpecificationGridService]
})
export class ProjectsSpecificationsGridComponent implements OnInit {
  public gridInputs: GridInputsWithRequest;

  public createNewDialogVisible = false;

  public deleteDialogVisible = false;

  createProjectDialog: IJbDialog = {
    dialogHeader: 'Create Project',
    closableIcon: true,
    dialogWidth: 600,
    resizableDialog: true,
    blockScroll: false,
    focusOnShow: false
  };

  deleteProjectDialog: IJbDialog = {
    dialogHeader: 'Delete Project',
    closableIcon: true,
    dialogWidth: 600,
    resizableDialog: true,
    blockScroll: false,
    focusOnShow: false
  };

  createProjectForm: FormModel;

  deleteProjectForm: FormModel;

  createProjectFormGroup: FormGroup;

  deleteProjectFormGroup: FormGroup;

  saveNewProjectButtonDisabled$ = new BehaviorSubject(false);

  saveProjectButtonDisabled$ = new BehaviorSubject(false);

  deleteProjectButtonDisabled$ = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private projectsGridService: ProjectsSpecificationGridService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.gridInputs = this.projectsGridService.getGridInputs();
    this.createProjectForm = this.projectsGridService.getCreateProjectForm();
    this.deleteProjectForm = this.projectsGridService.getDeleteProjectForm();
  }

  public onGridAction({ type }: GridAction<string, string>, project: IProjectsForMainPageGridDto): void {
    if (type === eGridRowActions.Delete) {
      this.showDeleteDialog();
    } else if (type === eGridRowActions.Edit) {
      if (!project) {
        throw new Error('Project is null');
      }

      this.router.navigate(['project-monitoring', project.ProjectId]);
    } else if (type === this.gridInputs.gridButton.label) {
      this.showCreateNewDialog();
    }
  }

  private showCreateNewDialog(value = true) {
    this.createNewDialogVisible = value;
  }

  private showDeleteDialog(value = true) {
    this.deleteDialogVisible = value;
  }

  public initCreateNewProjectFormGroup(action: FormGroup): void {
    this.createProjectFormGroup = action;
    this.createProjectFormGroup.valueChanges.subscribe(() => {
      if (this.createProjectFormGroup.valid) {
        this.saveNewProjectButtonDisabled$.next(false);
      } else {
        this.saveNewProjectButtonDisabled$.next(true);
      }
    });
  }

  public initDeleteProjectFormGroup(action: FormGroup): void {
    this.deleteProjectFormGroup = action;
    this.deleteProjectFormGroup.valueChanges.subscribe(() => {
      if (this.deleteProjectFormGroup.valid) {
        this.deleteProjectButtonDisabled$.next(false);
      } else {
        this.deleteProjectButtonDisabled$.next(true);
      }
    });
  }

  public saveNewProject() {
    this.saveNewProjectButtonDisabled$.next(true);
    if (this.createProjectFormGroup.valid) {
      const values: ProjectCreate = this.createProjectFormGroup.value[this.projectsGridService.createProjectFormId];
      values.EndDate = new Date(values.EndDate);
      values.StartDate = new Date(values.StartDate);

      this.projectsService.createProject(values).subscribe(() => {
        this.saveNewProjectButtonDisabled$.next(false);
        this.showCreateNewDialog(false);
      });
    } else {
      this.createProjectFormGroup.markAllAsTouched();
    }
  }

  public deleteProject() {
    this.deleteProjectButtonDisabled$.next(true);
    if (this.deleteProjectFormGroup.valid) {
      const values: ProjectEdit = this.deleteProjectFormGroup.value[this.projectsGridService.deleteProjectFormId];

      this.projectsService.deleteProject(values).subscribe(() => {
        this.deleteProjectButtonDisabled$.next(false);
        this.showDeleteDialog(false);
      });
    } else {
      this.deleteProjectFormGroup.markAllAsTouched();
    }
  }
}
