import { Component, OnInit } from '@angular/core';
import { ProjectsSpecificationGridService } from './ProjectsSpecificationGridService';
import { eGridRowActions, FormModel, GridAction, IJbDialog } from "jibe-components";
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { ProjectsService } from "../../../services/ProjectsService";
import { ProjectCreate } from "../../../models/interfaces/projects";

@Component({
  selector: 'jb-projects-specifications-grid',
  templateUrl: './projects-specifications-grid.component.html',
  styleUrls: ['./projects-specifications-grid.component.scss'],
  providers: [ProjectsSpecificationGridService]
})
export class ProjectsSpecificationsGridComponent implements OnInit {
  public gridInputs: GridInputsWithRequest;

  public createNewDialogVisible = false;
  createProjectDialog: IJbDialog = {
    dialogHeader: 'Create Project',
    closableIcon: true,
    dialogWidth: 600,
    resizableDialog: true,
    blockScroll: false,
    focusOnShow: false
  };
  createProjectForm: FormModel;
  createProjectFormGroup: FormGroup;
  saveProjectButtonDisabled$ = new BehaviorSubject(false);

  constructor(
    private projectsGridService: ProjectsSpecificationGridService,
    private projectsService: ProjectsService,
  ) {}

  ngOnInit(): void {
    this.gridInputs = this.projectsGridService.getGridInputs();
    this.createProjectForm = this.projectsGridService.getCreateProjectForm();
  }

  public onGridAction({ type }: GridAction<string, string>): void {
    if (type === eGridRowActions.Delete) {
      // TODO: show 'Delete Project' popup
    } else if (type === eGridRowActions.Edit) {
      // TODO: show 'Edit Project' popup
    } else if (type === this.gridInputs.gridButton.label) {
      // TODO: show 'Create New Project' popup
      this.showCreateNewDialog();
    }
  }

  public showCreateNewDialog(value = true) {
    this.createNewDialogVisible = value;
  }

  public initFormGroup(action: FormGroup): void {
    this.createProjectFormGroup = action;
    this.createProjectFormGroup.valueChanges.subscribe(() => {
      if (this.createProjectFormGroup.valid) {
        this.saveProjectButtonDisabled$.next(false);
      } else {
        this.saveProjectButtonDisabled$.next(true);
      }
    })
  }

  public saveNewProject() {
    this.saveProjectButtonDisabled$.next(true);
    if (this.createProjectFormGroup.valid) {
      const values: ProjectCreate = this.createProjectFormGroup.getRawValue();

      this.projectsService.createProject(values)
        .subscribe(() => {
          this.saveProjectButtonDisabled$.next(false);
          this.showCreateNewDialog(false);
        });
    } else {
      this.createProjectFormGroup.markAllAsTouched();
    }
  }
}
