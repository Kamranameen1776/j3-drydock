import { Injectable } from '@angular/core';
import { Column, GridButton } from 'jibe-components';
import { eSubItemsFields, eSubItemsLabels } from '../../../models/enums/sub-items.enum';
import { GridInputsWithData } from '../../../models/interfaces/grid-inputs';
import { SubItem } from '../../../models/interfaces/sub-items';

@Injectable()
export class SubItemsGridService {
  public readonly gridName: string = 'subItemsGrid';

  private readonly columns: Column[] = [
    {
      DisableSort: true,
      DisplayText: eSubItemsLabels.ItemNumber,
      FieldName: eSubItemsFields.ItemNumber,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      width: '100px'
    },
    {
      DisableSort: true,
      DisplayText: eSubItemsLabels.Subject,
      FieldName: eSubItemsFields.Subject,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    }
  ];

  private readonly gridButton: GridButton = {
    label: eSubItemsLabels.AddSubItem,
    show: true
  };

  public getGridInputs(): GridInputsWithData<SubItem> {
    return {
      columns: this.columns,
      gridName: this.gridName,
      gridButton: this.gridButton,
      searchFields: [eSubItemsFields.Subject]
    };
  }
}
