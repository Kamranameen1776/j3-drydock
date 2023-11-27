/* eslint-disable no-console */
import { Component, OnInit, ViewChild } from '@angular/core';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { ProjectTopDetailsService } from '../../services/project/project-top-details.service';
import { concatMap, finalize, takeUntil } from 'rxjs/operators';
import {
  AdvancedSettings,
  IJbDialog,
  IJbTextArea,
  ITopSectionFieldSet,
  ShowSettings,
  UserService,
  eAppLocation,
  eGridColors,
  JbDetailsTopSectionComponent
} from 'jibe-components';

import { CurrentProjectService } from '../project-details/current-project.service';
import { TaskManagerService } from '../../services/task-manager.service';
import { ProjectDetails, ProjectTopHeaderDetails } from '../../models/interfaces/project-details';
import { eFunction } from '../../models/enums/function.enum';
import { eModule } from '../../models/enums/module.enum';
import { FormControl, FormGroup } from '@angular/forms';
import { NextWorkflow } from '../../models/interfaces/task-manager';
import { getSmallPopup } from '../../models/constants/popup';
import { of } from 'rxjs';

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
  @ViewChild('detailsTopSection') detailsTopSection: JbDetailsTopSectionComponent;

  canEdit = true;

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

  private nextWorkFlowRightCode: string;

  private get isOffice(): 1 | 0 {
    return UserService.getUserDetails().AppLocation === eAppLocation.Office ? 1 : 0;
  }

  private get currentTaskStatus(): string {
    return this.detailedData?.taskManager.status.code;
  }

  private set currentTaskStatus(val: string) {
    if (!this.detailedData) {
      return;
    }
    this.detailedData.taskManager.status.code = val;
  }

  constructor(
    private topDetailsService: ProjectTopDetailsService,
    private currentProject: CurrentProjectService,
    private taskManagerService: TaskManagerService
  ) {
    super();
  }

  ngOnInit(): void {
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

    console.log(event);

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
    console.log(actionName);
    const confirmationMessage = 'Add Follow Up';

    this.confirmationPopup.dialogHeader = confirmationMessage;

    this.isConfirmationPopupVisible = true;
  }

  onCloseConfirmationPopup() {
    this.onConfirmationPopupCancel();
  }

  onConfirmationPopupOk() {
    const remark: string = this.confirmationForm.controls.textMessage.value;
    console.log(remark);

    const payload = {
      uid: this.detailedData.TaskManagerUid,
      Office_ID: this.detailedData.officeId,
      Job_Short_Description: this.detailsTopSection.titleBoxContent.value,
      Vessel_ID: this.detailedData.VesselId,
      Is_Office: this.isOffice,
      wl_type: this.detailedData.ProjectTypeCode,
      vessel_uid: this.detailedData.VesselUid,
      raised_location: this.isOffice,
      task_status: this.nextWorkflowData.actionName,
      right_code: this.nextWorkFlowRightCode
    };

    this.save()
      .pipe(concatMap(() => this.taskManagerService.transitionToNextWorkflowStatus(payload)))
      .subscribe();

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

    const projectId = this.currentProject.projectId$.getValue();

    return this.topDetailsService
      .save(projectId, {
        ...this.formGroup.value,
        Job_Short_Description: this.detailsTopSection.titleBoxContent.value
      })
      .pipe(finalize(() => (this.isValueChange = false)));
  }

  private initDetailsData() {
    const projectId = this.currentProject.projectId$.getValue();

    this.loading = true;

    this.topDetailsService
      .getTopDetailsData(projectId)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => (this.loading = false))
      )
      .subscribe((data) => {
        this.topFieldsConfig = data.topFieldsConfig;

        this.detailedData = {
          ...data.detailedData,
          taskManager: { status: { code: null } }, // task_status
          officeId: this.isOffice, // don't change
          vessel: { uid: data.detailedData.VesselUid }, // don't change
          _id: data.detailedData.TaskManagerUid, // uid, don't change
          functionCode: eFunction.Project, // fixme - clarify what to use
          moduleCode: eModule.Project // fixme - clarify what to use
        };

        this.currentProject.savedProject$.next(data.detailedData);
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
    this.currentTaskStatus = taskStatus;

    const nextWorkFlowParams =
      `wlType=${this.detailedData.ProjectTypeCode}&taskUid=${this.detailedData.TaskManagerUid}&isOffice=${this.isOffice}&` +
      `jobStatus=${this.currentTaskStatus}&vesselId=${this.detailedData.VesselId}&officeId=${this.isOffice}`;

    this.taskManagerService
      .getNextTaskManagerState(nextWorkFlowParams)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((nextWorkFlow) => {
        console.log(nextWorkFlow);

        this.setWorkflowActionsData(nextWorkFlow);
        this.setThreeDotsActionsShow(nextWorkFlow);
        this.setNextWorkflowRightCode(nextWorkFlow);
      });
  }

  private setThreeDotsActionsShow(nextWorkFlow: NextWorkflow) {
    const canBeReworked = nextWorkFlow.is_rework;

    this.threeDotsActionsShow = {
      ...this.threeDotsActionsShow,
      [eProjectHeader3DotActions.Rework]: canBeReworked
    };
  }

  private setNextWorkflowRightCode(nextWorkFlow: NextWorkflow) {
    // TODO check if this is correct and for each granted access right per action must assign it here, othewise clear it
    this.nextWorkFlowRightCode = nextWorkFlow.right_code;
  }

  private setWorkflowActionsData(nextWorkFlow: NextWorkflow) {
    this.nextWorkflowData = {
      dialogName: nextWorkFlow.Display_name_pass,
      actionName: nextWorkFlow.Display_name_action,
      buttonDisplayName: nextWorkFlow.Display_name_pass
    };
  }
}
