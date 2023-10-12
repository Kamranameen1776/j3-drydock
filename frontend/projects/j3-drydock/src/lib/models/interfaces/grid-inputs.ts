import {
  AdvancedSettings,
  Column,
  Filter,
  FilterListSet,
  GridButton,
  GridRowActions,
  SearchField,
  ShowSettings,
  WebApiRequest
} from 'jibe-components';
import { IExtraGroupedHeaderRow } from 'jibe-components/lib/grid/models/extra-grouped-header-params.model';

export interface GridInputs {
  actions?: GridRowActions[];
  advancedSettings?: AdvancedSettings[];
  columns: Column[];
  extraHeaders?: IExtraGroupedHeaderRow[];
  filters?: Filter[];
  filtersLists?: FilterListSet;
  gridButton?: GridButton;
  gridName: string;
  searchFields?: SearchField[];
  showSettings?: ShowSettings;
  sortField?: string;
}

export interface GridInputsWithRequest extends GridInputs {
  request?: WebApiRequest;
}

export interface GridInputsWithData<T> extends GridInputs {
  data?: T[];
}

export interface GridInputsWithDataObject<T> extends GridInputs {
  data?: {
    records: T[];
    count?: number;
  };
}
