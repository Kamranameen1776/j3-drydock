import { Component, OnInit } from '@angular/core';
import { ProjectsSpecificationGridService } from './ProjectsSpecificationGridService';
import { eGridRowActions, FormModel, GridAction, IJbDialog } from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ProjectsService } from '../../../services/ProjectsService';
import { ProjectCreate, ProjectEdit } from '../../../models/interfaces/projects';

@Component({
  selector: 'jb-projects-specifications-grid',
  templateUrl: './projects-specifications-grid.component.html',
  styleUrls: ['./projects-specifications-grid.component.scss'],
  providers: [ProjectsSpecificationGridService]
})
export class ProjectsSpecificationsGridComponent implements OnInit {
  public gridInputs: GridInputsWithRequest;

  public createNewDialogVisible = false;

  public editDialogVisible = false;

  createProjectDialog: IJbDialog = {
    dialogHeader: 'Create Project',
    closableIcon: true,
    dialogWidth: 600,
    resizableDialog: true,
    blockScroll: false,
    focusOnShow: false
  };

  editProjectDialog: IJbDialog = {
    dialogHeader: 'Edit Project',
    closableIcon: true,
    dialogWidth: 600,
    resizableDialog: true,
    blockScroll: false,
    focusOnShow: false
  };

  createProjectForm: FormModel;

  editProjectForm: FormModel;

  createProjectFormGroup: FormGroup;

  editProjectFormGroup: FormGroup;

  saveNewProjectButtonDisabled$ = new BehaviorSubject(false);

  saveProjectButtonDisabled$ = new BehaviorSubject(false);

  constructor(
    private projectsGridService: ProjectsSpecificationGridService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.gridInputs = this.projectsGridService.getGridInputs();
    this.createProjectForm = this.projectsGridService.getCreateProjectForm();
    this.editProjectForm = this.projectsGridService.getEditProjectForm();
  }

  public onGridAction({ type }: GridAction<string, string>): void {
    if (type === eGridRowActions.Delete) {
      // TODO: show 'Delete Project' popup
    } else if (type === eGridRowActions.Edit) {
      this.showEditDialog();
    } else if (type === this.gridInputs.gridButton.label) {
      this.showCreateNewDialog();
    }
  }

  public showEditDialog(value = true) {
    this.editDialogVisible = value;
  }

  public showCreateNewDialog(value = true) {
    this.createNewDialogVisible = value;
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

  public initEditProjectFormGroup(action: FormGroup): void {
    this.editProjectFormGroup = action;
    this.editProjectFormGroup.valueChanges.subscribe(() => {
      if (this.editProjectFormGroup.valid) {
        this.saveProjectButtonDisabled$.next(false);
      } else {
        this.saveProjectButtonDisabled$.next(true);
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

  public saveEditProject() {
    this.saveProjectButtonDisabled$.next(true);
    if (this.editProjectFormGroup.valid) {
      const values: ProjectEdit = this.editProjectFormGroup.value[this.projectsGridService.editProjectFormId];
      values.EndDate = new Date(values.EndDate);
      values.StartDate = new Date(values.StartDate);

      this.projectsService.updateProject(values).subscribe(() => {
        this.saveProjectButtonDisabled$.next(false);
        this.showEditDialog(false);
      });
    } else {
      this.editProjectFormGroup.markAllAsTouched();
    }
  }
}
