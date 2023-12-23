import { Component, Input, OnInit, Output } from '@angular/core';
import { SpecificationDetails, SpecificationDetailsFull } from '../../../models/interfaces/specification-details';
import { eFunction } from '../../../models/enums/function.enum';
import { TmLinkedRecordsRelationType } from 'jibe-components';
import { TmLinkedRecords } from 'jibe-components/lib/interfaces/tm-linked-records.interface';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'jb-linked-pms-jobs-findings',
  templateUrl: './linked-pms-jobs-and-findings.component.html',
  styleUrls: ['./linked-pms-jobs-and-findings.component.scss']
})
export class LinkedPmsJobsAndFindingsComponent implements OnInit {
  @Input() specificationDetailsInfo: SpecificationDetails;
  @Output() updateSelectedAmount = new BehaviorSubject<number>(0);

  public tmDetails: any = {};
  public hiddenSegments: TmLinkedRecordsRelationType[] = [TmLinkedRecordsRelationType.Parent, TmLinkedRecordsRelationType.Child];
  public entitySelectionEnabledSegments = [TmLinkedRecordsRelationType.Related];
  public additionalEntityMenuOptions = [{ name: 'unlink', label: 'Unlink' }];

  validTaskManagerJobTypes: string[] = ['pms_job'];

  constructor() {}

  ngOnInit(): void {
    this.tmDetails = {
      uid: this.specificationDetailsInfo.TaskManagerUid,
      function_code: eFunction.SpecificationDetails
    };
  }

  childRecordEvents(event: string): void {
    console.clear();
    console.log('*******Linking events', event);
  }

  entitySelectionChanged(event: { Parent?: TmLinkedRecords[]; Child?: TmLinkedRecords[]; Related?: TmLinkedRecords[] }): void {
    const count = event?.Related?.length || 0;
    this.updateSelectedAmount.next(count);
    console.log('*******Entity selection changed', event);
  }

  entityMenuOptionSelected(event: { type?: string; payload?: any }): void {
    console.log('*******Entity menu option selected', event);
  }
}
