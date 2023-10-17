import { IGridCellStyle } from 'jibe-components';
import { eStandardJobsMainFields } from '../enums/standard-jobs-main.enum';

// TODO fixme all of this
export interface CreateStandardJob {
  Name: string;
}

export interface CreateStandardJobResult {
  Uid: string;
}

// TODO can change all + need also data fields for create new popup
export interface StandardJobResult {
  [eStandardJobsMainFields.ItemNumber]: string;
  [eStandardJobsMainFields.Subject]: Partial<IGridCellStyle>;
  [eStandardJobsMainFields.VesselType]: string;
  [eStandardJobsMainFields.ItemCategory]: string;
  [eStandardJobsMainFields.Inspection]: string;
  [eStandardJobsMainFields.DoneBy]: string;
  [eStandardJobsMainFields.MaterialSuppliedBy]: string;
  [eStandardJobsMainFields.UID]: string;
}
