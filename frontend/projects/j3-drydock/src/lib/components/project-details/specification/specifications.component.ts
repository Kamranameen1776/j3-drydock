import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { SpecificationGridService, SpecificationType } from '../../../services/project/specification.service';
import { GridService, IGridAction, IJbDialog, eGridRefreshType, eGridRowActions, eJbTreeEvents } from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { SpecificationCreateFormService } from '../specification-form/specification-create-form-service';
import { FunctionsService } from '../../../services/functions.service';
import { Observable } from 'rxjs';
import { FunctionsFlatTreeNode, ShellFunctionTreeResponseNode } from '../../../models/interfaces/functions-tree-node';
import { map, takeUntil } from 'rxjs/operators';
import { getSmallPopup } from '../../../models/constants/popup';
import { NewTabService } from '../../../services/new-tab-service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'jb-specifications',
  templateUrl: './specifications.component.html',
  styleUrls: ['./specifications.component.scss']
})
export class SpecificationsComponent extends UnsubscribeComponent implements OnInit, OnChanges {
  @Input() projectId: string;
  @Input() vesselUid: string;
  @Input() vesselType: number;
  @ViewChild('statusTemplate', { static: true }) statusTemplate: TemplateRef<unknown>;
  treeData$: Observable<FunctionsFlatTreeNode[]>;
  gridData: GridInputsWithRequest;
  eventsList = [eJbTreeEvents.NodeSelect, eJbTreeEvents.Select, eJbTreeEvents.UnSelect];
  activeIndex = 0;
  functionUIDs: string[] = [];
  types = [SpecificationType.ALL, SpecificationType.PMS, SpecificationType.FINDINGS, SpecificationType.STANDARD, SpecificationType.ADHOC];
  isCreatePopupVisible = false;
  addFromStandardJobPopupVisible = false;

  deleteSpecificationDialog: IJbDialog = {
    ...getSmallPopup(),
    dialogHeader: 'Delete Specification'
  };

  deleteDialogVisible = false;
  deleteBtnLabel = 'Delete';
  deleteDialogMessage = 'Are you sure you want to delete this specification?';
  specificationUid: string;

  vesselNode: Pick<ShellFunctionTreeResponseNode, 'uid' | 'parent_function_uid' | 'name'> = {
    uid: 'vesselParent',
    name: 'Vessel',
    parent_function_uid: '0'
  };

  constructor(
    private specsService: SpecificationGridService,
    private formService: SpecificationCreateFormService,
    private functionsService: FunctionsService,
    private gridService: GridService,
    private newTabService: NewTabService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  public openPopup() {
    this.isCreatePopupVisible = true;
  }

  addFromStandardJob() {
    this.addFromStandardJobPopupVisible = true;
  }

  ngOnInit(): void {
    this.treeData$ = this.functionsService.getFunctions(this.vesselNode.uid).pipe(
      map((functions) => {
        functions.push(this.functionsService.createFlatNode(this.vesselNode));
        return functions.map((func) => this.functionsService.calculateSelectable(func, functions));
      }),
      takeUntil(this.unsubscribe$)
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
    this.addFromStandardJobPopupVisible = false;

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

  cellPlainTextClick({ cellType, rowData, columnDetail }) {
    if (cellType === 'hyperlink' && columnDetail.FieldName === 'code') {
      this.newTabService.navigate(['../../specification-details', rowData.uid], { relativeTo: this.activatedRoute });
    }
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

  async onActionClick({ type, payload }: IGridAction) {
    const { uid } = payload;
    this.specificationUid = uid;

    switch (type) {
      case eGridRowActions.Delete:
        this.showDeleteDialog(true);
        break;
      case eGridRowActions.Edit:
        this.newTabService.navigate(['../../specification-details', payload.uid], { relativeTo: this.activatedRoute });
        break;
      default:
        return;
    }
  }

  public deleteSpecificationHandler() {
    this.specsService.deleteSpecification({ uid: this.specificationUid }).subscribe(() => {
      this.showDeleteDialog(false);
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridData.gridName);
    });
  }

  public showDeleteDialog(value: boolean) {
    this.deleteDialogVisible = value;
  }
}
