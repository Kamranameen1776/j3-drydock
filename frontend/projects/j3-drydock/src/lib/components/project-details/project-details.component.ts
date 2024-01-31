import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AdvancedSettings,
  IJbAttachment,
  IJbDialog,
  IJbMenuItem,
  ITopSectionFieldSet,
  IUploads,
  JbAttachmentsComponent,
  JbDetailsTopSectionService,
  eAttachmentButtonTypes,
  eGridColors,
  eGridIcons,
  eJMSActionTypes,
  eJMSSectionNames
} from 'jibe-components';
import { saveAs } from 'file-saver';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { concatMap, filter, finalize, map, takeUntil } from 'rxjs/operators';
import { GrowlMessageService } from '../../services/growl-message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { eFunction } from '../../models/enums/function.enum';
import { eModule } from '../../models/enums/module.enum';
import { ITMDetailTabFields, JbTaskManagerDetailsComponent, JbTaskManagerDetailsService } from 'j3-task-manager-ng';
import { Title } from '@angular/platform-browser';
import { ProjectDetailsAccessRights, ProjectDetailsService } from './project-details.service';
import { TaskManagerService } from '../../services/task-manager.service';
import { ProjectDetails, ProjectDetailsFull } from '../../models/interfaces/project-details';
import { projectDetailsMenuData } from './project-details-menu';
import { eProjectDetailsSideMenuId } from '../../models/enums/project-details.enum';
import { SpecificationsComponent } from './specification/specifications.component';
import { RfqComponent } from './yard/rfq/rfq.component';
import { ProjectsService } from '../../services/ProjectsService';
import { DetailsService } from '../../services/details.service';
import { UTCAsLocal } from '../../utils/date';
import { cloneDeep } from 'lodash';
import { StatementOfFactsComponent } from './project-monitoring/statement-of-facts/statement-of-facts.component';
import { eProjectsAccessActions } from '../../models/enums/access-actions.enum';
import { getFileNameDate } from '../../shared/functions/file-name';
import { forkJoin, of } from 'rxjs';
import { UpdateCostsDto } from '../../models/dto/specification-details/ISpecificationCostUpdateDto';
import { DailyReportsComponent } from './reports/reports.component';

@Component({
  selector: 'jb-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  providers: [GrowlMessageService, ProjectDetailsService]
})
export class ProjectDetailsComponent extends UnsubscribeComponent implements OnInit, OnDestroy {
  @ViewChild('detailsComponent') detailsComponent: JbTaskManagerDetailsComponent;
  @ViewChild('attachmentsComponent') attachmentsComponent: JbAttachmentsComponent;
  @ViewChild('specificationsComponent') specificationsComponent: SpecificationsComponent;
  @ViewChild('rfqComponent') rfqComponent: RfqComponent;
  @ViewChild('statementOfFactsComponent') statementOfFactsComponent: StatementOfFactsComponent;
  @ViewChild('dailyReportsComponent') dailyReportsComponent: DailyReportsComponent;

  @ViewChild('technical_specification') technical_specification: ElementRef;
  @ViewChild('attachmentss') attachmentss: ElementRef;
  @ViewChild('rfq') rfq: ElementRef;
  @ViewChild('statement_of_facts') statement_of_facts: ElementRef;
  @ViewChild('cost_updates') cost_updates: ElementRef;
  @ViewChild('daily_reports') daily_reports: ElementRef;
  @ViewChild('gantt_chart') gantt_chart: ElementRef;

  exportEnable = false;

  moduleCode = eModule.Project;
  functionCode = eFunction.DryDock;
  projectUid: string;
  projectDetails: ProjectDetails;

  vesselType: number;
  tmDetails: ProjectDetailsFull;
  sectionsConfig: ITMDetailTabFields;
  topSectionConfig: ITopSectionFieldSet;
  customThreeDotActions: AdvancedSettings[] = [
    { label: 'Export Excel', icon: eGridIcons.MicrosoftExcel2, color: eGridColors.JbBlack, show: true },
    { label: 'Import', icon: eGridIcons.MicrosoftExcel2, color: eGridColors.JbBlack, show: true }
  ];
  threeDotsActionsShow = {
    'Export Excel': true,
    Import: true,
    showDefaultLables: false
  };

  editingSection = '';

