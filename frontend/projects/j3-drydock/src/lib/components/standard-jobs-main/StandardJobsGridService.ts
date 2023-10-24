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
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.Status,
      FieldName: eStandardJobsMainFields.Status,
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
      FieldID: 1,
      gridName: this.gridName,
      default: false
    },
    {
      DisplayText: eStandardJobsMainLabels.ItemCategory,
      FieldName: eStandardJobsMainFields.ItemCategory,
      Active_Status: true,
      Active_Status_Config_Filter: true,
      DisplayCode: 'displayName',
      FieldID: 2,
      gridName: this.gridName,
      default: true
    },
    {
      DisplayText: eStandardJobsMainLabels.Inspection,
      FieldName: eStandardJobsMainFields.Inspection,
      Active_Status: true,
      Active_Status_Config_Filter: true,
      DisplayCode: 'displayName',
      FieldID: 3,
      gridName: this.gridName,
      default: true
    },
    {
      DisplayText: eStandardJobsMainLabels.DoneBy,
      FieldName: eStandardJobsMainFields.DoneBy,
      Active_Status: true,
      Active_Status_Config_Filter: true,
      DisplayCode: 'displayName',
      FieldID: 4,
      gridName: this.gridName,
      default: true
    },
    {
      DisplayText: eStandardJobsMainLabels.MaterialSuppliedBy,
      FieldName: eStandardJobsMainFields.MaterialSuppliedBy,
      Active_Status: true,
      Active_Status_Config_Filter: true,
      DisplayCode: 'displayName',
      FieldID: 5,
      gridName: this.gridName,
      default: true
    },
    {
      DisplayText: eStandardJobsMainLabels.Status,
      FieldName: eStandardJobsMainFields.Status,
      Active_Status: true,
      Active_Status_Config_Filter: true,
      DisplayCode: 'label',
      FieldID: 6,
      gridName: this.gridName,
      default: true
    },
    {
      DisplayText: eStandardJobsMainLabels.VesselSpecific,
      FieldName: eStandardJobsMainFields.VesselSpecific,
      Active_Status: true,
      Active_Status_Config_Filter: true,
      DisplayCode: 'label',
      FieldID: 7,
      gridName: this.gridName,
      default: false
    }
  ];

  private gridFilterLists: FilterListSet = {
    [eStandardJobsMainFields.VesselType]: {
      webApiRequest: this.standardJobsService.getVesselTypesRequest(),
      type: eFieldControlType.MultiSelect,
      odataKey: eStandardJobsMainFields.VesselType,
      listValueKey: 'VesselTypes'
    },
    [eStandardJobsMainFields.ItemCategory]: {
      webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.ItemCategory),
      type: eFieldControlType.MultiSelect,
      odataKey: eStandardJobsMainFields.ItemCategoryID,
      listValueKey: 'uid'
    },
    [eStandardJobsMainFields.Inspection]: {
      webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.Inspection),
      type: eFieldControlType.MultiSelect,
      odataKey: eStandardJobsMainFields.InspectionID,
      listValueKey: 'uid'
    },
    [eStandardJobsMainFields.DoneBy]: {
      webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.DoneBy),
      type: eFieldControlType.MultiSelect,
      odataKey: eStandardJobsMainFields.DoneByID,
      listValueKey: 'uid'
    },
    [eStandardJobsMainFields.MaterialSuppliedBy]: {
      webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.MaterialSuppliedBy),
      type: eFieldControlType.MultiSelect,
      odataKey: eStandardJobsMainFields.MaterialSuppliedByID,
      listValueKey: 'uid'
    },
    [eStandardJobsMainFields.Status]: {
      list: this.standardJobsService.getStatusList(),
      type: eFieldControlType.MultiSelect,
      odataKey: eStandardJobsMainFields.Status,
      listValueKey: 'value'
    },
    [eStandardJobsMainFields.VesselSpecific]: {
      webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.VesselSpecific),
      type: eFieldControlType.Dropdown,
      odataKey: eStandardJobsMainFields.VesselSpecific,
      listValueKey: 'value'
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
