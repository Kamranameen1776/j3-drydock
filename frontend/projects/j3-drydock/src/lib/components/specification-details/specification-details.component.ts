import { cloneDeep } from 'lodash';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  SpecificationDetailAccessRights,
  SpecificationDetailsService
} from '../../services/specification-details/specification-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ePmsWlType,
  eSpecificationDetailsPageMenuIds,
  eSpecificationWorkflowStatusAction,
  specificationDetailsMenuData
} from '../../models/enums/specification-details.enum';
import {
  GridService,
  IJbAttachment,
  IJbMenuItem,
  ITopSectionFieldSet,
  JbDatePipe,
  JbDetailsTopSectionService,
  eGridRefreshType,
  eJMSActionTypes,
  eJMSSectionNames,
  JiBeTheme,
  gridShareDataServiceProvider
} from 'jibe-components';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { concatMap, filter, map, takeUntil, finalize } from 'rxjs/operators';
import { GrowlMessageService } from '../../services/growl-message.service';
import { UpdateSpecificationDetailsDto } from '../../models/dto/specification-details/UpdateSpecificationDetailsDto';
import { eModule } from '../../models/enums/module.enum';
import { eFunction } from '../../models/enums/function.enum';
import { SpecificationDetailsFull, SpecificationDetails } from '../../models/interfaces/specification-details';
import { ITMDetailTabFields, JbTaskManagerDetailsService } from 'j3-task-manager-ng';
import { TaskManagerService } from '../../services/task-manager.service';
import { FormGroup } from '@angular/forms';
import { CreateSpecificationSubItemData } from '../../models/interfaces/specification-sub-item';
import { SpecificationDetailsSubItemsGridService } from '../../services/specification-details/specification-details-sub-item.service';
import { eSubItemsDialog } from '../../models/enums/sub-items.enum';
import { TmLinkedRecords } from 'jibe-components/lib/interfaces/tm-linked-records.interface';
import { Subscription } from 'rxjs';
import { UTCAsLocal, localDateJbStringAsUTC } from '../../utils/date';
import { DetailsService } from '../../services/details.service';
import { SpecificationUpdatesComponent } from './specification-updates/specification-updates.component';

@Component({
  selector: 'jb-specification-details',
  templateUrl: './specification-details.component.html',
  styleUrls: ['./specification-details.component.scss'],
  providers: [JbDatePipe, GrowlMessageService, gridShareDataServiceProvider(true)]
})
export class SpecificationDetailsComponent extends UnsubscribeComponent implements OnInit, OnDestroy {
  @ViewChild('specificationUpdatesComponent') specificationUpdatesComponent: SpecificationUpdatesComponent;

  @ViewChild('specificationDetails') specificationDetails: ElementRef;
  @ViewChild('generalInformation') generalInformation: ElementRef;
  @ViewChild('subItems') subItems: ElementRef;
  @ViewChild('pmsJobs') pmsJobs: ElementRef;
  @ViewChild('findings') findings: ElementRef;
  @ViewChild('specificationUpdates') specificationUpdates: ElementRef;

  isForceDisableClose = false;

  specificationDetailsInfo: SpecificationDetails;
  updateSpecificationDetailsInfo: UpdateSpecificationDetailsDto;
  specificationUid: string;
  attachmentConfig: IJbAttachment;
  detailForm: FormGroup;
  isSpecificationEditable = false;

  JibeTheme = JiBeTheme;
  growlMessage$ = this.growlMessageService.growlMessage$;
  moduleCode = eModule.Project;
  functionCode = eFunction.SpecificationDetails;
  tmDetails: SpecificationDetailsFull;
  sectionsConfig: ITMDetailTabFields;
  topSectionConfig: ITopSectionFieldSet;
  accessRights: SpecificationDetailAccessRights;
  editingSection = '';
  showLoader = false;
  selectedItems: { [key in eSpecificationDetailsPageMenuIds]?: TmLinkedRecords[] } = {
    [eSpecificationDetailsPageMenuIds.PMSJobs]: [],
    [eSpecificationDetailsPageMenuIds.Findings]: []
  };
  showEditSubItem = false;
  subItemDetails = {
    quantity: 0
  } as CreateSpecificationSubItemData;
  pmsWlType = ePmsWlType;
  menu = cloneDeep(specificationDetailsMenuData);
  readonly eSideMenuId = eSpecificationDetailsPageMenuIds;
  eSpecificationDetailsPageMenuIds = eSpecificationDetailsPageMenuIds;
  isUpdatesEditable = false;
  private isExecutionPhase = false;
  private formValuesSub: Subscription;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private savePayload: any;

