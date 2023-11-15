import { YardToLink } from './../../../../../models/interfaces/project-details';
import { eRfqFields, eRfqLabels } from './../../../../../models/enums/rfq.enum';
import { Injectable } from '@angular/core';
import { Column, eFieldControlType } from 'jibe-components';
import { GridInputsWithData } from '../../../../../models/interfaces/grid-inputs';

@Injectable()
export class SelectLinkYardGridService {
  readonly gridName: string = 'selectLinkYardGrid';

  private readonly columns: Column[] = [
    {
      width: '50px',
      FieldName: eRfqFields.IsSelected,
      DisplayText: '',
      ControlType: eFieldControlType.Checkbox,
      StrictlyEditable: true,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      DisableSort: true,
      DisableControlKey: eRfqFields.IsLinked
    },
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
