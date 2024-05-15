import { eGridCellType, FilterList } from 'jibe-components';
import { createFilters } from '../../../../utils/filters-builder';
import { comparisonGridName } from './comparison.service';

//TODO by requirements ALL
export type FilterKey = 'sortYardsBy';
export type SortYardsByFilterValue = 'yardRating' | 'cheapest';

export interface FilterKeyValue {
  sortYardsBy: SortYardsByFilterValue;
}

export const comparisonFilters = createFilters<string, FilterKey>([['Sort Supplier Card By', 'sortYardsBy']], {
  gridName: comparisonGridName
});

export const comparisonFiltersLists: {
  [key in FilterKey]: FilterList<FilterKeyValue[key]>;
} = {
  sortYardsBy: {
    list: [
      { label: 'Yard Rating', value: 'yardRating' },
      { label: 'Cheapest', value: 'cheapest' }
    ],
    type: eGridCellType.Dropdown,
    odataKey: 'sortYardsBy'
  }
};
