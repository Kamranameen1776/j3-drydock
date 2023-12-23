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
  JbDatePipe,
  JbDetailsTopSectionService,
  eJMSActionTypes,
  eJMSSectionNames,
  eMessagesSeverityValues
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
import { FormGroup } from '@angular/forms';
import { SpecificationSubItem } from '../../models/interfaces/specification-sub-item';

@Component({
  selector: 'jb-specification-details',
  templateUrl: './specification-details.component.html',
  styleUrls: ['./specification-details.component.scss'],
  providers: [JbDatePipe, GrowlMessageService]
})
export class SpecificationDetailsComponent extends UnsubscribeComponent implements OnInit, OnDestroy {
  @ViewChild(eSpecificationDetailsPageMenuIds.SpecificationDetails) [eSpecificationDetailsPageMenuIds.SpecificationDetails]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.GeneralInformation) [eSpecificationDetailsPageMenuIds.GeneralInformation]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.SubItems) [eSpecificationDetailsPageMenuIds.SubItems]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.PMSJobs) [eSpecificationDetailsPageMenuIds.PMSJobs]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.Findings) [eSpecificationDetailsPageMenuIds.Findings]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.Requisitions) [eSpecificationDetailsPageMenuIds.Requisitions]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.Source) [eSpecificationDetailsPageMenuIds.Source]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.SpecificationAttachments)
  [eSpecificationDetailsPageMenuIds.SpecificationAttachments]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.Attachments) [eSpecificationDetailsPageMenuIds.Attachments]: ElementRef;
  @ViewChild(eSpecificationDetailsPageMenuIds.AuditTrail) [eSpecificationDetailsPageMenuIds.AuditTrail]: ElementRef;

  public specificationDetailsInfo: SpecificationDetails;
  public updateSpecificationDetailsInfo: UpdateSpecificationDetailsDto;
  public specificationUid: string;
  public attachmentConfig: IJbAttachment;
  public detailForm: FormGroup;

  growlMessage$ = this.growlMessageService.growlMessage$;
  moduleCode = eModule.Project;
  functionCode = eFunction.SpecificationDetails;
  tmDetails: SpecificationDetailsFull;
  sectionsConfig: ITMDetailTabFields;
  topSectionConfig: ITopSectionFieldSet;
  accessRights: SpecificationDetailAccessRights;
  editingSection = '';
  showLoader = false;
  selectedAmount = {
    [eSpecificationDetailsPageMenuIds.PMSJobs]: 0,
    [eSpecificationDetailsPageMenuIds.Findings]: 0
  };
  showEditSubItem = false;
  subItemDetails = {
    quantity: 0
  } as SpecificationSubItem;

  readonly menu = specificationDetailsMenuData;
  readonly eSideMenuId = eSpecificationDetailsPageMenuIds;

  public eSpecificationDetailsPageMenuIds = eSpecificationDetailsPageMenuIds;

  constructor(
    private title: Title,
    private specificationDetailService: SpecificationDetailsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private growlMessageService: GrowlMessageService,
    private jbTMDtlSrv: JbTaskManagerDetailsService,
    private jbTopSecSrv: JbDetailsTopSectionService,
    private taskManagerService: TaskManagerService
  ) {
    super();
  }

  get vesselUid() {
    return this.tmDetails?.VesselUid;
  }

  get canView() {
    return this.accessRights?.view;
  }

  get canEdit() {
    return this.accessRights?.edit;
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

  validateDetail(form: FormGroup) {
    form.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.jbTMDtlSrv.isUnsavedChanges.next(true);
      this.detailForm = form;
    });
  }

  deleteRecord() {
    this.specificationDetailService.deleteSpecification({ uid: this.specificationUid }).subscribe(() => {
      this.jbTMDtlSrv.closeDialog.next(true);
      this.router.navigate([`dry-dock/project/${this.specificationDetailsInfo.ProjectUid}`]);
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
    if (this.detailForm.invalid) {
      this.jbTMDtlSrv.showGrowlMassage.next({
        severity: eJMSActionTypes.Error,
        detail: 'Please fill all the required fields'
      });
      return;
    }
    if (event.type === eJMSActionTypes.Error) {
      this.jbTMDtlSrv.showGrowlMassage.next({ severity: eJMSActionTypes.Error, detail: event.errorMsg });
      return;
    }
    this.showLoader = true;
    const detailForm = this.detailForm.value.generalInformation;
    this.jbTMDtlSrv.isAllSectionsValid.next(true);

    const data: UpdateSpecificationDetailsDto = {
      uid: this.specificationDetailsInfo.uid,
      Subject: event.payload.Job_Short_Description,
      AccountCode: detailForm.accountCode,
      Description: detailForm.description,
      DoneByUid: detailForm.doneBy,
      PriorityUid: detailForm.priorityUid,
      Inspections: detailForm.inspectionId
    };

    try {
      this.specificationDetailService
        .updateSpecification(data)
        .toPromise()
        .then(() => {
          this.jbTMDtlSrv.showGrowlMassage.next({
            severity: eMessagesSeverityValues.Success,
            detail: 'Specification has been updated successfully'
          });
          this.jbTMDtlSrv.isUnsavedChanges.next(false);
          this.getDetails(true);
        });
    } catch (err) {
      this.jbTMDtlSrv.isUnsavedChanges.next(false);
      this.jbTMDtlSrv.showGrowlMassage.next({
        severity: eMessagesSeverityValues.Error,
        detail: err.error
      });
      this.showLoader = false;
    }
  }

  updateSelectedAmount(amount: number, type: eSpecificationDetailsPageMenuIds) {
    this.selectedAmount[type] = amount;
  }

  closeDialog(isSaved: boolean) {
    this.showEditSubItem = false;
  }

  private getDetails(refresh = false) {
    this.showLoader = true;

    this.specificationDetailService
      .getSpecificationDetails(this.specificationUid)
      .pipe(
        concatMap((data) => {
          this.specificationDetailsInfo = {
            ...data
          };

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
          this.jbTMDtlSrv.refreshTaskManager.next({
            refresh: true,
            tmDetails: this.tmDetails,
            topSecConfig: this.topSectionConfig
          });
        }
      });

    this.showLoader = false;
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
    switch (secName) {
      case eSpecificationDetailsPageMenuIds.Attachments: {
        break;
      }
      case eSpecificationDetailsPageMenuIds.AuditTrail: {
        break;
      }
      case eSpecificationDetailsPageMenuIds.PMSJobs:
        this.subItemDetails.quantity = this.selectedAmount[eSpecificationDetailsPageMenuIds.PMSJobs];
        this.showEditSubItem = true;
        break;
      case eSpecificationDetailsPageMenuIds.Findings:
        this.subItemDetails.quantity = this.selectedAmount[eSpecificationDetailsPageMenuIds.Findings];
        this.showEditSubItem = true;
        break;
      default:
        break;
    }
  }
}
