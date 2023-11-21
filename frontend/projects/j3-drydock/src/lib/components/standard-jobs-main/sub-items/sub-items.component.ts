import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { SubItem } from '../../../models/interfaces/sub-items';
import { DispatchAction, GridAction, GridRowActions, GridService, eGridEvents, eGridRowActions } from 'jibe-components';
import { GridInputsWithData } from '../../../models/interfaces/grid-inputs';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { SubItemsGridService } from './sub-items-grid.service';
import { getSmallPopup } from '../../../models/constants/popup';
import { StandardJobResult } from '../../../models/interfaces/standard-jobs';
import { cloneDeep } from 'lodash';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'jb-drydock-sub-items',
  templateUrl: './sub-items.component.html',
  styleUrls: ['./sub-items.component.scss'],
  providers: [SubItemsGridService]
})
export class SubItemsComponent extends UnsubscribeComponent implements OnChanges, OnInit {
  @Input() job: StandardJobResult;

  @Input() functionUid: string;

  @Output() changed = new EventEmitter<SubItem[]>();

  gridInputs: GridInputsWithData<SubItem>;

  isUpsertPopupVisible = false;

  currentRow: SubItem;

  searchTerm$ = this.gridService.storeState$.pipe(
    filter((event: DispatchAction) => event.type === eGridEvents.SearchTable && event.gridName === this.gridInputs.gridName),
    map((event: DispatchAction) => event.payload)
  );

  gridRowActions: GridRowActions[] = [];

  subItems: SubItem[] = [];

  confirmationPopUp = {
    ...getSmallPopup(),
    dialogHeader: 'Delete Sub Item'
  };

  isConfirmDeleteVisible = false;

  private editingSubItemIdx: number;

  constructor(
    private subItemsGridService: SubItemsGridService,
    private gridService: GridService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.functionUid) {
      this.setGridButton();
    }
  }

  ngOnInit(): void {
    this.setGridInputs();
    this.setGridRowActions();
    this.initSubItems();
  }

  onGridAction({ type, payload }: GridAction<string, unknown>): void {
    switch (type) {
      case this.gridInputs.gridButton.label:
        this.isUpsertPopupVisible = true;
        break;
      case eGridRowActions.Edit:
        this.editRow(<SubItem>payload);
        this.editingSubItemIdx = this.subItems.findIndex((item) => item === payload);
        break;
      case eGridRowActions.Delete:
        this.deleteRow(<SubItem>payload);
        break;
      default:
        break;
    }
  }

  onCloseUpsertPopup(item: SubItem | null) {
    this.isUpsertPopupVisible = false;

    if (item) {
      const isExist = !!this.currentRow;
      isExist ? this.edit(item) : this.add(item);
    }

    this.currentRow = undefined;
    this.editingSubItemIdx = -1;
  }

  onConfirmDeleteOk() {
    this.delete(this.currentRow);
    this.isConfirmDeleteVisible = false;
  }

  onConfirmDeleteCancel() {
    this.isConfirmDeleteVisible = false;
  }

  searchFn = (record: SubItem, term: string) => {
    term = term ?? '';
    return record.subject?.toLowerCase().includes(term.toLowerCase());
  };

  private editRow(row: SubItem) {
    this.currentRow = row;
    this.isUpsertPopupVisible = true;
  }

  private deleteRow(row: SubItem) {
    this.currentRow = row;
    this.isConfirmDeleteVisible = true;
  }

  private delete(record: SubItem) {
    const idx = this.subItems.findIndex((item) => item === record);
    if (idx > -1) {
      this.subItems = [...this.subItems];
      this.subItems.splice(idx, 1);
    }

    this.changed.emit(this.subItems);
  }

  private add(record: SubItem) {
    this.subItems = [...this.subItems, record];
    this.changed.emit(this.subItems);
  }

  private edit(record: SubItem) {
    const idx = this.editingSubItemIdx;
    if (idx > -1) {
      this.subItems[idx] = record;
      this.subItems = [...this.subItems];
      this.changed.emit(this.subItems);
    }
  }

  private setGridRowActions(): void {
    this.gridRowActions.length = 0;

    this.gridRowActions.push({
      name: eGridRowActions.Edit
    });

    this.gridRowActions.push({
      name: eGridRowActions.Delete
    });
  }

  private setGridInputs() {
    this.gridInputs = this.subItemsGridService.getGridInputs();
    this.setGridButton();
  }

  private initSubItems() {
    const subItems = this.job?.subItems ?? [];
    this.subItems = cloneDeep(subItems);
  }

  private setGridButton() {
    if (!this.gridInputs) {
      return;
    }

    this.gridInputs.gridButton = {
      ...this.gridInputs.gridButton,
      disabled: !this.functionUid
    };
  }
}
