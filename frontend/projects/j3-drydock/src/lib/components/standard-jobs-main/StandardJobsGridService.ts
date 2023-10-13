import { StandardJobsService } from '../../services/StandardJobsService';
import { Injectable } from '@angular/core';
import { Column, Filter, GridButton, FilterListSet, eFieldControlType } from 'jibe-components';
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
      FieldName: eStandardJobsMainFields.SubjectExtended,
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
    label: eStandardJobsMainLabels.CreateNewJob,
    show: true
  };

  private gridFilters: Filter[] = [
    {
      DisplayText: eStandardJobsMainLabels.VesselType,
      FieldName: eStandardJobsMainFields.VesselType,
      Active_Status: true,
      Active_Status_Config_Filter: true,
      DisplayCode: 'VesselTypes',
      ValueCode: 'VesselTypes',
      FieldID: 0,
      gridName: this.gridName,
      default: false
    },
    {
      DisplayText: eStandardJobsMainLabels.DoneBy,
      FieldName: eStandardJobsMainFields.DoneBy,
      Active_Status: true,
      Active_Status_Config_Filter: true,
      DisplayCode: 'VALUE',
      FieldID: 3,
      ValueCode: 'ID',
      gridName: this.gridName,
      default: true
    }
  ];

  private gridFilterLists: FilterListSet = {
    [eStandardJobsMainFields.VesselType]: {
      webApiRequest: this.standardJobsService.getVesselTypesRequest(),
      type: eFieldControlType.MultiSelect,
      odataKey: eStandardJobsMainFields.VesselType,
      listValueKey: 'VesselTypes'
    },
    [eStandardJobsMainFields.DoneBy]: {
      webApiRequest: this.standardJobsService.getDoneByRequest(),
      type: eFieldControlType.MultiSelect,
      odataKey: eStandardJobsMainFields.DoneBy,
      listValueKey: 'ID'
    }
  };

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
