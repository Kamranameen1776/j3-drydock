import { cloneDeep } from 'lodash';
import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProjectsSpecificationGridService } from './ProjectsSpecificationGridService';
import { eGridRowActions, FormModel, GridAction, GridComponent, IJbDialog } from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProjectsService } from '../../../services/ProjectsService';
import { ActivatedRoute, Router } from '@angular/router';
import { IProjectsForMainPageGridDto } from './dtos/IProjectsForMainPageGridDto';
import { getSmallPopup } from '../../../models/constants/popup';
import { ProjectsGridOdataKeys } from '../../../models/enums/ProjectsGridOdataKeys';
import { LeftPanelFilterService } from '../services/LeftPanelFilterService';
import { IProjectGroupStatusDto } from '../services/IProjectGroupStatusDto';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { takeUntil } from 'rxjs/operators';
import { NewTabService } from '../../../services/new-tab-service';
import { IProjectStatusDto } from '../../../services/dtos/IProjectStatusDto';
import { eProjectsAccessActions } from '../../../models/enums/access-actions.enum';
import { eFunction } from '../../../models/enums/function.enum';
import { statusBackground, statusIcon } from '../../../shared/statuses';
import { ProjectCreate } from '../../../models/interfaces/projects';
import { getDateFromJbString, localAsUTCFromJbString } from '../../../utils/date';
import { eProjectsCreateFieldNames } from '../../../models/enums/projects-create.enum';

