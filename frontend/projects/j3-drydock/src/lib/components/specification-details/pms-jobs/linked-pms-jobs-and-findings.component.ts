import { Component, Input, OnInit, Output } from '@angular/core';
import { SpecificationDetails } from '../../../models/interfaces/specification-details';
import { ITaskManagerLinkingComponentSelectionEvent, TmLinkedRecordsRelationType } from 'jibe-components';
import { TmLinkedRecords } from 'jibe-components/lib/interfaces/tm-linked-records.interface';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'jb-linked-pms-jobs-findings',
  templateUrl: './linked-pms-jobs-and-findings.component.html',
  styleUrls: ['./linked-pms-jobs-and-findings.component.scss']
})
export class LinkedPmsJobsAndFindingsComponent implements OnInit {
  @Input() specificationDetailsInfo: SpecificationDetails;
  @Input() validTaskType = '';
  @Output() updateSelectedAmount = new BehaviorSubject<number>(0);

  public details = {};
  public hiddenSegments: string[] = [TmLinkedRecordsRelationType.Parent, TmLinkedRecordsRelationType.Child];
  public entitySelectionEnabledSegments = [TmLinkedRecordsRelationType.Related];
  public additionalEntityMenuOptions = {
    [TmLinkedRecordsRelationType.Parent]: [],
    [TmLinkedRecordsRelationType.Child]: [],
    [TmLinkedRecordsRelationType.Related]: []
  };

  public validJobTypes = {};

  selectedEntity: TmLinkedRecords[] = [];
  unSelectedEntity: TmLinkedRecords[] = [];

  constructor() {}

  ngOnInit(): void {
    this.validJobTypes = {
      [TmLinkedRecordsRelationType.Related]: [{ taskType: this.validTaskType }]
    };

    this.details = {
      WL_TYPE: 'master_review',
      module_code: 'tm_master_review',
      function_code: 'tm_master_review_detail',
      uid: this.specificationDetailsInfo.TaskManagerUid,
      Vessel_Name: this.specificationDetailsInfo.VesselName,
      Vessel_ID: this.specificationDetailsInfo.VesselId,
      vessel_uid: this.specificationDetailsInfo.VesselUid
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectionValidator = (changedEntities: ITaskManagerLinkingComponentSelectionEvent): Promise<boolean> => {
    //TODO: Add validation logic here

    return Promise.resolve(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  childRecordEvents(event: string): void {
    //TODO: Add validation logic here
  }

  entitySelectionChanged(event: { [key in TmLinkedRecordsRelationType]?: TmLinkedRecords[] }): void {
    this.selectedEntity = event.Related;

    const count = event?.Related?.length || 0;
    this.updateSelectedAmount.next(count);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  entityMenuOptionSelected(event: string): void {
    //TODO: Add validation logic here
  }
}
