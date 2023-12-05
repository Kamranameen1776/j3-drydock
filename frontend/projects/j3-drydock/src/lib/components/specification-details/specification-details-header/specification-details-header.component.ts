import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SpecificationDetailsHeaderInputservice } from './specification-details-header-inputs';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { FormControl, FormGroup } from '@angular/forms';
import {
  AdvancedSettings,
  ITopSectionFieldSet,
  JbDetailsTopSectionComponent,
  ShowSettings,
  UserService,
  eAppLocation,
  eGridColors
} from 'jibe-components';
import { SpecificationDetails, SpecificationDetailsTopHeaderDetails } from '../../../models/interfaces/specification-details';
import { eFunction } from '../../../models/enums/function.enum';
import { eModule } from '../../../models/enums/module.enum';
import { TaskManagerService } from '../../../services/task-manager.service';

export enum eProjectHeader3DotActions {
  Export = 'Export',
  Rework = 'Rework',
  Resync = 'Re-sync'
}
@Component({
  selector: 'jb-specification-details-header',
  templateUrl: './specification-details-header.component.html',
  styleUrls: ['./specification-details-header.component.scss'],
  providers: [SpecificationDetailsHeaderInputservice]
})
export class SpecificationDetailsHeaderComponent extends UnsubscribeComponent implements OnInit {
  @ViewChild('detailsTopSection') detailsTopSection: JbDetailsTopSectionComponent;

  @Input() specificationDetailsInfo: SpecificationDetails;
  @Input() isValueChange: boolean;
  @Output() saveButtonClick = new EventEmitter<FormGroup>();

  saveButtonDisabled = true;
  topDetailsData: SpecificationDetailsTopHeaderDetails;
  topFieldsConfig: ITopSectionFieldSet;
  isWorkflowButtonEnable = true;
  formGroup: FormGroup;
  private nextWorkFlowRightCode: string;
  canEdit = true;
  confirmationForm = new FormGroup({ textMessage: new FormControl('') });
  isConfirmationPopupVisible = false;

  threeDotsActionsShow: ShowSettings = {
    [eProjectHeader3DotActions.Export]: true,
    [eProjectHeader3DotActions.Rework]: true,
    [eProjectHeader3DotActions.Resync]: true,
    showDefaultLables: false
  };

  threeDotsActions: AdvancedSettings[] = [
    {
      show: true,
      color: eGridColors.JbBlack,
      label: eProjectHeader3DotActions.Export
    },
    {
      show: true,
      color: eGridColors.JbBlack,
      label: eProjectHeader3DotActions.Rework
    },
    {
      show: true,
      color: eGridColors.JbBlack,
      label: eProjectHeader3DotActions.Resync
    }
  ];

  threeDotAction: eProjectHeader3DotActions = null;

  nextWorkflowData: {
    dialogName: string;
    actionName: string;
    buttonDisplayName: string;
  };

  private get nextWorkflowTaskStatus(): string {
    return this.headerInputService.getStatusFromWorkflowActionsJbComponent(this.nextWorkflowData.actionName);
  }

  private get isOffice(): 1 | 0 {
    return UserService.getUserDetails().AppLocation === eAppLocation.Office ? 1 : 0;
  }

  private get currentTaskStatusCode(): string {
    return this.topDetailsData?.taskManager.status.code;
  }

  private set currentTaskStatusCode(val: string) {
    if (!this.specificationDetailsInfo) {
      return;
    }
    this.topDetailsData.taskManager.status.code = val;
    this.topDetailsData.StatusId = val;
  }

  constructor(
    private readonly headerInputService: SpecificationDetailsHeaderInputservice,
    private taskManagerService: TaskManagerService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.initSpecificatioDetailsData();
  }