  attachmentButton = {
    buttonLabel: 'Add New',
    buttonType: eAttachmentButtonTypes.NoButton
  };

  attachmentConfig: IJbAttachment;

  accessRights: ProjectDetailsAccessRights;

  specificationsCreateNewItems: { label: string; command: () => void }[];
  isImportDialogVisible: boolean;

  updateCostsPayload: UpdateCostsDto;
  showLoader = false;
  get canView() {
    return this.accessRights?.view;
  }
  // TODO wait clarification about it
  get canEdit() {
    return this.accessRights?.edit;
  }

  getSpecificationsCreateNewItems() {
    const res = [];

    if (this.projectsService.hasAccess(eProjectsAccessActions.addSpecFromStandardJobs)) {
      res.push({
        label: 'Standard Jobs',
        command: () => {
          this.openCreateFromStandardJobPopup();
        }
      });
    }
    if (this.projectsService.hasAccess(eProjectsAccessActions.addSpecFromAdHoc)) {
      res.push({
        label: 'Create Ad hoc',
        command: () => {
          this.openSpecificationsPopup();
        }
      });
    }
    return res;
  }

  menu = cloneDeep(projectDetailsMenuData);

  readonly eSideMenuId = eProjectDetailsSideMenuId;

  get vesselUid() {
    return this.tmDetails?.VesselUid;
  }

  importDialogueProperties: IJbDialog = {
    closableIcon: true,
    resizableDialog: false,
    dialogWidth: 470,
    dialogHeader: 'Import',
    appendTo: 'body',
    styleClass: 'jb-dialog-header'
  };

  uploadConfig: IUploads = {
    multiple: false,
    ModuleCode: eModule.Project,
    FunctionCode: eFunction.DryDock,
    key1: 'invoice',
    showUploadButton: true,
    accept: '.xlsx'
  };

  okBtnLabel = 'Import';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  syncTo: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fileImportData: any;

  growlMessage$ = this.growlMessageService.growlMessage$;

  constructor(
    private jbTMDtlSrv: JbTaskManagerDetailsService,
    private jbTopSecSrv: JbDetailsTopSectionService,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private projectDetailsService: ProjectDetailsService,
    private taskManagerService: TaskManagerService,
    private projectsService: ProjectsService,
    private detailsService: DetailsService,
    private growlMessageService: GrowlMessageService
  ) {
    super();
  }

  ngOnInit(): void {
    this.jbTMDtlSrv.isFormValid = true;
    const title = this.route.snapshot.queryParamMap.get('tab_title');
    if (title) {
      this.titleService.setTitle(title);
    }

    this.route.paramMap
      .pipe(
        map((params) => params.get('projectId')),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((projectId) => {
        if (!projectId) {
          return;
        }
        this.projectUid = projectId;
        this.getDetails();
      });

    this.jbTopSecSrv.topSecEvent
      .pipe(
        filter((sec) => sec.secName === eJMSSectionNames.TopSection),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((res) => {
        res.type === eJMSActionTypes.Save || res.type === eJMSActionTypes.Error ? this.saveRecord(res) : null;
      });

    this.jbTMDtlSrv.refreshTaskManager
      .pipe(
        filter((event: { refresh: unknown; tmDetails: unknown }) => !!event.refresh && !event.tmDetails),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.getDetails(true);
      });

    this.jbTMDtlSrv.sectionEvents
      .pipe(
        // filter((event) => event.secName === 'details' || event.secName === 'office_response'),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((res) => {
        this.sectionActions(res);
      });

    this.specificationsCreateNewItems = this.getSpecificationsCreateNewItems();
  }

  private sectionActions(res: { type?: string; secName?: string; event?: unknown; checkValidation?: boolean }) {
    // eslint-disable-next-line default-case
    switch (res.type) {
      case eJMSActionTypes.Edit: {
        // TODO add check by access rights for each section - can it be edited or not
        this.editingSection = res.secName;
        break;
      }
      case eJMSActionTypes.Add: {
        const event = res.event as { secName: string; mode: string };
        this.processWidgetNewBtn(event.secName);
        break;
      }
    }
  }

