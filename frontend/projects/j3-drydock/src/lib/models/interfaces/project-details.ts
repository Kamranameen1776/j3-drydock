import { eRfqFields } from '../enums/rfq.enum';

export interface YardLink {
  [eRfqFields.Yard]: string;
  [eRfqFields.Location]: string;
  [eRfqFields.Uid]: string;
  [eRfqFields.YardUid]: string;
  [eRfqFields.ExportedDate]: string;
  [eRfqFields.IsSelected]: boolean;
}

export interface YardToLink {
  [eRfqFields.Yard]: string;
  [eRfqFields.Location]: string;
  [eRfqFields.YardUid]: string;
  [eRfqFields.IsLinked]?: boolean;
}
