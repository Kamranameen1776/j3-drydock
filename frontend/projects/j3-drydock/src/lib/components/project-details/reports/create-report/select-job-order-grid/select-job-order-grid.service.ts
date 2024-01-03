import { Column, GridRowActions, UserService, eGridColumnsWidth } from 'jibe-components';
import { nameOf } from '../../../../../utils/nameOf';
import { JobOrdersService } from '../../../../../services/project-monitoring/job-orders/JobOrdersService';
import { GridInputsWithRequest } from '../../../../../models/interfaces/grid-inputs';
import { Injectable } from '@angular/core';
import { IJobOrderDto } from '../../../project-monitoring/job-orders/dtos/IJobOrderDto';

@Injectable()
export class SelectJobOrdersGridService {
  public readonly gridName: string = 'selectJobOrdersGrid';

  public readonly dateFormat = this.userService.getUserDetails().Date_Format.toLocaleUpperCase();

  public readonly dateTimeFormat = `${this.dateFormat} HH:mm`;

  private readonly columns: Column[] = [
    {
      DisplayText: 'SpecificationUid',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.SpecificationUid),
      IsActive: true,
      IsMandatory: true,
      IsVisible: false,
      ReadOnly: true
    },
    {
      DisplayText: 'Code',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.Code),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      hyperlink: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisplayText: 'Responsible',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.DoneBy),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisplayText: 'Status',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.SpecificationStatus),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisplayText: 'Last Updated',
      FieldName: nameOf<IJobOrderDto>((prop) => prop.LastUpdated),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    }
  ];

  private searchFields: string[] = [nameOf<IJobOrderDto>((prop) => prop.SpecificationSubject)];
  private gridActions: GridRowActions[] = [];

  constructor(
    private userService: UserService,
    private jobOrdersService: JobOrdersService
  ) {}

  public getGridInputs(): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.gridName,
      searchFields: this.searchFields,
      request: this.jobOrdersService.getJobOrdersUpdatesRequest(),
      actions: this.gridActions,
      sortField: nameOf<IJobOrderDto>((prop) => prop.LastUpdated),
      sortOrder: -1
    };
  }
}
