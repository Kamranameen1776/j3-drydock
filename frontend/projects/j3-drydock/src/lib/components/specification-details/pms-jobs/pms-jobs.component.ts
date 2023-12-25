import { Component, Input, OnInit } from '@angular/core';
import { SpecificationDetails } from '../../../models/interfaces/specification-details';
import { eFunction } from '../../../models/enums/function.enum';
import { eModule } from '../../../models/enums/module.enum';
import { TmLinkedRecordsRelationType } from 'jibe-components';

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

  validTaskManagerJobTypes: string[] = ['pms_job'];

  constructor() {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method, @typescript-eslint/no-empty-function
  ngOnInit(): void {
    this.details = {
      // uid: 'B94DCAC7-87B6-4570-AA84-4307106A1994', //parent uid
      // Vessel_Name: 'Akashiano', //parent vessel name
      // Vessel_ID: 904, //parent vessel ID
      // vessel_uid: 'F9EAF49F-8428-42F7-B2C5-71AA66E10D91', //parrent vessel uid
      WL_TYPE: 'master_review', //parent worklist type
      module_code: 'tm_master_review', //parent module code
      function_code: 'tm_master_review_detail', // parent fnction code
      uid: this.specificationDetailsInfo.TaskManagerUid,
      // function_code: eFunction.SpecificationDetails,
      Vessel_Name: this.specificationDetailsInfo.VesselName, //parent vessel name
      Vessel_ID: this.specificationDetailsInfo.VesselId, //parent vessel ID
      vessel_uid: this.specificationDetailsInfo.VesselUid, //parent vessel uid
      // WL_TYPE: this.specificationDetailsInfo.SpecificationTypeCode, //parent worklist type
      // module_code: eModule.Project //parent module code
    };
  }

  childRecordEvents(event: string): void {
    console.log('*******Linking events', event);
  }

  entitySelectionChanged(event: string): void {
    console.log('*******Entity selection changed', event);
  }

  entityMenuOptionSelected(event: string): void {
    console.log('*******Entity menu option selected', event);
  }
}
