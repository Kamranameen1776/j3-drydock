import { cloneDeep } from 'lodash';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProjectsGridService } from './projects-grid.service';
import {
  eDropdownLabels,
  eDropdownValues,
  eGridRowActions,
  FormModel,
  GridAction,
  GridComponent,
  GridShareDataService,
  IJbDialog,
  JmsService,
  VesselService
} from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
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
import { localAsUTCFromJbString } from '../../../utils/date';
import { GrowlMessageService } from '../../../services/growl-message.service';
import { eProjectCreate, eProjectDelete, eProjectStatus } from '../../../models/enums/project-details.enum';
import { FleetService } from '../../../services/fleet.service';
import { eProjectsCreateFieldNames } from '../../../models/enums/projects-create.enum';
import { nameOf } from '../../../utils/nameOf';

@Component({
  selector: 'jb-projects-grid',
  templateUrl: './projects-grid.component.html',
  styleUrls: ['./projects-grid.component.scss'],
  providers: [ProjectsGridService, GrowlMessageService]
})
export class ProjectsGridComponent extends UnsubscribeComponent implements OnInit, AfterViewInit {
  @ViewChild('projectsGrid') projectsGrid: GridComponent;

  @ViewChild('statusTemplate', { static: true }) statusTemplate: TemplateRef<unknown>;
  @ViewChild('startDateTemplate', { static: true }) startDateTemplate: TemplateRef<unknown>;
  @ViewChild('endDateTemplate', { static: true }) endDateTemplate: TemplateRef<unknown>;
  @ViewChild('codeTemplate', { static: true }) codeTemplate: TemplateRef<unknown>;

  canView = false;

  readonly deleteBtnLabel = eProjectDelete.DeleteBtnLabel;

  readonly deleteProjectText = eProjectDelete.ProjectDeleteText;

  readonly createBtnLabel = eProjectCreate.BtnLabel;

  gridInputs: GridInputsWithRequest;

  createNewDialogVisible = false;

  deleteDialogVisible = false;

  createProjectDialog: IJbDialog = { ...getSmallPopup(), dialogHeader: eProjectCreate.DialogueHeader };

  deleteProjectDialog: IJbDialog = { ...getSmallPopup(), dialogHeader: eProjectDelete.DeleteDialogueHeader };

  createProjectForm: FormModel;

  selectedProjectID: string;

  createProjectFormGroup: FormGroup;

  saveNewProjectButtonDisabled$ = new BehaviorSubject(false);

  saveProjectButtonDisabled$ = new BehaviorSubject(false);

  deleteProjectButtonDisabled$ = new BehaviorSubject(false);

  leftPanelProjectGroupStatusFilter: IProjectGroupStatusDto;

  leftPanelVesselsFilter: number[];

  statusCSS = { statusBackground, statusIcon };

  growlMessage$ = this.growlMessageService.growlMessage$;

  showLoader = false;

  private readonly allProjectsProjectTypeId = 'all_projects';

  private readonly plannedProjectStatusId = 'RAISE';

  private accessActions = eProjectsAccessActions;

  private canViewDetails = false;

  private canCreateProject = false;

  private canDeleteProject = false;

  private currentVessels = [];

  private allVessels = [];

  constructor(
    private router: Router,
    private projectsGridService: ProjectsGridService,
    private projectsService: ProjectsService,
    private leftPanelFilterService: LeftPanelFilterService,
    private newTabService: NewTabService,
    private activatedRoute: ActivatedRoute,
    private growlMessageService: GrowlMessageService,
    private fleetService: FleetService,
    private vesselService: VesselService,
    private jmsSvc: JmsService,
    private gridSharedService: GridShareDataService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setAccessRights();
    this.setGridInputs();

    this.createProjectForm = this.projectsGridService.getCreateProjectForm();

    this.getFleetList();
    this.getVesselList();
  }

