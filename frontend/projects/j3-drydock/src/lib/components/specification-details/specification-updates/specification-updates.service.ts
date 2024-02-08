import { Injectable } from '@angular/core';
import { GridRowActions, UserService, eGridColumnsWidth } from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { eSpecificationUpdatesFields, eSpecificationUpdatesLabels } from '../../../models/enums/specification-details.enum';
import { SpecificationDetailsService } from '../../../services/specification-details/specification-details.service';

@Injectable()
export class SpecificationUpdatesService {
  readonly gridName: string = 'specificationUpdatesGrid';

  readonly dateFormat = this.userService.getUserDetails().Date_Format.toLocaleUpperCase();

  readonly dateTimeFormat = `${this.dateFormat} HH:mm`;

  private readonly gridActions: GridRowActions[] = [{ name: 'Edit Job Update', icon: 'icons8-edit' }];

  constructor(
    private userService: UserService,
    private specDetailsService: SpecificationDetailsService
  ) {}

  getGridInputs(specUid: string): GridInputsWithRequest {
    return {
      columns: [
        {
          DisplayText: eSpecificationUpdatesLabels.Date,
          FieldName: eSpecificationUpdatesFields.Date,
          IsActive: true,
          IsMandatory: true,
          IsVisible: true,
          width: eGridColumnsWidth.LongDescription
        },
        {
          DisplayText: eSpecificationUpdatesLabels.User,
          FieldName: eSpecificationUpdatesFields.User,
          IsActive: true,
          IsMandatory: true,
          IsVisible: true,
          width: '200px'
        },
        {
          DisplayText: eSpecificationUpdatesLabels.Progress,
          FieldName: eSpecificationUpdatesFields.Progress,
          IsActive: true,
          IsMandatory: true,
          IsVisible: true,
          width: eGridColumnsWidth.ShortDescription
        },
        {
          DisplayText: eSpecificationUpdatesLabels.Subject,
          FieldName: eSpecificationUpdatesFields.Subject,
          IsActive: true,
          IsMandatory: true,
          IsVisible: true
        }
      ],
      gridName: this.gridName,
      actions: this.gridActions,
      request: this.specDetailsService.getSpecificationUpdatesRequest(specUid),
      sortField: eSpecificationUpdatesFields.Date,
      sortOrder: -1
    };
  }
}
