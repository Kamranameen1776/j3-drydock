import { eGridCellType, Filter } from 'jibe-components';

type DefaultFilterOptions = Omit<Filter, 'FieldName' | 'DisplayText'>;
type FilterOptions = Partial<Filter>;

const _defaultOptions: DefaultFilterOptions = {
  Active_Status_Config_Filter: true,
  type: eGridCellType.Multiselect,
  default: true
};

export function createFilters<T extends string, P extends string>(
  filters: [T, P, FilterOptions?][],
  defaultOptions?: FilterOptions
): Filter[] {
  const initialOptions = { ..._defaultOptions, ...defaultOptions };
  return filters.map(([name, key, options]) => ({
    ...initialOptions,
    ...options,
    FieldName: key,
    DisplayText: name
  }));
}
