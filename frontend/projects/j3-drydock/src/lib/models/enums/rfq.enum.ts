import { eGridRowActions } from 'jibe-components';

export enum eRfqLabels {
  Yard = 'Yard',
  Location = 'Location',
  ExportedDate = 'Last Exported Date',
  YardName = 'Name'
}

export enum eRfqFields {
  Yard = 'yardName',
  Location = 'yardLocation',
  Uid = 'uid',
  YardUid = 'yardUid',
  ExportedDate = 'lastExportedDate'
}

// Extend enum hack
export const eRfqActions = {
  Export: 'Export',
  ...eGridRowActions
};

export type eRfqActions = (typeof eRfqActions)[keyof typeof eRfqActions];
