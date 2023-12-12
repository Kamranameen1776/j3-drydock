/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  SpecificationDetailAccessRights,
  SpecificationDetailsService
} from '../../services/specification-details/specification-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { eSpecificationDetailsPageMenuIds, specificationDetailsMenuData } from '../../models/enums/specification-details.enum';
import {
  IJbAttachment,
  ITopSectionFieldSet,
  JbAttachmentsComponent,
  JbDatePipe,
  JbDetailsTopSectionService,
  JbMenuService,
  UserService,
  eDateFormats,
  eJMSActionTypes,
  eJMSSectionNames
} from 'jibe-components';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { concatMap, filter, map, takeUntil } from 'rxjs/operators';
import { GrowlMessageService } from '../../services/growl-message.service';
import { UpdateSpecificationDetailsDto } from '../../models/dto/specification-details/UpdateSpecificationDetailsDto';
import { eModule } from '../../models/enums/module.enum';
import { eFunction } from '../../models/enums/function.enum';
import { SpecificationDetailsFull, SpecificationDetails } from '../../models/interfaces/specification-details';
import { ITMDetailTabFields, JbTaskManagerDetailsService } from 'j3-task-manager-ng';
import { TaskManagerService } from '../../services/task-manager.service';
import moment from 'moment';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'jb-specification-details',
  templateUrl: './specification-details.component.html',
  styleUrls: ['./specification-details.component.scss'],
  providers: [JbDatePipe, GrowlMessageService]
})
export class SpecificationDetailsComponent extends UnsubscribeComponent implements OnInit, OnDestroy {
  @ViewChild('attachmentsComponent') attachmentsComponent: JbAttachmentsComponent;

