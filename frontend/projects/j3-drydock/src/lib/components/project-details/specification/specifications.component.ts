import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { NewTabService } from '../../../services/new-tab-service';
import { statusProgressBarBackground } from '../../../shared/status-css.json';
import { GrowlMessageService } from '../../../services/growl-message.service';
import { StandardJobResult } from '../../../models/interfaces/standard-jobs';

@Component({
  selector: 'jb-specifications',
  templateUrl: './specifications.component.html',
  styleUrls: ['./specifications.component.scss']
})
export class SpecificationsComponent extends UnsubscribeComponent implements OnInit, OnChanges {
  @Input() projectId: string;
  @Input() vesselUid: string;
  @Input() vesselType: number;
  @Input() vesselId: string;

  @Output() exportExcel = new EventEmitter();

  @ViewChild('statusTemplate', { static: true }) statusTemplate: TemplateRef<unknown>;

  treeData$: Observable<FunctionsFlatTreeNode[]>;
  gridData: GridInputsWithRequest;
  eventsList = [eJbTreeEvents.NodeSelect, eJbTreeEvents.UnSelect];
  activeIndex = 0;
  private functionUIDs: string[] = [];
  types = [SpecificationType.ALL, SpecificationType.PMS, SpecificationType.FINDINGS, SpecificationType.STANDARD, SpecificationType.ADHOC];
  isCreatePopupVisible = false;
  addFromStandardJobPopupVisible = false;
  isCreateFromProjectTemplatePopupVisible = false;

  statusCSS = { statusProgressBarBackground: statusProgressBarBackground };

  deleteSpecificationDialog: IJbDialog = {
    ...getSmallPopup(),
    dialogHeader: 'Delete Specification'
  };

  deleteDialogVisible = false;
  deleteBtnLabel = 'Delete';
  deleteDialogMessage = 'Are you sure you want to delete the record?';
  specificationUid: string;

  vesselNode: Pick<ShellFunctionTreeResponseNode, 'uid' | 'parent_function_uid' | 'name' | 'expanded'> = {
    uid: 'vesselParent',
    name: 'Functions',
    parent_function_uid: '0',
    expanded: true
  };

  constructor(
    private specsService: SpecificationGridService,
    private formService: SpecificationCreateFormService,
    private functionsService: FunctionsService,
    private gridService: GridService,
    private newTabService: NewTabService,
    private activatedRoute: ActivatedRoute,
    private growlService: GrowlMessageService
  ) {
    super();
  }

  public openPopup() {
    this.isCreatePopupVisible = true;
  }

  addFromStandardJob() {
    this.addFromStandardJobPopupVisible = true;
  }

  createFromProjectTemplate() {
    this.isCreateFromProjectTemplatePopupVisible = true;
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

  onCloseStandardJobPopup(selected: StandardJobResult[]) {
    this.addFromStandardJobPopupVisible = false;
    if (selected.length > 0) {
      this.onCloseCreatePopup();
    }
  }

  onCloseCreateFromProjectTemplatePopup(isSaved: boolean) {
    this.isCreateFromProjectTemplatePopupVisible = false;
    if (isSaved) {
      this.onCloseCreatePopup();
    }
  }

  onCloseCreateSpecificationPopup(isSaved: boolean) {
    this.isCreatePopupVisible = false;
    if (isSaved) {
      this.onCloseCreatePopup();
    }
  }

  private onCloseCreatePopup() {
    this.gridService.refreshGrid(eGridRefreshType.Table, this.gridData.gridName);
    this.growlService.setSuccessMessage('Specification created successfully');
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
      this.openSpecificationPage(rowData.uid, rowData.code);
    }
  }

  setNodeData(event) {
    if (event?.type === eJbTreeEvents.NodeSelect) {
      this.functionUIDs = [event.payload.Child_ID];
      this.gridData = this.getData();
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridData.gridName);
    } else if (event?.type === eJbTreeEvents.UnSelect) {
      this.functionUIDs = [];
      this.gridData = this.getData();
      this.gridService.refreshGrid(eGridRefreshType.Table, this.gridData.gridName);
    }
  }

  async onActionClick({ type, payload }: IGridAction) {
    const { uid, code } = payload;
    this.specificationUid = uid;

    switch (type) {
      case eGridRowActions.Delete:
        this.showDeleteDialog(true);
        break;
      case eGridRowActions.Edit:
        this.openSpecificationPage(uid, code);
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

  private getData(projectId?: string) {
    const gridData = this.specsService.getGridData(projectId || this.projectId, this.functionUIDs);
    const statusCol = gridData.columns.find((col) => col.FieldName === 'status');
    statusCol.cellTemplate = this.statusTemplate;
    return gridData;
  }

  private openSpecificationPage(uid: string, code: string) {
    const tab_title = `Specification ${code}`;
    this.newTabService.navigate(
      ['../../specification-details', uid],
      {
        relativeTo: this.activatedRoute,
        queryParams: { tab_title }
      },
      tab_title
    );
  }
}