@Component({
  selector: 'jb-projects-specifications-grid',
  templateUrl: './projects-specifications-grid.component.html',
  styleUrls: ['./projects-specifications-grid.component.scss'],
  providers: [ProjectsSpecificationGridService]
})
export class ProjectsSpecificationsGridComponent extends UnsubscribeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('projectsGrid')
  projectsGrid: GridComponent;

  @ViewChild('statusTemplate', { static: true }) statusTemplate: TemplateRef<unknown>;
  @ViewChild('startDateTemplate', { static: true }) startDateTemplate: TemplateRef<unknown>;
  @ViewChild('endDateTemplate', { static: true }) endDateTemplate: TemplateRef<unknown>;

  private readonly allProjectsProjectTypeId = 'all_projects';

  private readonly closeProjectStatusId = 'CLOSE';

  private subscription: Subscription = new Subscription();

  private accessActions = eProjectsAccessActions;

  private canViewDetails = false;

  private canCreateProject = false;

  private canDeleteProject = false;

  public canView = false;

  public DeleteBtnLabel = 'Delete';

  public CreateBtnLabel = 'Create';

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

  leftPanelProjectGroupStatusFilter: IProjectGroupStatusDto;

  leftPanelVesselsFilter: number[];

  statusCSS = { statusBackground, statusIcon };

  constructor(
    private router: Router,
    private projectsGridService: ProjectsSpecificationGridService,
    private projectsService: ProjectsService,
    private leftPanelFilterService: LeftPanelFilterService,
    private newTabService: NewTabService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.setAccessRights();
    this.setGridInputs();

    this.createProjectForm = this.projectsGridService.getCreateProjectForm();
    this.deleteProjectForm = this.projectsGridService.getDeleteProjectForm();

    this.projectsService.getProjectStatuses().pipe(takeUntil(this.unsubscribe$)).subscribe(this.selectGridDefaultStatuses.bind(this));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.leftPanelFilterService.vesselsChanged.pipe(takeUntil(this.unsubscribe$)).subscribe((filter: number[]) => {
      this.leftPanelVesselsFilter = filter;
      this.projectsGrid.fetchMatrixData();
    });

    this.leftPanelFilterService.groupStatusChanged.pipe(takeUntil(this.unsubscribe$)).subscribe((filter: IProjectGroupStatusDto) => {
      this.leftPanelProjectGroupStatusFilter = filter;
      this.projectsGrid.fetchMatrixData();
    });
  }

  onMatrixRequestChanged() {
    if (
      this.leftPanelProjectGroupStatusFilter.ProjectTypeId &&
      this.leftPanelProjectGroupStatusFilter.ProjectTypeId !== this.allProjectsProjectTypeId
    ) {
      this.projectsGrid.odata.filter.eq(ProjectsGridOdataKeys.ProjectTypeCode, this.leftPanelProjectGroupStatusFilter.ProjectTypeId);
    }

    if (this.leftPanelProjectGroupStatusFilter.GroupProjectStatusId) {
      this.projectsGrid.odata.filter.eq(
        ProjectsGridOdataKeys.GroupProjectStatusId,
        this.leftPanelProjectGroupStatusFilter.GroupProjectStatusId
      );
    }

    if (this.leftPanelVesselsFilter.length > 0) {
      this.projectsGrid.odata.filter.in(ProjectsGridOdataKeys.VesselId, this.leftPanelVesselsFilter);
    }
  }

  public onGridAction({ type }: GridAction<string, string>, project: IProjectsForMainPageGridDto): void {
    if (type === eGridRowActions.Delete) {
      this.deleteProjectFormGroup.value.Project = project;
      this.showDeleteDialog();
    } else if (type === eGridRowActions.Edit) {
      if (!project) {
        throw new Error('Project is null');
      }

      this.newTabService.navigate(['../project', project.ProjectId], { relativeTo: this.activatedRoute });
    } else if (type === this.gridInputs.gridButton.label) {
      this.showCreateNewDialog();
    }
  }

  public showCreateNewDialog(value = true) {
    this.createProjectFormGroup.reset();
    this.createNewDialogVisible = value;
  }

  public showDeleteDialog(value = true) {
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
    this.listenToDateChanges();
  }

  public listenToDateChanges() {
    const startDateControl = this.createProjectFormGroup.get(this.projectsGridService.createProjectFormId).get(eProjectsCreateFieldNames.StartDate);
    this.subscription.add(    
      startDateControl.valueChanges.subscribe((value) => {
        const endDateFieldModel = this.projectsGridService.getCreateFormControl(this.createProjectForm, eProjectsCreateFieldNames.EndDate);
        endDateFieldModel.calendarMin = value ? this.getDateFromString(value) : undefined;
      }),
    );
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

    if (!this.createProjectFormGroup.valid) {
      this.createProjectFormGroup.markAllAsTouched();
      return;
    }

    const values: ProjectCreate = cloneDeep(this.createProjectFormGroup.value[this.projectsGridService.createProjectFormId]);

    values.EndDate = localAsUTCFromJbString(values.EndDate);

    values.StartDate = localAsUTCFromJbString(values.StartDate);

    this.projectsService.createProject(values).subscribe(() => {
      this.saveNewProjectButtonDisabled$.next(false);
      this.showCreateNewDialog(false);
      this.projectsGrid.fetchMatrixData();
    });
  }

  public deleteProject() {
    this.deleteProjectButtonDisabled$.next(true);

    this.projectsService.deleteProject(this.deleteProjectFormGroup.value.Project.ProjectId).subscribe(() => {
      this.deleteProjectButtonDisabled$.next(false);
      this.showDeleteDialog(false);
      this.projectsGrid.fetchMatrixData();
    });
  }

  private getDateFromString(date: string): Date {
    return getDateFromJbString(date, this.projectsGridService.dateFormat.toUpperCase());
  }

  private selectGridDefaultStatuses(statuses: IProjectStatusDto[]) {
    this.gridInputs.filters.find((filter) => filter.FieldName === this.projectsGridService.ProjectStatusesFilterName).selectedValues =
      statuses.filter((status) => status.ProjectStatusId !== this.closeProjectStatusId).map((status) => status.ProjectStatusId);
  }

  private setAccessRights() {
    this.canView = this.hasAccess(this.accessActions.viewGrid) || this.hasAccess(this.accessActions.viewGridVessel);
    this.canViewDetails =
      this.hasAccess(this.accessActions.viewDetail, eFunction.DryDock) ||
      this.hasAccess(this.accessActions.viewDetailVessel, eFunction.DryDock);

    this.canCreateProject = this.hasAccess(this.accessActions.createProject);
    this.canDeleteProject = this.hasAccess(this.accessActions.deleteProject);
  }

  private setGridInputs() {
    this.gridInputs = this.projectsGridService.getGridInputs();
    this.gridInputs.gridButton.show = this.canCreateProject;
    this.setCellTemplate(this.statusTemplate, 'ProjectStatusName');
    this.setCellTemplate(this.startDateTemplate, 'StartDate');
    this.setCellTemplate(this.endDateTemplate, 'EndDate');
    this.setGridActions();
  }

  private setGridActions() {
    this.gridInputs.actions.length = 0;

    if (this.canViewDetails) {
      this.gridInputs.actions.push({
        name: eGridRowActions.Edit,
        label: 'Edit'
      });
    }

    if (this.canDeleteProject) {
      this.gridInputs.actions.push({
        name: eGridRowActions.Delete,
        label: 'Delete'
      });
    }
  }

  private hasAccess(action: eProjectsAccessActions, func = eFunction.Project): boolean {
    return this.projectsService.hasAccess(action, func);
  }

  private setCellTemplate(template: TemplateRef<unknown>, fieldName: string) {
    const col = this.gridInputs.columns.find((col) => col.FieldName === fieldName);
    if (!col) {
      return;
    }
    col.cellTemplate = template;
  }
}
