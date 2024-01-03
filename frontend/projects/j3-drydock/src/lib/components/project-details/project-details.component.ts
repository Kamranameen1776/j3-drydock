import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  IJbAttachment,
  IJbMenuItem,
  ITopSectionFieldSet,
  JbAttachmentsComponent,
  JbDetailsTopSectionService,
  eAttachmentButtonTypes,
  eJMSActionTypes,
  eJMSSectionNames
} from 'jibe-components';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { concatMap, filter, map, takeUntil } from 'rxjs/operators';
import { GrowlMessageService } from '../../services/growl-message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { eFunction } from '../../models/enums/function.enum';
import { eModule } from '../../models/enums/module.enum';
import { ITMDetailTabFields, JbTaskManagerDetailsService } from 'j3-task-manager-ng';
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

@Component({
  selector: 'jb-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  providers: [GrowlMessageService, ProjectDetailsService]
})
export class ProjectDetailsComponent extends UnsubscribeComponent implements OnInit, OnDestroy {
  @ViewChild('attachmentsComponent') attachmentsComponent: JbAttachmentsComponent;
  @ViewChild('specificationsComponent') specificationsComponent: SpecificationsComponent;
  @ViewChild('rfqComponent') rfqComponent: RfqComponent;
  @ViewChild('statementOfFactsComponent') statementOfFactsComponent: StatementOfFactsComponent;

  @ViewChild(eProjectDetailsSideMenuId.TechnicalSpecification) [eProjectDetailsSideMenuId.TechnicalSpecification]: ElementRef;
  @ViewChild(eProjectDetailsSideMenuId.Attachments) [eProjectDetailsSideMenuId.Attachments]: ElementRef;
  @ViewChild(eProjectDetailsSideMenuId.RFQ) [eProjectDetailsSideMenuId.RFQ]: ElementRef;
  @ViewChild(eProjectDetailsSideMenuId.StatementOfFacts) [eProjectDetailsSideMenuId.StatementOfFacts]: ElementRef;
  @ViewChild(eProjectDetailsSideMenuId.JobOrders) [eProjectDetailsSideMenuId.JobOrders]: ElementRef;
  @ViewChild(eProjectDetailsSideMenuId.DailyReports) [eProjectDetailsSideMenuId.DailyReports]: ElementRef;
  @ViewChild(eProjectDetailsSideMenuId.GanttChart) [eProjectDetailsSideMenuId.GanttChart]: ElementRef;

  moduleCode = eModule.Project;
  functionCode = eFunction.DryDock;
  projectUid: string;

  vesselType: number;
  tmDetails: ProjectDetailsFull;
  sectionsConfig: ITMDetailTabFields;
  topSectionConfig: ITopSectionFieldSet;

  editingSection = '';

  attachmentButton = {
    buttonLabel: 'Add New',
    buttonType: eAttachmentButtonTypes.NoButton
  };

  attachmentConfig: IJbAttachment;

  accessRights: ProjectDetailsAccessRights;

  specificationsCreateNewItems: { label: string; command: () => void }[];

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

    this.route.paramMap
      .pipe(
        map((params) => params.get('projectId')),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((projectId) => {
        this.projectUid = projectId;
        this.titleService.setTitle('');
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
    // TODO add check by access rights for each section and hide in configuration for details page instead of here

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
    }
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

          this.attachmentConfig = {
            Module_Code: this.moduleCode,
            Function_Code: this.functionCode,
            Key1: projectDetails.TaskManagerUid
          };

          this.vesselType = data?.VesselType;

          this.titleService.setTitle(`${projectDetails.ProjectTypeName} ${projectDetails.ProjectCode}`);
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

  private saveRecord(event) {
    this.sectionActions({ type: eJMSActionTypes.Edit, secName: '' });
    // TODO add validations here if needed
    if (event.type === eJMSActionTypes.Error) {
      this.growlMessageService.setErrorMessage(event.errorMsg);
    }

    this.jbTMDtlSrv.isAllSectionsValid.next(true);

    this.projectDetailsService
      .save(this.projectUid, {
        ...event.payload
      })
      .subscribe(() => {
        // TODO reset here forms, etc if needed
        this.getDetails(true);
        this.jbTMDtlSrv.isUnsavedChanges.next(false);
      });
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
}
