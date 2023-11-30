import { cloneDeep } from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { ProjectTopDetailsService } from './project-top-details.service';
import { concatMap, finalize, takeUntil } from 'rxjs/operators';
import {
  AdvancedSettings,
  IJbDialog,
  IJbTextArea,
  ITopSectionFieldSet,
  ShowSettings,
  eGridColors,
  JbDetailsTopSectionComponent
} from 'jibe-components';

import { CurrentProjectService } from '../current-project.service';
import { TaskManagerService } from '../../../services/task-manager.service';
import { ProjectDetails, ProjectTopHeaderDetails } from '../../../models/interfaces/project-details';
import { eFunction } from '../../../models/enums/function.enum';
import { eModule } from '../../../models/enums/module.enum';
import { FormControl, FormGroup } from '@angular/forms';
import { getSmallPopup } from '../../../models/constants/popup';
import { of } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { DetailsService } from '../../../services/details.service';

export enum eProjectHeader3DotActions {
  Export = 'Export',
  Rework = 'Rework',
  Resync = 'Re-sync'
}

@Component({
  selector: 'jb-project-header',
  templateUrl: './project-header.component.html',
  styleUrls: ['./project-header.component.scss']
})
export class ProjectHeaderComponent extends UnsubscribeComponent implements OnInit {
  @Input() projectId: string;

  @ViewChild('detailsTopSection') detailsTopSection: JbDetailsTopSectionComponent;

  canEdit = false;

  detailedData: ProjectTopHeaderDetails;

  topFieldsConfig: ITopSectionFieldSet;

  loading = true;

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

  formGroup: FormGroup;

  isValueChange = false;

  threeDotsActionsShow: ShowSettings = {
    [eProjectHeader3DotActions.Export]: true,
    [eProjectHeader3DotActions.Rework]: true,
    [eProjectHeader3DotActions.Resync]: true,
    showDefaultLables: false
  };

  threeDotAction: eProjectHeader3DotActions = null;

  isWorkflowButtonEnable = true;

  nextWorkflowData: {
    dialogName: string;
    actionName: string;
    buttonDisplayName: string;
  };

  confirmationPopup: IJbDialog = { ...getSmallPopup(), dialogHeader: '' };

  isConfirmationPopupVisible = false;

  confirmationForm = new FormGroup({ textMessage: new FormControl('') });

  confirmationMessage = '';

  confirmationMessageSettings: IJbTextArea = {
    placeholder: 'Please provide remark',
    required: true,
    id: 'textMessage',
    rows: 4,
    cols: 6,
    maxlength: 300
  };

  confirmationPopupOkBtnLabel = 'OK';

  private get nextWorkflowTaskStatus(): string {
    return this.topDetailsService.getStatusFromWorkflowActionsJbComponent(this.nextWorkflowData.actionName);
  }

  private nextWorkFlowRightCode: string;

  private get isOffice(): 1 | 0 {
    return this.detailsService.isOffice();
  }

  private get currentTaskStatusCode(): string {
    return this.detailedData?.taskManager.status.code;
  }

  private set currentTaskStatusCode(val: string) {
    if (!this.detailedData) {
      return;
    }
    this.detailedData.taskManager.status.code = val;
    this.detailedData.ProjectStatusId = val;
    this.canEdit = this.topDetailsService.isStatusBeforeComplete(val);
  }

  constructor(
    private topDetailsService: ProjectTopDetailsService,
    private currentProject: CurrentProjectService,
    private taskManagerService: TaskManagerService,
    private titleService: Title,
    private detailsService: DetailsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.titleService.setTitle('');
    this.initDetailsData();
  }

  onSave() {
    this.save().subscribe();
  }

  onFormCreate(form: FormGroup) {
    this.formGroup = form;
  }

  onValueChange(form: FormGroup) {
    this.formGroup = form;
    if (form && form.dirty) {
      this.isValueChange = form.dirty;
    }
  }

