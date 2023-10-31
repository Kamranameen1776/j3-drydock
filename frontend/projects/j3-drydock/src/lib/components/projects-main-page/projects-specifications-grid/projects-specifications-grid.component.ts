import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectsSpecificationGridService } from './ProjectsSpecificationGridService';
import { eGridRowActions, FormModel, GridAction, GridComponent, IJbDialog } from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ProjectsService } from '../../../services/ProjectsService';
import { DeleteProjectDto, ProjectCreate } from '../../../models/interfaces/projects';
import { Router } from '@angular/router';
import { IProjectsForMainPageGridDto } from './dtos/IProjectsForMainPageGridDto';
import { getSmallPopup } from '../../../models/constants/popup';

@Component({
  selector: 'jb-projects-specifications-grid',
  templateUrl: './projects-specifications-grid.component.html',
  styleUrls: ['./projects-specifications-grid.component.scss'],
  providers: [ProjectsSpecificationGridService]
})
export class ProjectsSpecificationsGridComponent implements OnInit {
  @ViewChild('projectsGrid')
  projectsGrid: GridComponent;

  public gridInputs: GridInputsWithRequest;

  public createNewDialogVisible = false;

  public deleteDialogVisible = false;

  createProjectDialog: IJbDialog = { ...getSmallPopup(), dialogHeader: 'Create Project' };
  
  deleteProjectDialog: IJbDialog = { ...getSmallPopup(), dialogHeader: 'Delete Project' };

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
      this.deleteProjectFormGroup.value.Project = project;
      this.showDeleteDialog();
    } else if (type === eGridRowActions.Edit) {
      if (!project) {
        throw new Error('Project is null');
      }

      // TODO: re-check navigation params
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
        this.projectsGrid.fetchMatrixData();
      });
    } else {
      this.createProjectFormGroup.markAllAsTouched();
    }
  }

  public deleteProject() {
    this.deleteProjectButtonDisabled$.next(true);
    if (this.deleteProjectFormGroup.valid) {
      const data: DeleteProjectDto = {
        ProjectId: this.deleteProjectFormGroup.value.Project.ProjectId
      };

      this.projectsService.deleteProject(data).subscribe(() => {
        this.deleteProjectButtonDisabled$.next(false);
        this.showDeleteDialog(false);
        this.projectsGrid.fetchMatrixData();
      });
    } else {
      this.deleteProjectFormGroup.markAllAsTouched();
    }
  }
}
