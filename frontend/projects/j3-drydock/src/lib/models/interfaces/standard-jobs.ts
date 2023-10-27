import { IGridCellStyle } from 'jibe-components';
import { eStandardJobsMainFields } from '../enums/standard-jobs-main.enum';

// TODO fixme all of this
export interface CreateStandardJob {
  Name: string;
}

export interface CreateStandardJobResult {
  Uid: string;
}
// TODO function
export interface StandardJobResult {
  [eStandardJobsMainFields.UID]: string;
  [eStandardJobsMainFields.Subject]: Partial<IGridCellStyle>;
  [eStandardJobsMainFields.Function]: string;
  [eStandardJobsMainFields.ItemNumber]: string;
  [eStandardJobsMainFields.ItemCategoryID]: string;
  [eStandardJobsMainFields.ItemCategory]: string;
  [eStandardJobsMainFields.DoneByID]: string;
  [eStandardJobsMainFields.DoneBy]: string;
  [eStandardJobsMainFields.Inspection]: string;
  [eStandardJobsMainFields.MaterialSuppliedByID]: string;
  [eStandardJobsMainFields.MaterialSuppliedBy]: string;
  [eStandardJobsMainFields.VesselSpecific]: number;
  [eStandardJobsMainFields.Description]: string;
  [eStandardJobsMainFields.VesselTypeID]: string;
  [eStandardJobsMainFields.VesselType]: string;
}
