import { YardToLink } from './../../../../../models/interfaces/project-details';
import { eRfqFields, eRfqLabels } from './../../../../../models/enums/rfq.enum';
import { Injectable } from '@angular/core';
import { Column } from 'jibe-components';
import { GridInputsWithData } from '../../../../../models/interfaces/grid-inputs';

@Injectable()
export class SelectLinkYardGridService {
  readonly gridName: string = 'selectLinkYardGrid';

  private readonly columns: Column[] = [
    {
      DisableSort: false,
      DisplayText: eRfqLabels.YardName,
      FieldName: eRfqFields.Yard,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisableSort: false,
      DisplayText: eRfqLabels.Location,
      FieldName: eRfqFields.Location,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    }
  ];

  getGridInputs(): GridInputsWithData<YardToLink> {
    return {
      columns: this.columns,
      gridName: this.gridName
    };
  }
}
