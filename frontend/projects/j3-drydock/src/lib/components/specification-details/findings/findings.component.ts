import { Component, Input, OnInit } from '@angular/core';
import { SpecificationDetails } from '../../../models/interfaces/specification-details';
import { TmLinkedRecordsRelationType } from 'jibe-components';
import { eFunction } from '../../../models/enums/function.enum';

@Component({
  selector: 'jb-findings',
  templateUrl: './findings.component.html',
  styleUrls: ['./findings.component.scss']
})
export class FindingsComponent implements OnInit {
  @Input() specificationDetailsInfo: SpecificationDetails;

  public details: any = {};
  public hiddenSegments: TmLinkedRecordsRelationType[] = [TmLinkedRecordsRelationType.Parent, TmLinkedRecordsRelationType.Child];
  public entitySelectionEnabledSegments = [TmLinkedRecordsRelationType.Related];
  public additionalEntityMenuOptions = [{ name: 'unlink', label: 'Unlink' }];

  validTaskManagerJobTypes: string[] = ['pms_job'];

  constructor() {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method, @typescript-eslint/no-empty-function
  ngOnInit(): void {
    this.details = {
      // uid: 'C7B9F9D9-A034-416D-9DEF-D15DB1A8044B',
      function_code: "portage_bill",
      uid: this.specificationDetailsInfo.TaskManagerUid,
      // function_code: eFunction.SpecificationDetails
    };
  }

  childRecordEvents(event: string): void {
    console.clear();
    console.log('*******Linking events', event);
  }

  entitySelectionChanged(event: string): void {
    console.log('*******Entity selection changed', event);
  }

  entityMenuOptionSelected(event: string): void {
    console.log('*******Entity menu option selected', event);
  }
}