  @ViewChild(eSpecificationDetailsPageMenuIds.SpecificationDetails) [eSpecificationDetailsPageMenuIds.SpecificationDetails]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.GeneralInformation) [eSpecificationDetailsPageMenuIds.GeneralInformation]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.SubItems) [eSpecificationDetailsPageMenuIds.SubItems]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.PMSJobs) [eSpecificationDetailsPageMenuIds.PMSJobs]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.Requisition) [eSpecificationDetailsPageMenuIds.Requisition]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.Source) [eSpecificationDetailsPageMenuIds.Source]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.SpecificationAttachments)
  [eSpecificationDetailsPageMenuIds.SpecificationAttachments]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.AttachmentsTab) [eSpecificationDetailsPageMenuIds.AttachmentsTab]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.Attachments) [eSpecificationDetailsPageMenuIds.Attachments]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.AuditTrail) [eSpecificationDetailsPageMenuIds.AuditTrail]: ElementRef;
  @ViewChild('attachments1') attachments1: ElementRef;

  private pageTitle = 'Specification Details';
  public specificationDetailsInfo: SpecificationDetails;
  public updateSpecificationDetailsInfo: UpdateSpecificationDetailsDto;
  public specificationUid: string;
  public attachmentConfig: IJbAttachment;

  private readonly menuId = 'specification-details-menu';
  currentSectionId = eSpecificationDetailsPageMenuIds.SpecificationDetails;
  eProjectDetailsSideMenuId = eSpecificationDetailsPageMenuIds;
  growlMessage$ = this.growlMessageService.growlMessage$;

  moduleCode = eModule.Project;
  functionCode = eFunction.SpecificationDetails;

  tmDetails: SpecificationDetailsFull;
  sectionsConfig: ITMDetailTabFields;
  topSectionConfig: ITopSectionFieldSet;

  accessRights: SpecificationDetailAccessRights;

  public detailForm: FormGroup;
  detailData: boolean;
  editingSection = '';

  readonly menu = specificationDetailsMenuData;
  readonly eSideMenuId = eSpecificationDetailsPageMenuIds;

  get vesselUid() {
    return this.tmDetails?.VesselUid;
  }

  get canView() {
    return this.accessRights?.view;
  }

  get canEdit() {
    return this.accessRights?.edit;
  }

  constructor(
    private title: Title,
    private specificationDetailService: SpecificationDetailsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private growlMessageService: GrowlMessageService,
    private jbMenuService: JbMenuService,
    private jbTMDtlSrv: JbTaskManagerDetailsService,
    private jbTopSecSrv: JbDetailsTopSectionService,
    private taskManagerService: TaskManagerService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.jbTMDtlSrv.isFormValid = true;

    this.activatedRoute.paramMap
      .pipe(
        map((params) => params.get('specificationUid')),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((specificationUid) => {
        this.specificationUid = specificationUid;
        this.title.setTitle('');
        this.getDetails();
      });

    this.jbTopSecSrv.topSecEvent
      .pipe(
        filter((sec) => sec.secName === eJMSSectionNames.TopSection),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((res) => {
        res.type === eJMSActionTypes.Save || res.type === eJMSActionTypes.Error ? this.save(res) : null;
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

  private getDetails(refresh = false) {
    // let specificationDetailsInfo: SpecificationDetails;

    this.specificationDetailService
      .getSpecificationDetails(this.specificationUid)
      .pipe(
        concatMap((data) => {
          this.specificationDetailsInfo = {
            ...data
          };

          this.specificationDetailsInfo.TaskManagerUid = 'CC7FEF30-815B-4437-8353-2A2BC1E7DD13';

          this.attachmentConfig = {
            Module_Code: this.moduleCode,
            Function_Code: this.functionCode,
            Key1: this.specificationDetailsInfo.TaskManagerUid
          };

          this.title.setTitle(`Specification ${this.specificationDetailsInfo?.SpecificationCode}`);
          return this.taskManagerService.getWorkflow(
            this.specificationDetailsInfo.TaskManagerUid,
            this.specificationDetailsInfo.SpecificationTypeCode
          );
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((workflow) => {
        this.tmDetails = { ...this.specificationDetailsInfo, ...workflow, isTaskManagerJob: true };

        this.accessRights = this.specificationDetailService.setupAccessRights(this.tmDetails);
        this.topSectionConfig = this.specificationDetailService.getTopSecConfig(this.tmDetails);
        this.sectionsConfig = this.specificationDetailService.getSpecificationStepSectionsConfig();
        // TODO add here more to init view if needed
        if (refresh) {
          this.jbTMDtlSrv.refreshTaskManager.next({ refresh: true, tmDetails: this.tmDetails, topSecConfig: this.topSectionConfig });
        }
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

  onValueChange(event) {
    if (event?.dirty) {
      this.jbTMDtlSrv.isUnsavedChanges.next(true);
    }
  }

  private processWidgetNewBtn(secName: string) {
    // TODO add check by access rights for each section - can it be clicked or not
    if (!this.canEdit) {
      return;
    }
    // eslint-disable-next-line default-case
    switch (secName) {
      case eSpecificationDetailsPageMenuIds.Attachments: {
        this.attachmentsComponent?.dialogOnDemand();
        break;
      }
      case eSpecificationDetailsPageMenuIds.AuditTrail: {
        break;
      }
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

  validateDetail(form: FormGroup) {
    form.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      if (form.valid) {
        this.detailData = true;
        this.detailForm = form;
      }
    });
  }

  deleteRecord() {
    this.specificationDetailService.deleteSpecification({ uid: this.specificationUid }).subscribe(() => {
      this.jbTMDtlSrv.closeDialog.next(true);
      this.router.navigate(['dry-dock/projects-main-page']);
    });
  }

  resyncRecord() {
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

  public async save(event): Promise<void> {
    this.sectionActions({ type: eJMSActionTypes.Edit, secName: '' });
    // TODO add validations here if needed
    if (event.type === eJMSActionTypes.Error) {
      this.jbTMDtlSrv.showGrowlMassage.next({ severity: eJMSActionTypes.Error, detail: event.errorMsg });
    }

    this.jbTMDtlSrv.isAllSectionsValid.next(true);

    const data: UpdateSpecificationDetailsDto = {
      uid: this.specificationDetailsInfo.uid,
      Subject: this.specificationDetailsInfo.Subject
    };

    this.specificationDetailService.updateSpecification(data).subscribe(() => {
      // TODO reset here forms, etc if needed
      this.getDetails(true);
      this.jbTMDtlSrv.isUnsavedChanges.next(false);
    });

    // try {
    //   this.specificationDetailService.updateSpecification(data).toPromise();
    //   this.growlMessageService.setSuccessMessage("Specification's information has been saved successfully.");
    // } catch (err) {
    //   this.growlMessageService.setErrorMessage(err.error);
    // }
  }
}