  constructor(
    private title: Title,
    private specificationDetailService: SpecificationDetailsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private growlMessageService: GrowlMessageService,
    private jbTMDtlSrv: JbTaskManagerDetailsService,
    private jbTopSecSrv: JbDetailsTopSectionService,
    private taskManagerService: TaskManagerService,
    private gridService: GridService,
    private subItemsGridService: SpecificationDetailsSubItemsGridService,
    private detailsService: DetailsService
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

  ngOnInit(): void {
    this.jbTMDtlSrv.isFormValid = true;

    const title = this.activatedRoute.snapshot.queryParamMap.get('tab_title');
    if (title) {
      this.title.setTitle(title);
    }

    this.activatedRoute.paramMap
      .pipe(
        map((params) => params.get('specificationUid')),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((specificationUid) => {
        this.specificationUid = specificationUid;
        this.getDetails();
      });

    this.jbTopSecSrv.topSecEvent
      .pipe(
        filter((sec) => sec.secName === eJMSSectionNames.TopSection),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((res) => {
        // Save payload for saving the data after changing task manager status, supposing that Save button is disabled on complete status
        if (this.specificationDetailsInfo.StatusId === eSpecificationWorkflowStatusAction.Complete) {
          this.jbTMDtlSrv.restrictWorkflowDialog = this.isForceDisableClose;
          if (this.isForceDisableClose) {
            this.growlMessageService.setErrorMessage('Specification cannot be "Closed" until project is in execution phase');
            return;
          }
          this.savePayload = res;
          return;
        }
        res.type === eJMSActionTypes.Save || res.type === eJMSActionTypes.Error ? this.save(res) : null;
      });

    this.jbTMDtlSrv.refreshTaskManager
      .pipe(
        filter((event: { refresh: unknown; tmDetails: unknown }) => !!event.refresh && !event.tmDetails),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        // If we are refreshing task manager while having savePayload it means we did update task manager details and need to update specification details
        if (this.savePayload) {
          this.save(this.savePayload);
        }
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

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.formValuesSub?.unsubscribe();
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

  onJobOrderUpdate() {
    this.refreshSubItems();
  }

  dispatchGeneralInformationForm(form: FormGroup) {
    this.detailForm = form;

    this.formValuesSub?.unsubscribe();

    this.formValuesSub = this.detailForm.valueChanges.subscribe(() => {
      this.jbTMDtlSrv.isUnsavedChanges.next(this.isSpecificationEditable);
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

    const headerFormValue = event.payload;

    if (!this.checkValidStartEndDates(headerFormValue)) {
      this.growlMessageService.setErrorMessage('Start Date cannot be greater than End Date');
      setTimeout(() => this.jbTMDtlSrv.closeDialog.next(true));
      return;
    }

    if (headerFormValue.Completion != null && (+headerFormValue.Completion > 100 || +headerFormValue.Completion < 0)) {
      this.growlMessageService.setErrorMessage('Percentage Completion must be from 0 to 100');
      setTimeout(() => this.jbTMDtlSrv.closeDialog.next(true));
      return;
    }

    if (headerFormValue.Job_Short_Description.length > 200) {
      this.growlMessageService.setErrorMessage('Subject/Title cannot be more than 200 characters');
      return;
    }

    if (this.detailForm?.invalid) {
      this.growlMessageService.setErrorMessage('Please fill all the required fields');
      return;
    }

    if (event.type === eJMSActionTypes.Error) {
      this.growlMessageService.setErrorMessage(event.errorMsg);
      return;
    }

    this.jbTMDtlSrv.isAllSectionsValid.next(true);

    this.showLoader = true;

    // if user can't edit OR view - send values from specification model
    const detailForm = this.detailForm?.value.generalInformation || {
      accountCode: this.specificationDetailsInfo.AccountCode,
      doneBy: this.specificationDetailsInfo.DoneByUid,
      priorityUid: this.specificationDetailsInfo.PriorityUid,
      inspectionId: this.specificationDetailsInfo.Inspections.map((inspection) => inspection.InspectionId)
    };

    const data: UpdateSpecificationDetailsDto = {
      uid: this.specificationDetailsInfo.uid,
      Subject: headerFormValue.Job_Short_Description,
      AccountCode: detailForm?.accountCode,
      Description: this.detailForm?.value.editors.description,
      DoneByUid: detailForm?.doneBy,
      PriorityUid: detailForm?.priorityUid,
      Inspections: detailForm?.inspectionId
    };

    if (headerFormValue.StartDate) {
      data.StartDate = localDateJbStringAsUTC(headerFormValue.StartDate);
    }

    if (headerFormValue.EndDate) {
      data.EndDate = localDateJbStringAsUTC(headerFormValue.EndDate);
    }

    if (headerFormValue.Completion != null) {
      data.Completion = +headerFormValue.Completion;
    }

    if (headerFormValue.Duration != null) {
      data.Duration = +headerFormValue.Duration;
    }

    this.specificationDetailService
      .updateSpecification(data)
      .pipe(
        finalize(() => {
          this.jbTMDtlSrv.isUnsavedChanges.next(false);
        })
      )
      .subscribe(
        () => {
          this.growlMessageService.setSuccessMessage('Specification has been updated successfully');
          this.getDetails(true);
          this.savePayload = null;
        },
        (err) => {
          this.showLoader = false;
          if (err?.status === 422 && err?.error?.message) {
            this.growlMessageService.setErrorMessage(err.error.message);
          } else {
            this.growlMessageService.setErrorMessage('Server error occurred');
          }
        }
      );
  }

  updateSelectedAmount(items: TmLinkedRecords[], type: eSpecificationDetailsPageMenuIds) {
    this.selectedItems[type] = items;
  }

  closeDialog() {
    this.showEditSubItem = false;
    this.refreshSubItems();
  }

  private refreshSubItems() {
    this.gridService.refreshGrid(eGridRefreshType.Table, this.subItemsGridService.gridName);
  }

  private getDetails(refresh = false) {
    this.showLoader = true;

    this.specificationDetailService
      .getSpecificationDetails(this.specificationUid)
      .pipe(
        concatMap((data) => {
          this.specificationDetailsInfo = {
            ...data,
            StartDate: UTCAsLocal(data.StartDate as string),
            EndDate: UTCAsLocal(data.EndDate as string)
          };

          this.isExecutionPhase = this.specificationDetailService.isInExecutionPhase(data.ProjectStatusId);
          this.isSpecificationEditable = this.specificationDetailService.isStatusBeforeComplete(data.StatusId);
          this.isUpdatesEditable = !this.specificationDetailService.isStatusClosed(data.StatusId);

          this.attachmentConfig = {
            Module_Code: this.moduleCode,
            Function_Code: this.functionCode,
            Key1: this.specificationDetailsInfo.TaskManagerUid
          };

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
        this.sectionsConfig = this.specificationDetailService.getSpecificationStepSectionsConfig(
          this.tmDetails,
          this.isSpecificationEditable,
          this.isUpdatesEditable
        );

        this.setMenu();
        this.setIsForceDisableClose(this.tmDetails.StatusId);

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
        if (this.selectedItems[eSpecificationDetailsPageMenuIds.PMSJobs].length === 0) {
          this.growlMessageService.setErrorMessage('No PMS Job selected to convert.');

          break;
        }
        this.subItemDetails = {
          dialogHeader: eSubItemsDialog.AddText,
          quantity: this.selectedItems[eSpecificationDetailsPageMenuIds.PMSJobs].length,
          pmsJobUid: this.selectedItems[eSpecificationDetailsPageMenuIds.PMSJobs].map((item) => item.uid)
        } as CreateSpecificationSubItemData;
        this.showEditSubItem = true;
        break;
      case eSpecificationDetailsPageMenuIds.Findings:
        if (this.selectedItems[eSpecificationDetailsPageMenuIds.Findings].length === 0) {
          this.growlMessageService.setErrorMessage('No Finding selected to convert.');

          break;
        }
        this.subItemDetails = {
          dialogHeader: eSubItemsDialog.AddText,
          quantity: this.selectedItems[eSpecificationDetailsPageMenuIds.Findings].length,
          findingUid: this.selectedItems[eSpecificationDetailsPageMenuIds.Findings].map((item) => item.uid)
        } as CreateSpecificationSubItemData;
        this.showEditSubItem = true;
        break;
      case eSpecificationDetailsPageMenuIds.SubItems:
        this.subItemDetails.dialogHeader = eSubItemsDialog.AddText;
        this.showEditSubItem = true;
        break;
      case eSpecificationDetailsPageMenuIds.SpecificationUpdates:
        this.specificationUpdatesComponent.showJobOrderForm();
        break;
      default:
        break;
    }
  }

  private checkValidStartEndDates(formValue) {
    return this.detailsService.checkValidStartEndDates(formValue?.StartDate, formValue?.EndDate);
  }

  private getMenuById(menus: IJbMenuItem[], id: eSpecificationDetailsPageMenuIds) {
    return this.detailsService.getMenuById(menus, id);
  }

  private hideSubMenuItem(parentMenu: IJbMenuItem, id: eSpecificationDetailsPageMenuIds) {
    this.detailsService.hideSubMenuItem(parentMenu, id);
  }

  private setMenu() {
    this.menu = cloneDeep(specificationDetailsMenuData);
    if (!this.isExecutionPhase) {
      const mainSection = this.getMenuById(this.menu, eSpecificationDetailsPageMenuIds.SpecificationDetails);
      this.hideSubMenuItem(mainSection, eSpecificationDetailsPageMenuIds.SpecificationUpdates);
    }
  }

  private setIsForceDisableClose(currentStatus: string) {
    this.isForceDisableClose = !this.isExecutionPhase && this.specificationDetailService.isStatusComplete(currentStatus);
  }
}