  onThreeDotActionClicked(event: { type: string; payload: ProjectTopHeaderDetails }) {
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

  onGoToNextStatusClicked(actionName: string) {
    const confirmationMessage = 'Add Follow Up';
    this.confirmationPopup.dialogHeader = confirmationMessage;
    this.isConfirmationPopupVisible = true;
  }

  onCloseConfirmationPopup() {
    this.onConfirmationPopupCancel();
  }

  onConfirmationPopupOk() {
    const remark: string = this.confirmationForm.controls.textMessage.value;

    const payload = {
      uid: this.detailedData.TaskManagerUid,
      Office_ID: this.detailedData.officeId,
      Job_Short_Description: this.detailsTopSection.titleBoxContent.value,
      Vessel_ID: this.detailedData.VesselId,
      Is_Office: this.isOffice,
      wl_type: this.detailedData.ProjectTypeCode,
      vessel_uid: this.detailedData.VesselUid,
      raised_location: this.isOffice,
      task_status: this.nextWorkflowTaskStatus,
      right_code: this.nextWorkFlowRightCode
    };

    this.save()
      .pipe(concatMap(() => this.taskManagerService.transitionToNextWorkflowStatus(payload)))
      .subscribe((res) => {
        this.currentTaskStatusCode = payload.task_status;
        this.detailedData.ProjectStatusName = res.statusData?.[0].status_display_name;
        this.sendStatusChangeToWorkflowAndFollow(remark, this.currentTaskStatusCode, this.detailedData.ProjectStatusName);
        this.topFieldsConfig = this.topDetailsService.getTopSecConfig(this.detailedData);
        this.getNextWorkFlow(this.currentTaskStatusCode);
      });

    this.isConfirmationPopupVisible = false;
  }

  onConfirmationPopupCancel() {
    this.confirmationForm.reset();
    this.isConfirmationPopupVisible = false;
  }

  private save() {
    if (!this.formGroup) {
      return of(null);
    }

    return this.topDetailsService
      .save(this.projectId, {
        ...this.formGroup.value,
        Job_Short_Description: this.detailsTopSection.titleBoxContent.value
      })
      .pipe(finalize(() => (this.isValueChange = false)));
  }

  private initDetailsData() {
    this.loading = true;

    this.topDetailsService
      .getTopDetailsData(this.projectId)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => (this.loading = false))
      )
      .subscribe((data) => {
        this.topFieldsConfig = data.topFieldsConfig;

        this.detailedData = {
          ...data.detailedData,
          taskManager: { status: { code: null } },
          officeId: this.isOffice,
          vessel: { uid: data.detailedData.VesselUid },
          _id: data.detailedData.TaskManagerUid,
          functionCode: eFunction.Project, // fixme - clarify what to use
          moduleCode: eModule.Project // fixme - clarify what to use
        };

        this.titleService.setTitle(`${this.detailedData.ProjectTypeName} ${this.detailedData.ProjectCode}`);

        const projectId = data.detailedData.ProjectId;
        if (this.currentProject.initialProject$.getValue()?.ProjectId !== projectId) {
          this.currentProject.initialProject$.next(cloneDeep(data.detailedData));
        }

        this.initTaskManger(data.detailedData);
      });
  }

  private initTaskManger(savedProject: ProjectDetails) {
    this.taskManagerService
      .getWorkflow(savedProject.TaskManagerUid, savedProject.ProjectTypeCode)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.getNextWorkFlow(res?.task_status);
      });
  }

  private getNextWorkFlow(taskStatus: string): void {
    this.currentTaskStatusCode = taskStatus;

    const nextWorkFlowParams =
      `wlType=${this.detailedData.ProjectTypeCode}&taskUid=${this.detailedData.TaskManagerUid}&isOffice=${this.isOffice}&` +
      `jobStatus=${this.currentTaskStatusCode}&vesselId=${this.detailedData.VesselId}&officeId=${this.isOffice}`;

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
      actionName: this.topDetailsService.getStatusForWorkflowActionsJbComponent(actionName),
      buttonDisplayName: buttonName
    };
  }

  private sendStatusChangeToWorkflowAndFollow(remark: string, statusCode: string, statusName: string) {
    this.detailsService
      .sendStatusChangeToWorkflowAndFollow({
        uid: this.detailedData.ProjectId,
        function: eFunction.DryDock,
        module: eModule.Project,
        wlType: this.detailedData.ProjectTypeCode,
        statusCode,
        statusName,
        remark,
        jobCardNo: this.detailedData.ProjectCode,
        vesselId: this.detailedData.VesselId
      })
      .subscribe();
  }
}
