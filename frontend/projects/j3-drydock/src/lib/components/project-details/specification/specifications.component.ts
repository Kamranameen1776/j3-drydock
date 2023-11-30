import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { SpecificationGridService, SpecificationType } from '../../../services/project/specification.service';
import { GridService, eGridRefreshType, eJbTreeEvents } from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { SpecificationCreateFormService } from '../specification-form/specification-create-form-service';
import { FunctionsService } from '../../../services/functions.service';
import { Observable } from 'rxjs';
import { FunctionsFlatTreeNode } from '../../../models/interfaces/functions-tree-node';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jb-specifications',
  templateUrl: './specifications.component.html',
  styleUrls: ['./specifications.component.scss']
})
export class SpecificationsComponent extends UnsubscribeComponent implements OnInit, OnChanges {
  @Input()
  projectId: string;
  @Input()
  vesselUid: string;
  @ViewChild('statusTemplate', { static: true }) statusTemplate: TemplateRef<unknown>;
  treeData$: Observable<FunctionsFlatTreeNode[]>;
  gridData: GridInputsWithRequest;
  eventsList = [eJbTreeEvents.NodeSelect, eJbTreeEvents.Select, eJbTreeEvents.UnSelect];
  activeIndex = 0;
  functionUIDs: string[] = [];
  types = [SpecificationType.ALL, SpecificationType.PMS, SpecificationType.FINDINGS, SpecificationType.STANDARD, SpecificationType.ADHOC];
  isCreatePopupVisible = false;

  createNewItems = [
    /*{
      label: 'Add from PMS',
      command: () => {
        this.openPopup();
      }
    },
    {
      label: 'Add from Findings',
      command: () => {
        this.openPopup();
      }
    },*/
    {
      label: 'Add from Standard Jobs',
      command: () => {
        this.openPopup();
      }
    },
    {
      label: 'Create Ad hoc',
      command: () => {
        this.openPopup();
      }
    }
  ];

  constructor(
    private specsService: SpecificationGridService,
    private formService: SpecificationCreateFormService,
    private functionsService: FunctionsService,
    private gridService: GridService
  ) {
    super();
  }

  openPopup() {
    this.isCreatePopupVisible = true;
  }

  ngOnInit(): void {
    this.treeData$ = this.functionsService.getFunctions().pipe(
      takeUntil(this.unsubscribe$),
      map((functions) => {
        return functions.map((func) => this.functionsService.calculateSelectable(func, functions));
      })
    );
    this.loadFunctionsToForm();
    this.gridData = this.getData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.projectId) {
      this.getData(changes.projectId.currentValue);
    }
  }

  onCloseCreatePopup(hasSaved: boolean) {
    this.isCreatePopupVisible = false;

    if (hasSaved) {
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridData.gridName);
    }
  }

  loadFunctionsToForm(): void {
    this.treeData$.subscribe((flatTree) => {
      this.formService.functionsFlatTree$.next(flatTree);
    });
  }

  activeIndexChange(index: number) {
    this.activeIndex = index;
    this.gridData = this.getData();
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

  private getData(projectId?: string) {
    const gridData = this.specsService.getGridData(projectId || this.projectId, this.functionUIDs);
    const statusCol = gridData.columns.find((col) => col.FieldName === 'status');
    statusCol.cellTemplate = this.statusTemplate;
    return gridData;
  }
}
