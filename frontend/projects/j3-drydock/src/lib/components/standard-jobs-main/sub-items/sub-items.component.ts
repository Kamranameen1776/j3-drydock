import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { of } from 'rxjs';
import { SubItem } from '../../../models/interfaces/sub-items';
import { GridAction, GridRowActions, eGridRowActions } from 'jibe-components';
import { GridInputsWithData } from '../../../models/interfaces/grid-inputs';
import { UnsubscribeComponent } from '../../../shared/classes/unsubscribe.base';
import { SubItemsGridService } from './SubItemsGridService';
import { StandardJobsService } from '../../../services/StandardJobsService';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jb-drydock-sub-items',
  templateUrl: './sub-items.component.html',
  styleUrls: ['./sub-items.component.scss'],
  providers: [SubItemsGridService]
})
export class SubItemsComponent extends UnsubscribeComponent implements OnChanges, OnInit {
  @Input() jobUid: string;
  @Input() functionUid: string;

  public gridInputs: GridInputsWithData<SubItem>;

  public isUpsertPopupVisible = false;

  public currentRow: SubItem;

  public gridRowActions: GridRowActions[] = [];

  public subItems: SubItem[];

  constructor(
    private subItemsGridService: SubItemsGridService,
    private standardJobsService: StandardJobsService
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

  public onGridAction({ type, payload }: GridAction<string, unknown>): void {
    switch (type) {
      case this.gridInputs.gridButton.label:
        this.isUpsertPopupVisible = true;
        break;
      case eGridRowActions.Edit:
        this.isUpsertPopupVisible = true;
        this.currentRow = <SubItem>payload;
        break;
      case eGridRowActions.Delete:
        this.delete(<SubItem>payload);
        break;
      default:
        break;
    }
  }

  public onCloseUpsertPopup(hasSaved: boolean) {
    this.isUpsertPopupVisible = false;
    this.currentRow = undefined;

    if (hasSaved) {
      // TODO insert new subitem to grid
    }
  }

  private delete(record: SubItem) {
    // TODO
    of(record).subscribe(() => {
      // eslint-disable-next-line eqeqeq
      const idx = this.subItems.findIndex((item) => item == record);
      if (idx > -1) {
        this.subItems = [...this.subItems];
        this.subItems.splice(idx, 1);
      }
    });
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
    if (!this.jobUid) {
      this.subItems = [];
    } else {
      this.standardJobsService
        .getJobSubItems(this.jobUid)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res) => {
          this.subItems = res;
        });
    }
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
