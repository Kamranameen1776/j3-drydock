import { YardLink } from './../../../../models/interfaces/project-details';
import { GridInputsWithData } from './../../../../models/interfaces/grid-inputs';
import { eRfqFields, eRfqLabels } from './../../../../models/enums/rfq.enum';

import { Injectable } from '@angular/core';
import { Column } from 'jibe-components';

@Injectable({
  providedIn: 'root'
})
export class RfqGridService {
  readonly gridName: string = 'rfqGrid';

  private readonly columns: Column[] = [
    {
      DisplayText: eRfqLabels.Yard,
      FieldName: eRfqFields.Yard,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisplayText: eRfqLabels.Location,
      FieldName: eRfqFields.Location,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisplayText: eRfqLabels.ExportedDate,
      FieldName: eRfqFields.ExportedDate,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisplayText: eRfqLabels.IsSelected,
      FieldName: eRfqFields.IsSelected,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    }
  ];

  // TODO fixme type
  getGridInputs(): GridInputsWithData<YardLink> {
    return {
      columns: this.columns,
      gridName: this.gridName
    };
  }
}