  private processWidgetNewBtn(secName: string) {
    // eslint-disable-next-line default-case
    switch (secName) {
      case eProjectDetailsSideMenuId.RFQ: {
        this.rfqComponent?.onLinkYard();
        break;
      }
      case eProjectDetailsSideMenuId.Attachments: {
        this.attachmentsComponent?.dialogOnDemand();
        break;
      }
      case eProjectDetailsSideMenuId.StatementOfFacts: {
        this.statementOfFactsComponent?.showCreateDialog();
        break;
      }
      case eProjectDetailsSideMenuId.DailyReports: {
        this.dailyReportsComponent?.showReportDialog(true);
        break;
      }
    }
  }

  onValueChange(event) {
    if (event?.dirty) {
      this.jbTMDtlSrv.isUnsavedChanges.next(true);
    }
  }

  onWorkflowAction(wfEvent) {
    if (wfEvent?.event?.type === 'delete') {
      this.deleteRecord();
    } else if (wfEvent?.event?.type === 'resync') {
      this.resyncRecord();
    } else if (wfEvent?.event?.type === 'Export Excel') {
      this.exportExcel();
    } else if (wfEvent?.event?.type === 'Import') {
      this.importFile();
    }
  }

  importFile() {
    this.isImportDialogVisible = true;
  }

  closeGuidanceDialog() {
    this.isImportDialogVisible = false;
  }

  uploadInvoice() {
    this.showLoader = true;
    const res = this.projectsService.importFile(this.fileImportData, this.projectUid);
    res
      .pipe(
        finalize(() => {
          this.showLoader = false;
          this.isImportDialogVisible = false;
        })
      )
      .subscribe(
        () => {
          this.growlMessageService.setSuccessMessage('File has been imported successfully');
        },
        (error) => {
          this.growlMessageService.errorHandler(error);
        }
      );
  }

  onSelectNewFile(event) {
    this.fileImportData = event.uploadFiles[0];
  }

