import { IGridCellStyle } from 'jibe-components';

// TODO fixme all of this
export interface CreateStandardJob {
  Name: string;
}

export interface CreateStandardJobResult {
  Uid: string;
}

// TODO can change all + need also data fields for create new popup
export interface StandardJobResult {
  ItemNumber: string;
  Subject: Partial<IGridCellStyle>;
  VesselType: string;
  ItemCategory: string;
  Inspection: string;
  DoneBy: string;
  MaterialSuppliedBy: string;
}
