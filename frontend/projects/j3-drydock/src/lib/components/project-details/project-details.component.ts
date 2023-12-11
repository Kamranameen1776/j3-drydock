import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ITopSectionFieldSet,
  JbAttachmentsComponent,
  JbDetailsTopSectionService,
  UserService,
  eAttachmentButtonTypes,
  eDateFormats,
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
import moment from 'moment';
import { ProjectDetailsAccessRights, ProjectDetailsService } from './project-details.service';
import { TaskManagerService } from '../../services/task-manager.service';
import { ProjectDetails, ProjectDetailsFull } from '../../models/interfaces/project-details';
import { projectDetailsMenuData } from './project-details-menu';
import { eProjectDetailsSideMenuId } from '../../models/enums/project-details.enum';
import { SpecificationsComponent } from './specification/specifications.component';
import { RfqComponent } from './yard/rfq/rfq.component';
import { ProjectsService } from '../../services/ProjectsService';

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

  @ViewChild(eProjectDetailsSideMenuId.TechnicalSpecification) [eProjectDetailsSideMenuId.TechnicalSpecification]: ElementRef;
  @ViewChild(eProjectDetailsSideMenuId.Attachments) [eProjectDetailsSideMenuId.Attachments]: ElementRef;
  @ViewChild(eProjectDetailsSideMenuId.RFQ) [eProjectDetailsSideMenuId.RFQ]: ElementRef;
  @ViewChild(eProjectDetailsSideMenuId.StatementOfFacts) [eProjectDetailsSideMenuId.StatementOfFacts]: ElementRef;
  @ViewChild(eProjectDetailsSideMenuId.JobOrders) [eProjectDetailsSideMenuId.JobOrders]: ElementRef;

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

  attachmentConfig: { Module_Code: string; Function_Code: string; Key1: string };

  accessRights: ProjectDetailsAccessRights;

  get canView() {
    return this.accessRights?.view;
  }

  get canEdit() {
    return this.accessRights?.edit;
  }

  specificationsCreateNewItems = [
    {
      label: 'Standard Jobs',
      command: () => {
        this.openCreateFromStandardJobPopup();
      }
    },
    {
      label: 'Create Ad hoc',
      command: () => {
        this.openSpecificationsPopup();
      }
    }
  ];

  readonly menu = projectDetailsMenuData;
  readonly eSideMenuId = eProjectDetailsSideMenuId;

  get vesselUid() {
    return this.tmDetails?.VesselUid;
  }

  constructor(
    private jbTMDtlSrv: JbTaskManagerDetailsService,
    private jbTopSecSrv: JbDetailsTopSectionService,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private projectDetailsService: ProjectDetailsService,
    private taskManagerService: TaskManagerService,
    private projectsService: ProjectsService
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
    // TODO add check by access rights for each section - can it be clicked or not
    if (!this.canEdit) {
      return;
    }
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
    } else if (wfEvent?.event?.type === 'dueDateChange') {
      const body = {
        vesselId: this.tmDetails.Vessel_ID,
        uid: this.tmDetails.uid,
        raised_location: this.tmDetails.raised_location,
        wl_type: this.tmDetails.wl_type,
        isJobEdit: true,
        function_code: this.functionCode,
        module_code: this.moduleCode,
        vessel_uid: this.tmDetails.vessel_uid,
        task_status: this.tmDetails.task_status,
        expected_completion_date: moment(
          wfEvent.event.payload?.update_due_date,
          UserService.getUserDetails()?.Date_Format?.toLocaleUpperCase()
        ).format(eDateFormats.DBDateTimeFormat),
        isTmDueDateChanged: true
      };
      this.jbTMDtlSrv.saveUpdatedTMDueDate(body);
    }
  }

  private getDetails(refresh = false) {
    let projectDetails: ProjectDetails;

    this.projectDetailsService
      .getTopDetailsData(this.projectUid)
      .pipe(
        concatMap((data) => {
          projectDetails = {
            ...data
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
        this.sectionsConfig = this.projectDetailsService.getSectionsConfig(this.tmDetails.task_status);
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
      this.jbTMDtlSrv.showGrowlMassage.next({ severity: eJMSActionTypes.Error, detail: event.errorMsg });
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
}