  private initSpecificatioDetailsData() {
    this.headerInputService
      .getInputs(this.specificationDetailsInfo)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.topFieldsConfig = data.topFieldsConfig;

        this.topDetailsData = {
          ...data.detailedData,
          taskManager: { status: { code: null } },
          officeId: this.isOffice,
          vessel: { uid: data.detailedData.VesselUid },
          _id: data.detailedData.TaskManagerUid,
          functionCode: eFunction.Project, // TODO: - clarify what to use
          moduleCode: eModule.Project // TODO: - clarify what to use
        };

        this.initTaskManger(data.detailedData);
      });
  }

  private initTaskManger(specificationDetails: SpecificationDetails) {
    this.taskManagerService
      .getWorkflow(specificationDetails.TaskManagerUid, specificationDetails.SpecificationTypeCode)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.getNextWorkFlow(res?.task_status);
      });
  }

  private getNextWorkFlow(taskStatus: string): void {
    this.currentTaskStatusCode = taskStatus;

    const nextWorkFlowParams =
      `wlType=${this.topDetailsData.SpecificationTypeCode}&taskUid=${this.topDetailsData.TaskManagerUid}&isOffice=${this.isOffice}&` +
      `jobStatus=${this.currentTaskStatusCode}&vesselId=${this.topDetailsData.VesselId}&officeId=${this.isOffice}`;

    this.taskManagerService
      .getNextTaskManagerState(nextWorkFlowParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((nextWorkFlow) => {
        this.setWorkflowActionsData(nextWorkFlow.Display_name_action, nextWorkFlow.Display_name_pass);
        this.setThreeDotsActionsShow(nextWorkFlow.is_rework);
        this.setNextWorkflowRightCode(nextWorkFlow.Display_name_action, nextWorkFlow.right_code);
      });
  }

  private setThreeDotsActionsShow(canBeReworked: boolean) {
    this.threeDotsActionsShow = {
      ...this.threeDotsActionsShow,
      [eProjectHeader3DotActions.Rework]: canBeReworked
    };
  }

  private setNextWorkflowRightCode(actionName: string, rightCode: string) {
    // TODO check if this is correct and for each granted access right per action must assign it here, othewise clear it
    this.nextWorkFlowRightCode = rightCode;
  }

  private setWorkflowActionsData(actionName: string, buttonName: string) {
    this.nextWorkflowData = {
      dialogName: buttonName,
      actionName: this.headerInputService.getStatusForWorkflowActionsJbComponent(actionName),
      buttonDisplayName: buttonName
    };
  }

  onThreeDotActionClicked(event: { type: string; payload: SpecificationDetailsTopHeaderDetails }) {
    if (!event) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (event.type) {
      case eProjectHeader3DotActions.Export:
        this.threeDotAction = event.type;
        // TODO method to export
        break;
      // for some reason only this action is transformed to lowercase in jb-components
      case eProjectHeader3DotActions.Rework.toLowerCase():
        this.threeDotAction = eProjectHeader3DotActions.Rework;
        break;
    }
  }

  onValueChange(form: FormGroup) {
    this.formGroup = form;

    if (form && form.dirty && !this.isValueChange) {
      this.isValueChange = form.dirty;
    }
  }

  onSave(): void {
    this.saveButtonClick.emit(this.formGroup);
    this.isValueChange = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onGoToNextStatusClicked(actionName: string) {
    // TODO remove it once we have a requirements for steps
    this.onConfirmationPopupOk();
    // TODO uncomment it
    // const confirmationMessage = 'Add Follow Up';
    // this.confirmationPopup.dialogHeader = confirmationMessage;
    // this.isConfirmationPopupVisible = true;
  }

  onCloseConfirmationPopup() {
    this.onConfirmationPopupCancel();
  }

  onConfirmationPopupOk() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const remark: string = this.confirmationForm.controls.textMessage.value;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const payload = {
      uid: this.topDetailsData.TaskManagerUid,
      Office_ID: this.topDetailsData.officeId,
      Job_Short_Description: this.detailsTopSection.titleBoxContent.value,
      Vessel_ID: this.topDetailsData.VesselId,
      Is_Office: this.isOffice,
      wl_type: this.topDetailsData.SpecificationTypeCode,
      vessel_uid: this.topDetailsData.VesselUid,
      raised_location: this.isOffice,
      task_status: this.nextWorkflowTaskStatus,
      right_code: this.nextWorkFlowRightCode
    };
  }

  onConfirmationPopupCancel() {
    this.confirmationForm.reset();
    this.isConfirmationPopupVisible = false;
  }
}
