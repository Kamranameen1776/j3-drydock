import { Injectable } from '@angular/core';
import { Column, Filter, FilterListSet, GridRowActions, WebApiRequest, eCrud, eFieldControlType, eGridAction } from 'jibe-components';
import { GridInputsWithRequest } from '../../models/interfaces/grid-inputs';
import ODataFilterBuilder from 'odata-filter-builder';
import { eStandardJobsMainFields } from '../../models/enums/standard-jobs-main.enum';
import { StandardJobsService } from '../standard-jobs.service';

export enum SpecificationType {
  ALL = 'All',
  PMS = 'PMS',
  FINDINGS = 'Findings',
  ADHOC = 'Ad hoc',
  STANDARD = 'Standard'
}

export enum SpecificationStatus {
  RAISED = 'Raised',
  APPROVED = 'Approved',
  COMPLETED = 'Completed',
  REJECTED = 'Rejected'
}

@Injectable()
export class SpecificationGridService {
  constructor(private standardJobsService: StandardJobsService) {}

  public getSpecificationDetailsAPIRequest(projectId: string | null, componentUIDs: string[], functionUIDs: string[]): WebApiRequest {
    const filter = ODataFilterBuilder('and');

    if (projectId) {
      filter.eq('project_uid', projectId);
    }

    if (componentUIDs?.length > 0) {
      filter.in('component_uid', componentUIDs);
    }

    if (functionUIDs?.length > 0) {
      filter.in('function_uid', functionUIDs);
    }

    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'specification-details/get-many-specification-details',
      crud: eCrud.Post,
      entity: 'drydock',
      odata: {
        filter
      }
    };
    return apiRequest;
  }

  getGridData(projectId: string | null, componentUIDs: string[], functionUIDs: string[]): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.gridName,
      request: this.getSpecificationDetailsAPIRequest(projectId, componentUIDs, functionUIDs),
      actions: this.gridActions,
      filters: this.filters,
      filtersLists: this.filtersLists
    };
  }

  public readonly gridName: string = 'specificationGrid';

  private readonly columns: Column[] = [
    {
      DisableSort: true,
      DisplayText: 'Item No',
      FieldName: 'item_number',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '70px'
    },
    {
      DisableSort: true,
      DisplayText: 'Code',
      FieldName: 'code',
      hyperlink: true,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '123px'
    },
    {
      DisableSort: true,
      DisplayText: 'Subject',
      FieldName: 'description',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '395px'
    },
    /*{
      DisableSort: true,
      DisplayText: 'Item source',
      FieldName: 'kind',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '83px'
    },*/
    {
      DisableSort: true,
      DisplayText: 'Item category',
      FieldName: 'item_category',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '110px'
    },
    {
      DisableSort: true,
      DisplayText: 'Done by',
      FieldName: 'done_by',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '84px'
    },
    /*{
      DisableSort: true,
      DisplayText: 'Inspection / Survey',
      FieldName: 'inspection',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '130px'
    },*/
    {
      DisableSort: true,
      DisplayText: 'Status',
      FieldName: 'status',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '182px'
    }
  ];

  private readonly filters: Filter[] = [
    {
      DisplayText: 'Item Category',
      FieldName: 'item_category',
      placeholder: 'Select',
      default: true
    },
    /*{
      DisplayText: 'Inspection / Survey',
      FieldName: 'inspection',
      placeholder: 'Select',
      default: true
    },*/
    {
      DisplayText: 'Status',
      FieldName: 'status',
      type: 'multiselect',
      placeholder: 'Select',
      Active_Status: true,
      Active_Status_Config_Filter: true,
      ControlType: 'simple',
      Details: 'Status',
      DisplayCode: 'label',
      ValueCode: 'label',
      default: true
    },
    {
      DisplayText: 'Due Date Range From',
      FieldName: 'due_date',
      type: 'date',
      placeholder: 'Select',
      default: true
    }
  ];

  private filtersLists: FilterListSet = {
    status: {
      list: [
        {
          label: SpecificationStatus.APPROVED,
          value: SpecificationStatus.APPROVED
        },
        {
          label: SpecificationStatus.COMPLETED,
          value: SpecificationStatus.COMPLETED
        },
        {
          label: SpecificationStatus.RAISED,
          value: SpecificationStatus.RAISED
        },
        {
          label: SpecificationStatus.REJECTED,
          value: SpecificationStatus.REJECTED
        }
      ],
      type: eFieldControlType.MultiSelect,
      odataKey: 'status'
    },
    [eStandardJobsMainFields.ItemCategory]: {
      webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.ItemCategory),
      type: eFieldControlType.MultiSelect,
      odataKey: eStandardJobsMainFields.ItemCategoryID,
      listValueKey: 'uid'
    },
    /*[eStandardJobsMainFields.Inspection]: {
      webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.Inspection),
      type: eFieldControlType.MultiSelect,
      odataKey: eStandardJobsMainFields.InspectionID,
      listValueKey: 'uid'
    },*/
    [eStandardJobsMainFields.MaterialSuppliedBy]: {
      webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.MaterialSuppliedBy),
      type: eFieldControlType.MultiSelect,
      odataKey: eStandardJobsMainFields.MaterialSuppliedByID,
      listValueKey: 'uid'
    },
    due_date: {
      type: eFieldControlType.Date,
      odadaKey: 'due_date'
    }
  };

  private gridActions: GridRowActions[] = [
    { name: eGridAction.Edit, icon: 'icons8-edit' },
    { name: eGridAction.Delete, icon: 'icons8-delete' }
  ];
}
