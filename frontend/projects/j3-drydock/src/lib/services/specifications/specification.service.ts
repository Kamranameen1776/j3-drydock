import { Injectable } from '@angular/core';
import {
  ApiRequestService,
  Column,
  Filter,
  FilterListSet,
  GridRowActions,
  WebApiRequest,
  eCrud,
  eFieldControlType,
  eGridAction
} from 'jibe-components';
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
  constructor(
    private standardJobsService: StandardJobsService,
    private apiRequestService: ApiRequestService
  ) {}

  public getSpecificationDetailsAPIRequest(projectId: string | null, functionUIDs: string[]): WebApiRequest {
    let filter = ODataFilterBuilder('and');

    if (projectId) {
      filter = filter.eq('project_uid', projectId);
    }

    if (functionUIDs?.length > 0) {
      filter = filter.in('function_uid', functionUIDs);
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

  public createSpecification(formValue: any) {
    const action = 'specification-details/create-specification-details';
    const apiReq: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      crud: eCrud.Post,
      action: action,
      body: {
        ...formValue,
        // HardCoded for future
        ItemSourceUid: '3EEF2E1B-2533-45C7-82C7-C13D6AA79559',
        Inspections: [],
        FunctionUid: formValue.FunctionUid.Child_ID || ''
      }
    };
    return this.apiRequestService.sendApiReq(apiReq);
  }

  getGridData(projectId: string | null, functionUIDs: string[]): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.gridName,
      request: this.getSpecificationDetailsAPIRequest(projectId, functionUIDs),
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
      FieldName: 'subject',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: '324px'
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
      DisplayText: 'Done by',
      FieldName: 'db_done_by',
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
      FieldName: 'ic_item_category',
      placeholder: 'Select',
      Active_Status: true,
      Active_Status_Config_Filter: true,
      DisplayCode: 'displayName',
      FieldID: 1,
      default: true
    },
    /*{
      DisplayText: 'Material Supplied By',
      FieldName: 'msb_material_supplied_by',
      placeholder: 'Select',
      Active_Status: false,
      Active_Status_Config_Filter: false,
      DisplayCode: 'displayName',
      FieldID: 4,
      default: false
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
      FieldID: 2,
      default: true
    },
    {
      DisplayText: 'Due Date',
      FieldName: 'due_date_from',
      Active_Status: true,
      Active_Status_Config_Filter: true,
      type: 'date',
      placeholder: 'Select',
      FieldID: 3,
      default: true,
      CoupleID: 1,
      CoupleLabel: 'Due Date Range'
    },
    {
      DisplayText: 'Due Date',
      FieldName: 'due_date_to',
      Active_Status: true,
      Active_Status_Config_Filter: true,
      type: 'date',
      placeholder: 'Select',
      FieldID: 3,
      default: true,
      CoupleID: 1,
      CoupleLabel: 'Due Date Range'
    },
    {
      DisplayText: 'Done By',
      FieldName: 'db_done_by',
      Active_Status: true,
      Active_Status_Config_Filter: true,
      DisplayCode: 'displayName',
      FieldID: 5,
      default: false
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
    ic_item_category: {
      webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.ItemCategory),
      type: eFieldControlType.MultiSelect,
      odataKey: 'item_category_uid',
      listValueKey: 'uid'
    },
    /*[eStandardJobsMainFields.Inspection]: {
      webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.Inspection),
      type: eFieldControlType.MultiSelect,
      odataKey: eStandardJobsMainFields.InspectionID,
      listValueKey: 'uid'
    },*/
    msb_material_supplied_by: {
      webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.MaterialSuppliedBy),
      type: eFieldControlType.MultiSelect,
      odataKey: 'material_supplied_by_uid',
      listValueKey: 'uid'
    },
    db_done_by: {
      webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.DoneBy),
      type: eFieldControlType.MultiSelect,
      odataKey: 'done_by_uid',
      listValueKey: 'uid'
    },
    due_date_to: {
      type: eFieldControlType.Date,
      odadaKey: 'due_date',
      alterKey: 'due_date',
      dateMethod: 'le'
    },
    due_date_from: {
      type: eFieldControlType.Date,
      odadaKey: 'due_date',
      alterKey: 'due_date',
      dateMethod: 'ge'
    }
  };

  private gridActions: GridRowActions[] = [
    { name: eGridAction.Edit, icon: 'icons8-edit' },
    { name: eGridAction.Delete, icon: 'icons8-delete' }
  ];
}