  private getDetails(refresh = false) {
    let projectDetails: ProjectDetails;

    this.projectDetailsService
      .getTopDetailsData(this.projectUid)
      .pipe(
        concatMap((data) => {
          projectDetails = {
            ...data,
            StartDate: UTCAsLocal(data.StartDate as string),
            EndDate: UTCAsLocal(data.EndDate as string)
          };
          this.projectDetails = projectDetails;

          this.attachmentConfig = {
            Module_Code: this.moduleCode,
            Function_Code: this.functionCode,
            Key1: projectDetails.TaskManagerUid
          };

          this.vesselType = data?.VesselType;

          return this.taskManagerService.getWorkflow(projectDetails.TaskManagerUid, projectDetails.ProjectTypeCode);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((workflow) => {
        this.tmDetails = { ...projectDetails, ...workflow, isTaskManagerJob: true };

        this.accessRights = this.projectDetailsService.setupAccessRights(this.tmDetails);
        this.topSectionConfig = this.projectDetailsService.getTopSecConfig(this.tmDetails);
        this.sectionsConfig = this.projectDetailsService.getSectionsConfig();

        this.setMenuByAccessRights();
        this.setAttachmentsActions();
        // TODO add here more to init view if needed
        if (refresh) {
          this.jbTMDtlSrv.refreshTaskManager.next({ refresh: true, tmDetails: this.tmDetails, topSecConfig: this.topSectionConfig });
        }
      });
  }

  updatesCostsData(data) {
    this.jbTMDtlSrv.isUnsavedChanges.next(true);
    this.updateCostsPayload = data;
  }

  private saveRecord(event) {
    this.sectionActions({ type: eJMSActionTypes.Edit, secName: '' });
    // TODO add validations here if needed
    if (event.type === eJMSActionTypes.Error) {
      this.growlMessageService.setErrorMessage(event.errorMsg);
    }

    const data = event.payload;

    if (!this.checkValidStartEndDates(data)) {
      this.growlMessageService.setErrorMessage('Start Date cannot be greater than End Date');
      setTimeout(() => this.jbTMDtlSrv.closeDialog.next(true));
      return;
    }

    this.jbTMDtlSrv.isAllSectionsValid.next(true);
    this.showLoader = true;
    forkJoin([
      this.updateCostsPayload?.specificationDetailsUid ? this.projectDetailsService.saveCostUpdates(this.updateCostsPayload) : of(null),
      this.projectDetailsService.save(this.projectUid, {
        ...data
      })
    ]).subscribe(
      () => {
        // TODO reset here forms, etc if needed
        this.getDetails(true);
        this.jbTMDtlSrv.isUnsavedChanges.next(false);
        this.showLoader = false;
      },
      (error) => {
        this.showLoader = false;
        this.growlMessageService.setErrorMessage(error.error.message);
      }
    );
  }

  private deleteRecord() {
    this.projectsService.deleteProject(this.projectUid).subscribe(() => {
      this.jbTMDtlSrv.closeDialog.next(true);
      this.router.navigate(['dry-dock/projects-main-page']);
    });
  }

  private resyncRecord() {
    // const body = {
    //   task_manager_uid: this.tmDetails.uid,
    //   wl_type: this.tmDetails.wl_type,
    //   vessel_id: this.tmDetails.Vessel_ID
    // };
    // this.tmSrv.setResyncData(body).subscribe((resync) => {
    //   this.jbTMDtlSrv.showGrowlMassage.next({
    //     severity: eMessagesSeverityValues.Success,
    //     detail: 'Record has been re-synced successfully'
    //   });
    //   this.jbTMDtlSrv.closeDialog.next(true);
    // })
    this.jbTMDtlSrv.closeDialog.next(true);
  }

  private openSpecificationsPopup() {
    this.specificationsComponent?.openPopup();
  }

  private openCreateFromStandardJobPopup() {
    this.specificationsComponent?.addFromStandardJob();
  }

  private setAttachmentsActions() {
    this.attachmentConfig.actions = this.detailsService.getAttachmentActions(this.accessRights.attachments);
  }

  private setMenuByAccessRights() {
    this.menu = cloneDeep(projectDetailsMenuData);

    if (this.projectDetailsService.isStatusBeforeComplete(this.tmDetails.ProjectStatusId)) {
      this.menu = this.hideMenuItem(this.menu, eProjectDetailsSideMenuId.ProjectMonitoring);
      this.menu = this.hideMenuItem(this.menu, eProjectDetailsSideMenuId.Reporting);

      if (
        this.detailsComponent?.selectedTab === eProjectDetailsSideMenuId.ProjectMonitoring ||
        this.detailsComponent?.selectedTab === eProjectDetailsSideMenuId.Reporting
      ) {
        this.detailsComponent.selectedTab = '';
        this.detailsComponent.onMenuTabChange(this.menu[0]);
      }
    }

    const specificationSection = this.getMenuById(this.menu, eProjectDetailsSideMenuId.Specifications);
    this.processSpecificationsMenuAccessRights(specificationSection);
  }

  private processSpecificationsMenuAccessRights(specificationSection: IJbMenuItem) {
    if (!specificationSection) {
      return;
    }
    if (!this.accessRights.attachments.view) {
      this.hideSubMenuItem(specificationSection, eProjectDetailsSideMenuId.Attachments);
    }
    if (!this.accessRights.specificationDetails.view) {
      this.hideSubMenuItem(specificationSection, eProjectDetailsSideMenuId.TechnicalSpecification);
    }
  }

  private getMenuById(menus: IJbMenuItem[], id: eProjectDetailsSideMenuId) {
    return this.detailsService.getMenuById(menus, id);
  }

  private hideSubMenuItem(parentMenu: IJbMenuItem, id: eProjectDetailsSideMenuId) {
    this.detailsService.hideSubMenuItem(parentMenu, id);
  }

  private hideMenuItem(menu: IJbMenuItem[], id: eProjectDetailsSideMenuId) {
    return this.detailsService.getMenuWithHiddenMenuItem(menu, id);
  }

  exportExcel() {
    if (!this.projectDetails.ShipYardId) {
      this.growlMessageService.setErrorMessage('Yard is not selected');
      return;
    }
    const res = this.projectDetailsService.exportExcel(this.projectUid, this.projectDetails.ShipYardId);
    res.subscribe((data) => {
      saveAs(data, this.getExcelFilename());
    });
  }

  private getExcelFilename() {
    return `${this.projectDetails.VesselName}-${this.projectDetails.ShipYard}-${new Date(
      this.projectDetails.StartDate
    ).getFullYear()}-${getFileNameDate()}.xlsx`;
  }

  private checkValidStartEndDates(formValue) {
    return this.detailsService.checkValidStartEndDates(formValue?.StartDate, formValue?.EndDate);
  }
}
