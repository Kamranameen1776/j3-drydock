import { Component, Output, Input } from '@angular/core';
import { Subject } from 'rxjs';
import {
  ApiRequestService,
  ITaskManagerLinkingComponentEntity,
  ITaskManagerLinkingComponentLinkingChangedEvent,
  TmLinkedRecordsRelationType,
  eApiBase,
  eCrud,
  eEntities
} from 'jibe-components';
import { TmRelatedRecords } from 'jibe-components/lib/interfaces/tm-linked-records.interface';
import { tmLinkedRecordsPopupColumns } from './task-manager.json';

@Component({
  selector: 'jb-app-dynamic-example-grid',
  template: `
    <jb-grid
      *ngIf="tableData; else loader"
      [colData]="relatedRecordsColumns"
      [gridName]="name"
      [tableData]="tableData"
      (matrixSelection)="handleMatrixSelection($event)"
      (cellChange)="handleCellChange($event)"
    ></jb-grid>
    <ng-template #loader>
      <p-progressSpinner></p-progressSpinner>
    </ng-template>
  `
})
export class DynamicExampleGridComponent {
  name = 'jb-dynamic-example-grid';
  relatedRecordsColumns = tmLinkedRecordsPopupColumns;
  tableDataReq = {
    apiBase: eApiBase.J3TaskManagerAPI,
    entity: eEntities.TaskManager,
    crud: eCrud.Post,
    action: 'task-manager-generic-linked/get-task-manager-related-records',
    odata: {},
    body: {
      parentTaskManagerUid: 'C7B9F9D9-A034-416D-9DEF-D15DB1A8044B'
    }
  };
  tableData: any;
  matrixSelectedValue: { uid: string }[];

  @Input() preSelectedEntityIdentifiers;
  @Output() entitySelectionChanged: Subject<ITaskManagerLinkingComponentLinkingChangedEvent> = new Subject();

  constructor(private apiService: ApiRequestService) {}

  ngOnInit() {
    this.matrixSelectedValue = this.preSelectedEntityIdentifiers.map((uid) => ({ uid }));

    this.apiService.sendApiReq(this.tableDataReq).subscribe((res: { records: TmRelatedRecords[]; count: number }) => {
      res.records.forEach((row: TmRelatedRecords) => {
        row.selected = this.preSelectedEntityIdentifiers.some((uid) => uid === row.uid);
      });
      this.tableData = res;
    });
  }

  handleCellChange(event: any) {
    switch (event.cellType) {
      case 'checkbox':
        this.handleCheckboxCellChange(event);
        break;
      default:
        break;
    }
  }

  handleCheckboxCellChange(event: any) {
    const { uid, taskType } = event.rowData;

    const linkedEntities: ITaskManagerLinkingComponentEntity[] = [];
    const unlinkedEntities: ITaskManagerLinkingComponentEntity[] = [];

    const entity = {
      id: uid,
      segment: TmLinkedRecordsRelationType.Related,
      type: taskType
    };
console.log("**** cell value", event)
    if (event.cellvalue) {
      linkedEntities.push(entity);
    } else {
      unlinkedEntities.push(entity);
    }

    this.entitySelectionChanged.next({
      linkedEntities,
      unlinkedEntities
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleMatrixSelection(event: any) {}
}
