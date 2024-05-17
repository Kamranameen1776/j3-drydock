import { ComparisonFunctionTree, ComparisonYard } from './../../../../models/interfaces/comparison';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ComparisonService, comparisonGridName } from './comparison.service';
import { Filter, GridAction, GridService, eGridEvents } from 'jibe-components';
import { comparisonFilters, comparisonFiltersLists } from './comparison-grid-inputs';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'jb-drydock-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComparisonComponent extends UnsubscribeComponent implements OnInit, OnChanges {
  yards: ComparisonYard[] = []; // fixme type

  isTableInCollapsedMode = false;
  yardFunctions: ComparisonFunctionTree[];
  baseColumns = this.comparisonService.getBaseColumns();
  cardColumns = this.comparisonService.getCardColumns();

  expandedRowsSet = new Set(); // fixme type
  gridName = comparisonGridName;
  additionalFilters: Filter[];
  isLoading = false;

  private gridSearch: string;

  constructor(
    private comparisonService: ComparisonService,
    private gridService: GridService,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.additionalFilters = this.gridService.getFilterLists(comparisonFilters, comparisonFiltersLists);
    this.load();
    this.listenComparisonSearchChanged();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
    console.log('Method not implemented.');
  }

  load(): void {
    forkJoin([this.comparisonService.loadYards(), this.comparisonService.loadLeftRowsTree(), this.comparisonService.loadYardsRows()])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([yards, leftRows, yardRows]) => {
        this.yardFunctions = this.comparisonService.createSortedTreeFromArray(leftRows);
        this.yards = this.comparisonService.getMappedYardsByYardsAndFunctions(yardRows, yards, this.yardFunctions);
        this.expandedRowsSet = this.comparisonService.getExpandedRowsSet(this.yardFunctions);
      });
  }

  onToggleTableMode() {
    this.isTableInCollapsedMode = !this.isTableInCollapsedMode;
    const baseColumns = this.comparisonService.getBaseColumns();
    this.baseColumns = this.isTableInCollapsedMode ? baseColumns.slice(0, baseColumns.length - 2) : baseColumns;
  }

  onNodeExpand(e) {
    this.expandedRowsSet = this.comparisonService.getExpandedRowsSet(this.yardFunctions);
  }

  onNodeCollapse(e) {
    this.expandedRowsSet = this.comparisonService.getExpandedRowsSet(this.yardFunctions);
  }

  onFilterChange(e: Filter) {
    const { odataKey, selectedValues } = e;
    switch (odataKey) {
      case 'sortYardsBy':
        this.yards = this.comparisonService.sortYardsBy(this.yards, selectedValues as string);
        break;
      default:
        break;
    }
  }

  private listenComparisonSearchChanged() {
    this.gridService.storeState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ gridName, payload, type }: GridAction<eGridEvents, unknown>) => {
        if (gridName === this.gridName && type === eGridEvents.SearchTable) {
          this.onSearch(payload as string);
          this.cd.markForCheck();
        }
      });
  }

  private onSearch(searchText: string): void {
    this.gridSearch = searchText;
    // this.load();
  }
}
