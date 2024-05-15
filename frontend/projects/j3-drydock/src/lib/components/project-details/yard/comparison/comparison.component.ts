import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ComparisonService, comparisonGridName } from './comparison.service';
import { Filter, GridAction, GridService, eGridEvents } from 'jibe-components';
import { comparisonFilters, comparisonFiltersLists } from './comparison-grid-inputs';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeComponent } from '../../../../shared/classes/unsubscribe.base';

@Component({
  selector: 'jb-drydock-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss']
})
export class ComparisonComponent extends UnsubscribeComponent implements OnInit, OnChanges {
  yards = []; // fixme type

  isTableInCollapsedMode = false;
  yardFunctions;
  baseColumns = this.comparisonService.getBaseColumns();
  cardColumns = this.comparisonService.getCardColumns();

  expandedRowsSet = new Set(); // fixme type
  gridName = comparisonGridName;
  additionalFilters: Filter[];

  private gridSearch: string;

  constructor(
    private comparisonService: ComparisonService,
    private gridService: GridService
  ) {
    super();
  }

  ngOnInit(): void {
    this.additionalFilters = this.gridService.getFilterLists(comparisonFilters, comparisonFiltersLists);
    this.yardFunctions = this.comparisonService.getFunctionsTree(this.yards);
    this.expandedRowsSet = this.comparisonService.getExpandedRowsSet(this.yardFunctions);

    this.listenComparisonSearchChanged();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
    console.log('Method not implemented.');
  }

  loadYards(): void {
    this.yards = this.comparisonService.getYardsWithYardRows([
      {
        name: 'yard1',
        uid: 'GUID1'
      },
      {
        name: 'yard2',
        uid: 'GUID2'
      },
      {
        name: 'yard3',
        uid: 'GUID3'
      }
    ]);
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
      .subscribe(({ gridName: name, payload, type }: GridAction<eGridEvents, unknown>) => {
        if (name === this.gridName && type === eGridEvents.SearchTable) {
          this.onSearch(payload as string);
        }
      });
  }

  private onSearch(searchText: string): void {
    this.gridSearch = searchText;
    // this.loadYards();
  }
}
