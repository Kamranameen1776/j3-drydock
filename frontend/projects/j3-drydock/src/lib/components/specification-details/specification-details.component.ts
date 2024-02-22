import { cloneDeep } from 'lodash';
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  SpecificationDetailAccessRights,
  SpecificationDetailsService
} from '../../services/specification-details/specification-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ePmsWlType, eSpecificationDetailsPageMenuIds, specificationDetailsMenuData } from '../../models/enums/specification-details.enum';
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
  providers: [JbDatePipe, GrowlMessageService]
})
export class SpecificationDetailsComponent extends UnsubscribeComponent implements OnInit, OnDestroy {
  @ViewChild('specificationUpdatesComponent') specificationUpdatesComponent: SpecificationUpdatesComponent;

  @ViewChild('specificationDetails') specificationDetails: ElementRef;
  @ViewChild('generalInformation') generalInformation: ElementRef;
  @ViewChild('subItems') subItems: ElementRef;
  @ViewChild('pmsJobs') pmsJobs: ElementRef;
  @ViewChild('findings') findings: ElementRef;
  @ViewChild('specificationUpdates') specificationUpdates: ElementRef;

  specificationDetailsInfo: SpecificationDetails;
  updateSpecificationDetailsInfo: UpdateSpecificationDetailsDto;
  specificationUid: string;
  attachmentConfig: IJbAttachment;
  detailForm: FormGroup;

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

  private isExecutionPhase = false;

  pmsWlType = ePmsWlType;

  menu = cloneDeep(specificationDetailsMenuData);
  readonly eSideMenuId = eSpecificationDetailsPageMenuIds;

  eSpecificationDetailsPageMenuIds = eSpecificationDetailsPageMenuIds;

  private formValuesSub: Subscription;

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

  dispatchGeneralInformationForm(form: FormGroup) {
    this.detailForm = form;

    this.formValuesSub?.unsubscribe();

    this.formValuesSub = this.detailForm.valueChanges.subscribe(() => {
      this.jbTMDtlSrv.isUnsavedChanges.next(true);
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

    this.showLoader = true;

    const detailForm = this.detailForm?.value.generalInformation;

    this.jbTMDtlSrv.isAllSectionsValid.next(true);

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

    try {
      this.specificationDetailService
        .updateSpecification(data)
        .toPromise()
        .then(() => {
          this.growlMessageService.setErrorMessage('Specification has been updated successfully');
          this.jbTMDtlSrv.isUnsavedChanges.next(false);
          this.getDetails(true);
        });
    } catch (err) {
      this.jbTMDtlSrv.isUnsavedChanges.next(false);
      this.growlMessageService.setErrorMessage(err.error);
      this.showLoader = false;
    }
  }

  updateSelectedAmount(items: TmLinkedRecords[], type: eSpecificationDetailsPageMenuIds) {
    this.selectedItems[type] = items;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  closeDialog(isSaved: boolean) {
    this.showEditSubItem = false;
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
        this.sectionsConfig = this.specificationDetailService.getSpecificationStepSectionsConfig(this.tmDetails);

        this.setMenu();

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
}