  ngAfterViewInit(): void {
    this.leftPanelFilterService.vesselsChanged.pipe(takeUntil(this.unsubscribe$)).subscribe((filter: number[]) => {
      this.leftPanelVesselsFilter = filter;
      this.setVesselFilter(filter);
      this.gridSharedService.refreshGridSLoad();
    });

    this.leftPanelFilterService.groupStatusChanged.pipe(takeUntil(this.unsubscribe$)).subscribe((filter: IProjectGroupStatusDto) => {
      this.leftPanelProjectGroupStatusFilter = filter;
      const newFilters = this.leftPanelFilterService.statusToFilterMap[filter.GroupProjectStatusId];
      this.selectGridDefaultStatuses(newFilters);
      this.gridSharedService.refreshGridSLoad();
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

  onGridAction({ type }: GridAction<string, string>, project: IProjectsForMainPageGridDto): void {
    if (type === eGridRowActions.Delete) {
      this.selectedProjectID = project.ProjectId;
      this.showDeleteDialog();
    } else if (type === eGridRowActions.Edit) {
      if (!project) {
        throw new Error('Project is null');
      }

      this.navigateToDetails(project.ProjectId, this.getProjectPageTitle(project));
    } else if (type === this.gridInputs.gridButton.label) {
      this.showCreateNewDialog();
    }
  }

  onCodeClick(project: IProjectsForMainPageGridDto) {
    this.navigateToDetails(project.ProjectId, this.getProjectPageTitle(project));
  }

  showCreateNewDialog(isShow = true) {
    if (!isShow) {
      if (this.getCreateFormControlValue(eProjectsCreateFieldNames.Fleet) != null) {
        this.setCurrentVesselsAndList(this.allVessels);
      }
      this.createProjectFormGroup.reset();
    }
    this.createNewDialogVisible = isShow;
    this.saveNewProjectButtonDisabled$.next(true);
  }

  showDeleteDialog(value = true) {
    this.deleteDialogVisible = value;
  }

  initCreateNewProjectFormGroup(action: FormGroup): void {
    this.createProjectFormGroup = action;
    this.createProjectFormGroup.valueChanges.subscribe(() => {
      if (this.createProjectFormGroup.valid) {
        this.saveNewProjectButtonDisabled$.next(false);
      } else {
        this.saveNewProjectButtonDisabled$.next(true);
      }
    });

    this.listenFleetChanges();
    this.listenVesselChanges();
  }

  saveNewProject() {
    const values: ProjectCreate = cloneDeep(this.createProjectFormGroup.value[this.projectsGridService.createProjectFormId]);

    if (values.EndDate) {
      values.EndDate = localAsUTCFromJbString(values.EndDate);
    }

    if (values.StartDate) {
      values.StartDate = localAsUTCFromJbString(values.StartDate);
    }

    if (values.EndDate && values.StartDate && values.EndDate < values.StartDate) {
      this.growlMessageService.setErrorMessage('Start date cannot be greater than End date');
      return;
    }

    this.saveNewProjectButtonDisabled$.next(true);
    this.showLoader = true;
    this.projectsService.createProject(values).subscribe((created: IProjectsForMainPageGridDto[]) => {
      this.saveNewProjectButtonDisabled$.next(false);
      this.showLoader = false;
      this.showCreateNewDialog(false);
      this.projectsGrid.fetchMatrixData();
      const project = created?.[0];
      if (!project) {
        return;
      }
      this.navigateToDetails(project.ProjectId, this.getProjectPageTitle(project));
    });
  }

  deleteProject() {
    this.showLoader = true;
    this.deleteProjectButtonDisabled$.next(true);

    this.projectsService.deleteProject(this.selectedProjectID).subscribe(() => {
      this.deleteProjectButtonDisabled$.next(false);
      this.showDeleteDialog(false);
      this.growlMessageService.setSuccessMessage('Project deleted successfully.');
      this.projectsGrid.fetchMatrixData();
      this.showLoader = false;
    });
  }

  private selectGridDefaultStatuses(statuses: IProjectStatusDto[] = []) {
    this.projectsGridService.filters.find(
      (filter) => filter.FieldName === this.projectsGridService.projectStatusesFilterName
    ).selectedValues = statuses.map((status) => status.ProjectStatusId);
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
    this.projectsService
      .getProjectStatuses()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((statuses) => {
        const raiseFilter = statuses.filter((status) => status.ProjectStatusId === this.plannedProjectStatusId);
        this.selectGridDefaultStatuses(raiseFilter);
        this.gridInputs = this.projectsGridService.getGridInputs();
        this.gridInputs.gridButton.show = this.canCreateProject;
        this.setCellTemplate(
          this.statusTemplate,
          nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectStatusName)
        );
        this.setCellTemplate(
          this.startDateTemplate,
          nameOf<IProjectsForMainPageGridDto>((prop) => prop.StartDate)
        );
        this.setCellTemplate(
          this.endDateTemplate,
          nameOf<IProjectsForMainPageGridDto>((prop) => prop.EndDate)
        );
        this.setCellTemplate(
          this.codeTemplate,
          nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectCode)
        );
        this.setGridActions();
      });
  }

  private setGridActions() {
    this.gridInputs.actions.length = 0;

    if (this.canViewDetails) {
      this.gridInputs.actions.push({
        name: eGridRowActions.Edit,
        label: 'Edit',
        icon: 'icons8-edit'
      });
    }

    if (this.canDeleteProject) {
      this.gridInputs.actions.push({
        name: eGridRowActions.Delete,
        label: 'Delete',
        fieldName: nameOf<IProjectsForMainPageGridDto>((prop) => prop.ProjectStatusName),
        condition: eProjectStatus.Planned,
        actionTrueValue: true,
        actionFalseValue: false,
        icon: 'icons8-delete'
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

  private getFleetList() {
    this.fleetService
      .getFleets(false)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.getCreateFormField(eProjectsCreateFieldNames.Fleet).list = this.jmsSvc.createSingleSelectDrpDown(
          res,
          eDropdownLabels.FleetLabel,
          eDropdownValues.FleetValue
        );
      });
  }

  private getVesselList(fleetCodes?: string[] | number[]) {
    this.vesselService
      .getVesselsByFleet(fleetCodes, false)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res) => {
          this.setCurrentVesselsAndList(res);
          if (!fleetCodes) {
            this.allVessels = res;
          }
        },
        () => {
          this.getCreateFormField(eProjectsCreateFieldNames.Vessel).list = [];
          this.getCreateFormControl(eProjectsCreateFieldNames.Vessel)?.reset();
        }
      );
  }

  private listenVesselChanges() {
    this.getCreateFormControl(eProjectsCreateFieldNames.Vessel)
      .valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        const fleetId = this.getCreateFormControlValue(eProjectsCreateFieldNames.Fleet);
        if (fleetId == null && res != null) {
          this.setCreateFormControlValue(eProjectsCreateFieldNames.Fleet, this.getVesselById(res as number)?.FleetCode);
        }
      });
  }

  private listenFleetChanges() {
    this.getCreateFormControl(eProjectsCreateFieldNames.Fleet)
      .valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        const vesselId = this.getCreateFormControlValue(eProjectsCreateFieldNames.Vessel);
        if (vesselId != null) {
          const vesselFleetId = this.getVesselById(vesselId)?.FleetCode;
          if (vesselFleetId != null && vesselFleetId === res) {
            return;
          }
        }
        this.getCreateFormControl(eProjectsCreateFieldNames.Vessel)?.reset();
        if (res != null) {
          this.getVesselList([res]);
        }
      });
  }

  private getCreateFormField(fieldName: eProjectsCreateFieldNames) {
    return this.createProjectForm.sections[this.projectsGridService.createProjectFormId].fields[fieldName];
  }

  private getCreateFormControl(fieldName: eProjectsCreateFieldNames) {
    return this.createProjectFormGroup?.controls[this.projectsGridService.createProjectFormId]?.get(fieldName) as FormControl;
  }

  private getCreateFormControlValue(fieldName: eProjectsCreateFieldNames) {
    return this.createProjectFormGroup?.getRawValue()[this.projectsGridService.createProjectFormId][fieldName];
  }

  private setCreateFormControlValue(fieldName: eProjectsCreateFieldNames, value: unknown) {
    this.getCreateFormControl(fieldName)?.setValue(value);
  }

  private getVesselById(vesselId: number) {
    return this.currentVessels.find((vessel) => vessel.Vessel_ID === vesselId);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setCurrentVesselsAndList(vessels: any[]) {
    this.currentVessels = vessels;
    this.getCreateFormField(eProjectsCreateFieldNames.Vessel).list = this.jmsSvc.createSingleSelectDrpDown(
      vessels,
      eDropdownLabels.VesselLabel,
      eDropdownValues.VesselValue
    );
  }

  private navigateToDetails(projectId: string, tab_title: string) {
    this.newTabService.navigate(
      ['../project', projectId],
      {
        relativeTo: this.activatedRoute,
        queryParams: { tab_title }
      },
      tab_title
    );
  }

  private getProjectPageTitle(project: IProjectsForMainPageGridDto) {
    return `${project.ProjectTypeName} ${project.ProjectCode}`;
  }

  private setVesselFilter(vesselIds: number[]) {
    this.projectsGridService.filters.find((filter) => filter.FieldName === this.projectsGridService.vesselsFilterName).selectedValues =
      vesselIds || [];
  }
}
