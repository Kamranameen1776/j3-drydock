import { Component, Input, OnInit } from '@angular/core';
import { SpecificationDetails } from '../../../models/interfaces/specification-details';
import {
  DynamicComponentsRegistryService,
  ITaskManagerLinkingComponentSelectionEvent,
  TaskManagerRegistyService,
  TmLinkedRecordsRelationType
} from 'jibe-components';
import { TmLinkedRecords } from 'jibe-components/lib/interfaces/tm-linked-records.interface';

@Component({
  selector: 'jb-pms-jobs',
  templateUrl: './pms-jobs.component.html',
  styleUrls: ['./pms-jobs.component.scss']
})
export class PmsJobsComponent implements OnInit {
  @Input() specificationDetailsInfo: SpecificationDetails;

  public details = {};
  public hiddenSegments: string[] = [TmLinkedRecordsRelationType.Parent, TmLinkedRecordsRelationType.Child];
  public entitySelectionEnabledSegments = [TmLinkedRecordsRelationType.Related];
  public additionalEntityMenuOptions = [{ name: 'unlink', label: 'Unlink' }];

  public validJobTypes = {
    [TmLinkedRecordsRelationType.Related]: [{ taskType: 'PMS JOB' }]
  };

  selectedEntity: TmLinkedRecords[] = [];
  unSelectedEntity: TmLinkedRecords[] = [];

  constructor() {}

  ngOnInit(): void {
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

  selectionValidator = (changedEntities: ITaskManagerLinkingComponentSelectionEvent): Promise<boolean> => {
    console.log('*******Linking validator', changedEntities);

    return Promise.resolve(true);
  };

  childRecordEvents(event: string): void {
    console.log('*******Linking events', event);
  }

  entitySelectionChanged(event: { [key in TmLinkedRecordsRelationType]?: TmLinkedRecords[] }): void {
    this.selectedEntity = event.Related;

    console.log('*******Entity selection changed', event);
    console.log('*******Entity selected', this.selectedEntity);
  }

  entityMenuOptionSelected(event: string): void {
    console.log('*******Entity menu option selected', event);
  }
}
