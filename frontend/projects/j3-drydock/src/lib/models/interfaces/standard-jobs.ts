import { IGridCellStyle } from 'jibe-components';
import { eStandardJobsMainFields } from '../enums/standard-jobs-main.enum';
import { SubItem } from './sub-items';

// TODO fixme all of this
export interface CreateStandardJob {
  Name: string;
}

export interface CreateStandardJobResult {
  Uid: string;
}

export interface StandardJobResult {
  [eStandardJobsMainFields.UID]: string;
  [eStandardJobsMainFields.Subject]: Partial<IGridCellStyle>;
  [eStandardJobsMainFields.Function]: string;
  [eStandardJobsMainFields.FunctionUid]: string;
  [eStandardJobsMainFields.ItemNumber]: string;
  [eStandardJobsMainFields.DoneByID]: string;
  [eStandardJobsMainFields.DoneBy]: string;
  [eStandardJobsMainFields.Inspection]: string;
  [eStandardJobsMainFields.InspectionID]: number[];
  [eStandardJobsMainFields.MaterialSuppliedByID]: string;
  [eStandardJobsMainFields.MaterialSuppliedBy]: string;
  [eStandardJobsMainFields.VesselSpecific]: number;
  [eStandardJobsMainFields.Description]: string;
  [eStandardJobsMainFields.VesselTypeID]: number[];
  [eStandardJobsMainFields.VesselType]: string;
  [eStandardJobsMainFields.SubItems]: SubItem[];
  [eStandardJobsMainFields.Scope]: string;
  [eStandardJobsMainFields.HasInspection]: string;
  [eStandardJobsMainFields.HasSubItems]: string;
}
