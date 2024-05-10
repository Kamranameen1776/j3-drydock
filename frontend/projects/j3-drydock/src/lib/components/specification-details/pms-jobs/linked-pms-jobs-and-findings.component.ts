import { Component, Input, OnInit, Output } from '@angular/core';
import { SpecificationDetails } from '../../../models/interfaces/specification-details';
import { TmLinkedRecordsRelationType } from 'jibe-components';
import { TmLinkedRecords, TmSelectedMenuOption } from 'jibe-components/lib/interfaces/tm-linked-records.interface';
import { BehaviorSubject } from 'rxjs';
import { ePmsWlType, TmJobTypes } from '../../../models/enums/specification-details.enum';
import { ITaskManagerLinkingComponentLinkingChangedEvent, ITaskMangerDetails } from 'jibe-components/lib/interfaces/task-manager-interface';
import { SpecificationDetailsService } from '../../../services/specification-details/specification-details.service';
import { GrowlMessageService } from '../../../services/growl-message.service';

@Component({
  selector: 'jb-linked-pms-jobs-findings',
  templateUrl: './linked-pms-jobs-and-findings.component.html',
  styleUrls: ['./linked-pms-jobs-and-findings.component.scss']
})
export class LinkedPmsJobsAndFindingsComponent implements OnInit {
  @Input() isEditable: boolean;
  @Input() specificationDetailsInfo: SpecificationDetails;
  @Input() validTaskType = '';
  @Output() updateSelectedAmount = new BehaviorSubject<TmLinkedRecords[]>([]);

  public details: ITaskMangerDetails;
  public hiddenSegments: TmLinkedRecordsRelationType[] = [TmLinkedRecordsRelationType.Parent, TmLinkedRecordsRelationType.Child];
  public entitySelectionEnabledSegments = [TmLinkedRecordsRelationType.Related];
  public additionalEntityMenuOptions = {
    [TmLinkedRecordsRelationType.Parent]: [],
    [TmLinkedRecordsRelationType.Child]: [],
    [TmLinkedRecordsRelationType.Related]: []
  };

  public validJobTypes: Record<TmLinkedRecordsRelationType, { taskType: string }[]> = {
    [TmLinkedRecordsRelationType.Related]: [],
    [TmLinkedRecordsRelationType.Parent]: [],
    [TmLinkedRecordsRelationType.Child]: []
  };

  selectedEntity: TmLinkedRecords[] = [];
  unSelectedEntity: TmLinkedRecords[] = [];
  pmsWlType = ePmsWlType;

  constructor(
    private specificationService: SpecificationDetailsService,
    private growlService: GrowlMessageService
  ) {}

  ngOnInit(): void {
    if (this.validTaskType === ePmsWlType.Findings) {
      this.validJobTypes[TmLinkedRecordsRelationType.Related] = [
        { taskType: TmJobTypes.NonPmsJob },
        { taskType: TmJobTypes.NonPmsNcr },
        { taskType: TmJobTypes.Recommendations },
        { taskType: TmJobTypes.VettingObservation },
        { taskType: TmJobTypes.Findings }
      ];
    } else {
      this.validJobTypes[TmLinkedRecordsRelationType.Related] = [{ taskType: this.validTaskType }];
    }

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

  selectionValidator = async (changes: ITaskManagerLinkingComponentLinkingChangedEvent) => {
    const validations = await Promise.all(
      changes.unlinkedEntities.map((item) => {
        switch (item.type) {
          case TmJobTypes.PmsJob:
            return this.specificationService.validatePmsJobDeletion(item.id, this.specificationDetailsInfo.uid).toPromise();
          case TmJobTypes.Findings:
          case TmJobTypes.NonPmsJob:
          case TmJobTypes.NonPmsNcr:
          case TmJobTypes.VettingObservation:
          case TmJobTypes.Recommendations:
            return this.specificationService.validateFindingDeletion(item.id, this.specificationDetailsInfo.uid).toPromise();
          default:
            return true;
        }
      })
    );

    const result = validations.every((item) => item);

    if (!result) {
      this.growlService.setErrorMessage('Cannot unlink entities that have attached sub-items');
    }

    return result;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  childRecordEvents(event: string): void {
    //TODO: Add validation logic here
  }

  entitySelectionChanged(event: { [key in TmLinkedRecordsRelationType]?: TmLinkedRecords[] }): void {
    this.selectedEntity = event.Related;

    const items = event?.Related || [];
    this.updateSelectedAmount.next(items);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  entityMenuOptionSelected(event: TmSelectedMenuOption): void {
    //TODO: Add validation logic here
  }
}
