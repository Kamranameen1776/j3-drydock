export interface JbCellChangeEvent<T> {
  cellName: CellName;
  cellvalue: unknown;
  rowData: T;
  cellType: string;
  rowIndex: any;
}

interface CellName {
  ControlType: string;
  DisableSort: boolean;
  DisplayText: string;
  Editable: boolean;
  FieldName: string;
  IsActive: boolean;
  IsMandatory: boolean;
  IsVisible: boolean;
  StrictlyEditable: boolean;
  width: string;
}
