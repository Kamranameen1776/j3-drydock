import { StandardJobsService } from '../../services/StandardJobsService';
import { Injectable } from '@angular/core';
import { Column, Filter, GridButton, FilterListSet } from 'jibe-components';
import { eStandardJobsMainFields, eStandardJobsMainLabels } from '../../models/enums/standard-jobs-main.enum';
import { GridInputsWithRequest } from '../../models/interfaces/grid-inputs';

@Injectable()
export class StandardJobsGridService {
  public readonly gridName: string = 'standardJobsGrid';

  private readonly columns: Column[] = [
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.ItemNumber,
      FieldName: eStandardJobsMainFields.ItemNumber,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      width: '100px'
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.Subject,
      FieldName: eStandardJobsMainFields.Subject,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.VesselType,
      FieldName: eStandardJobsMainFields.VesselType,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.ItemCategory,
      FieldName: eStandardJobsMainFields.ItemCategory,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.Inspection,
      FieldName: eStandardJobsMainFields.Inspection,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.DoneBy,
      FieldName: eStandardJobsMainFields.DoneBy,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.MaterialSuppliedBy,
      FieldName: eStandardJobsMainFields.MaterialSuppliedBy,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    }
  ];

  private readonly gridButton: GridButton = {
    label: eStandardJobsMainLabels.createNewJob,
    show: true
  };

  private gridFilters: Filter[] = [];
  private gridFilterLists: FilterListSet = {};

  constructor(private standardJobsService: StandardJobsService) {}

  public getGridInputs(): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.gridName,
      request: this.standardJobsService.getStandardJobsRequest(),
      gridButton: this.gridButton,
      filters: this.gridFilters,
      filtersLists: this.gridFilterLists
    };
  }
}
