import { Component, Input, OnInit } from '@angular/core';
import { SpecificationDetails } from '../../../models/interfaces/specification-details';
import {
  DynamicComponentsRegistryService,
  TmLinkedRecordsRelationType,
  TaskManagerRegistyService,
  ITaskManagerLinkingComponentEntity,
  ITaskManagerLinkingComponentLinkingChangedEvent,
  ITaskManagerLinkingComponentSelectionEvent,
  ITaskManagerLinkingComponentLinkingChangedEventValidation
} from 'jibe-components';
import { eFunction } from '../../../models/enums/function.enum';
import { eModule } from '../../../models/enums/module.enum';
import { TmLinkedRecords } from 'jibe-components/lib/interfaces/tm-linked-records.interface';
// import { TaskManagerRegistyService } from 'jibe-components';

// import { TaskManagerRegistyService } from './dynamic-components/task-manager-registry-service';

@Component({
  selector: 'jb-findings',
  templateUrl: './findings.component.html',
  styleUrls: ['./findings.component.scss']
})
export class FindingsComponent implements OnInit {
  @Input() specificationDetailsInfo: SpecificationDetails;

  public details = {};
  public hiddenSegments: string[] = [TmLinkedRecordsRelationType.Parent, TmLinkedRecordsRelationType.Child];
  public entitySelectionEnabledSegments = [TmLinkedRecordsRelationType.Related];
  public additionalEntityMenuOptions = [{ name: 'unlink', label: 'Unlink' }];

  validTaskManagerJobTypes: string[] = ['findings'];

  selectedEntity: TmLinkedRecords[] = [];
  unSelectedEntity: TmLinkedRecords[] = [];

  constructor(
    private dynamicComponentRegistryService: DynamicComponentsRegistryService,
    private taskManagerRegistryService: TaskManagerRegistyService
  ) {}

  ngOnInit(): void {
    this.dynamicComponentRegistryService.register('jb-dynamic-components-example', 'dynamic-example', () =>
      import('./dynamic-components/dynamic-components-example.module').then((m) => m.DynamicComponentsExampleModule)
    );
    this.dynamicComponentRegistryService.register('jb-app-dynamic-example-grid', 'jb-dynamic-example-grid', () =>
      import('./dynamic-components/dynamic-components-example.module').then((m) => m.DynamicComponentsExampleModule)
    );

    this.taskManagerRegistryService.registerJobTypeSidebarInformationDynamicComponent('NON-PM-NCR', 'jb-dynamic-components-example');
    this.taskManagerRegistryService.registerJobTypeSelectionDyamicComponent('Office task', 'jb-app-dynamic-example-grid');
    this.taskManagerRegistryService.registerJobTypeSidebarInformationDynamicComponent(
      'INTERNAL INSPECTION',
      'jb-dynamic-components-example'
    );

    this.taskManagerRegistryService.registerJobTypeDetailsPageUrlGenerator(
      'NON-PM-NCR',
      (entityId: string) => `https://j3-dev/details/${entityId}`
    );

    this.details = {
      uid: 'B94DCAC7-87B6-4570-AA84-4307106A1994', //parent uid
      Vessel_Name: 'Akashiano', //parent vessel name
      Vessel_ID: 904, //parent vessel ID
      vessel_uid: 'F9EAF49F-8428-42F7-B2C5-71AA66E10D91', //parrent vessel uid
      WL_TYPE: 'master_review', //parent worklist type
      module_code: 'tm_master_review', //parent module code
      function_code: 'tm_master_review_detail' // parent fnction code
      // uid: this.specificationDetailsInfo.TaskManagerUid,
      // function_code: eFunction.SpecificationDetails,
      // Vessel_Name: this.specificationDetailsInfo.VesselName, //parent vessel name
      // Vessel_ID: this.specificationDetailsInfo.VesselId, //parent vessel ID
      // vessel_uid: this.specificationDetailsInfo.VesselUid //parent vessel uid
      // WL_TYPE: this.specificationDetailsInfo.SpecificationTypeCode, //parent worklist type
      // module_code: eModule.Project //parent module code
    };
  }

  selectionValidator = (changedEntities: ITaskManagerLinkingComponentSelectionEvent): Promise<boolean> => {
    console.log('*******Linking validator', changedEntities);
    // changedEntities.segment[TmLinkedRecordsRelationType.Related].forEach((entity: TmLinkedRecords) => {
    //   console.log('*******Linking events', entity);
    // });

    // changedEntities. linkedEntities.forEach((entity: ITaskManagerLinkingComponentEntity) => {
    //   if (entity.segment === TmLinkedRecordsRelationType.Related) {
    //     entity.id = 'B94DCAC7-87B6-4570-AA84-4307106A1994';
    //   }
    // });

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
