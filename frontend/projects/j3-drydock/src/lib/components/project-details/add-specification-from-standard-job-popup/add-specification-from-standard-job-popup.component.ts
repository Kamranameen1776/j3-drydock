import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { getSmallPopup } from '../../../models/constants/popup';
import { eGridRefreshType, eJbTreeEvents, GridService, IJbDialog } from 'jibe-components';
import { SpecificationFormComponent } from '../specification-form/specification-form.component';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { BehaviorSubject } from 'rxjs';
import { FunctionsFlatTreeNode } from '../../../models/interfaces/functions-tree-node';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { StandardJobsService } from '../../../services/standard-jobs.service';
import { SpecificationDetailsService } from '../../../services/specification-details/specification-details.service';
import { StandardJobResult } from '../../../models/interfaces/standard-jobs';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { GrowlMessageService } from '../../../services/growl-message.service';

export enum eAddSpecificationFromStandardJobPopupType {
  Specification = 'Specification',
  ProjectTemplate = 'ProjectTemplate'
}

@Component({
  selector: 'jb-add-specification-from-standard-job-popup',
  templateUrl: './add-specification-from-standard-job-popup.component.html',
  styleUrls: ['./add-specification-from-standard-job-popup.component.scss']
})
export class AddSpecificationFromStandardJobPopupComponent extends UnsubscribeComponent implements OnInit {
  @Input() isOpen: boolean;
  @Input() vesselType: number;
  @Input() projectUid: string;
  @Input() treeData: FunctionsFlatTreeNode[];
  @Input() excludeUids: string[];

  @Input() type = eAddSpecificationFromStandardJobPopupType.Specification;

  @Output() closeDialog = new EventEmitter<StandardJobResult[]>();

  @ViewChild(SpecificationFormComponent) popupForm: SpecificationFormComponent;

  readonly popupConfig: IJbDialog = { ...getSmallPopup(), dialogWidth: 1000, dialogHeader: 'Standard Jobs' };

  eventsList = [eJbTreeEvents.NodeSelect, eJbTreeEvents.Select, eJbTreeEvents.UnSelect];

  isPopupValid$ = new BehaviorSubject<boolean>(false);
  isSaving$ = new BehaviorSubject<boolean>(false);

  functionUIDs: string[] = [];
  gridData: GridInputsWithRequest;
  selected = [];
  // eslint-disable-next-line dot-notation
  private maxJobsNum = window['environment']?.['maxStandardJobsNum'] || 75;

  constructor(
    private standardJobsService: StandardJobsService,
    private gridService: GridService,
    private specificationService: SpecificationDetailsService,
    private growlMessageService: GrowlMessageService
  ) {
    super();
  }

  ngOnInit() {
    this.gridData = this.getData();
  }

  onCancel() {
    this.selected = [];
    this.closePopup();
  }

  onSubmit() {
    this.save();
  }

  setNodeData(event) {
    if (event?.type === eJbTreeEvents.NodeSelect) {
      this.functionUIDs = [...this.functionUIDs, event.payload.Child_ID];
      this.gridData = this.getData();
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridData.gridName);
    } else if (event?.type === eJbTreeEvents.UnSelect) {
      this.functionUIDs = this.functionUIDs.filter((uid) => uid !== event.payload.Child_ID);
      this.gridData = this.getData();
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridData.gridName);
    }
  }

  onSelect(rows: []) {
    this.selected = rows;
    this.isPopupValid$.next(rows.length > 0);
  }

  private closePopup() {
    this.closeDialog.emit(this.selected);
    this.isPopupValid$.next(false);
    this.popupForm?.formGroup.reset();
  }

  private save() {
    const selectedUids = this.selected.map((row) => row.uid);

    if (selectedUids.length > this.maxJobsNum) {
      this.growlMessageService.setErrorMessage(`You can select up to ${this.maxJobsNum} standard jobs`);
      return;
    }

    switch (this.type) {
      case eAddSpecificationFromStandardJobPopupType.Specification:
        this.saveCreateSpecificationsFromStandardJobs(selectedUids);
        break;

      case eAddSpecificationFromStandardJobPopupType.ProjectTemplate:
        this.closePopup();
        break;

      default:
        break;
    }
  }

  private getData() {
    return this.standardJobsService.getStandardJobPopupGridData(this.vesselType, this.functionUIDs, this.excludeUids);
  }

  private saveCreateSpecificationsFromStandardJobs(selectedUids: string[]) {
    this.isSaving$.next(true);
    this.specificationService
      .createSpecificationFromStandardJob(this.projectUid, selectedUids)
      .pipe(
        finalize(() => {
          this.isSaving$.next(false);
        })
      )
      .subscribe(() => this.closePopup());
  }
}
