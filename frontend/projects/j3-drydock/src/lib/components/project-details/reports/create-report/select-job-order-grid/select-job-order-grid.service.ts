import { JobOrder } from './../../../../../models/interfaces/job-orders';
import { Column, GridRowActions, UserService, eGridColumnsWidth } from 'jibe-components';
import { nameOf } from '../../../../../utils/nameOf';
import { JobOrdersService } from '../../../../../services/project-monitoring/job-orders/JobOrdersService';
import { GridInputsWithRequest } from '../../../../../models/interfaces/grid-inputs';
import { Injectable } from '@angular/core';

@Injectable()
export class SelectJobOrdersGridService {
  public readonly gridName: string = 'selectJobOrdersGrid';

  public readonly dateFormat = this.userService.getUserDetails().Date_Format.toLocaleUpperCase();

  public readonly dateTimeFormat = `${this.dateFormat} HH:mm`;

  private readonly columns: Column[] = [
    {
      DisplayText: 'SpecificationUid',
      FieldName: nameOf<JobOrder>((prop) => prop.SpecificationUid),
      IsActive: true,
      IsMandatory: true,
      IsVisible: false,
      ReadOnly: true
    },
    {
      DisplayText: 'Specification Code',
      FieldName: nameOf<JobOrder>((prop) => prop.Code),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      hyperlink: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisplayText: 'Responsible',
      FieldName: nameOf<JobOrder>((prop) => prop.Responsible),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisplayText: 'Status',
      FieldName: nameOf<JobOrder>((prop) => prop.JobOrderStatus),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisplayText: 'Update Date',
      FieldName: nameOf<JobOrder>((prop) => prop.LastUpdated),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    }
  ];

  private searchFields: string[] = [nameOf<JobOrder>((prop) => prop.SpecificationSubject)];
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
      sortField: nameOf<JobOrder>((prop) => prop.LastUpdated),
      sortOrder: -1
    };
  }
}
