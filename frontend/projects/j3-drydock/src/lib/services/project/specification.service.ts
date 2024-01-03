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
  eGridAction,
  eGridColors,
  eGridEvents,
  eGridIcons
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public createSpecification(formValue: any) {
    const action = 'specification-details/create-specification-details';
    const apiReq: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      crud: eCrud.Post,
      action: action,
      body: {
        ...formValue,
        FunctionUid: formValue.FunctionUid.Child_ID || '',
        Function: formValue.FunctionUid.jb_value_label || '',
        Inspections: formValue.Inspections || []
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
      searchFields: this.searchFields,
      filtersLists: this.filtersLists,
      showSettings: {
        showDefaultLables: false,
        [eGridEvents.ClearFilters]: true,
        ExportExcel: true
      },
      advancedSettings: [
        { label: eGridEvents.ClearFilters, icon: eGridIcons.ClearFilters3, color: eGridColors.JbBlack, show: true },
        { label: 'ExportExcel', icon: eGridIcons.MicrosoftExcel2, color: eGridColors.JbBlack, show: true }
      ]
    };
  }

  deleteSpecification(data: { uid: string }) {
    const request: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      action: 'specification-details/delete-specification-details',
      crud: eCrud.Put,
      body: data
    };
    return this.apiRequestService.sendApiReq(request);
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
      ReadOnly: true
    },
    {
      DisableSort: true,
      DisplayText: 'Subject',
      FieldName: 'subject',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    },
    {
      DisableSort: true,
      DisplayText: 'Item Source',
      FieldName: 'item_source',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    },
    {
      DisableSort: true,
      DisplayText: 'Done by',
      FieldName: 'db_done_by',
      IsActive: true,
      IsMandatory: false,
      IsVisible: true,
      ReadOnly: true
    },
    {
      DisableSort: true,
      DisplayText: 'Inspection / Survey',
      FieldName: 'inspection',
      IsActive: true,
      IsMandatory: false,
      IsVisible: true,
      ReadOnly: true
    },
    {
      DisableSort: true,
      DisplayText: 'Status',
      FieldName: 'status',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    }
  ];

  private readonly filters: Filter[] = [
    {
      DisplayText: 'Inspection / Survey',
      FieldName: 'inspection',
      placeholder: 'Select',
      default: true,
      FieldID: 1,
      DisplayCode: 'displayName',
      type: 'multiselect',
      Active_Status: true,
      Active_Status_Config_Filter: true,
      gridName: this.gridName,
      sendFilterAs: 'gridFilters'
    },
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
      default: true,
      gridName: this.gridName
    },
    {
      DisplayText: 'Due Date From',
      FieldName: 'due_date_from',
      Active_Status: true,
      Active_Status_Config_Filter: true,
      type: 'date',
      placeholder: 'Select',
      FieldType: 'date',
      Details: 'due_date_from',
      addTimeLimit: true,
      FieldID: 3,
      default: true,
      CoupleID: 1,
      CoupleLabel: 'Due Date Range',
      gridName: this.gridName
    },
    {
      DisplayText: 'To',
      FieldName: 'due_date_to',
      Active_Status: true,
      Active_Status_Config_Filter: true,
      type: 'date',
      placeholder: 'Select',
      FieldType: 'date',
      Details: 'due_date_to',
      addTimeLimit: true,
      FieldID: 4,
      default: true,
      CoupleID: 1,
      CoupleLabel: 'Due Date Range',
      gridName: this.gridName
    },
    {
      DisplayText: 'Done By',
      FieldName: 'db_done_by',
      Active_Status: true,
      Active_Status_Config_Filter: true,
      DisplayCode: 'displayName',
      FieldID: 5,
      default: false,
      gridName: this.gridName
    },
    {
      DisplayText: 'Item Source',
      FieldName: 'item_source',
      Active_Status: true,
      Active_Status_Config_Filter: true,
      DisplayCode: 'DisplayName',
      FieldID: 6,
      default: true,
      gridName: this.gridName
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
    inspection: {
      webApiRequest: this.standardJobsService.getStandardJobsFiltersRequest(eStandardJobsMainFields.Inspection),
      type: eFieldControlType.MultiSelect,
      odataKey: 'inspectionId',
      listValueKey: 'uid',
      includeFilter: true
    },
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
      odataKey: 'due_date',
      alterKey: 'due_date',
      dateMethod: 'le'
    },
    due_date_from: {
      type: eFieldControlType.Date,
      odataKey: 'due_date',
      alterKey: 'due_date',
      dateMethod: 'ge'
    },
    item_source: {
      type: eFieldControlType.Dropdown,
      webApiRequest: this.getItemSources(),
      odataKey: 'item_source_uid',
      listValueKey: 'uid'
    }
  };

  private searchFields: string[] = ['item_number', 'code', 'subject'];
  private gridActions: GridRowActions[] = [
    { name: eGridAction.Edit, icon: 'icons8-edit' },
    { name: eGridAction.Delete, icon: 'icons8-delete' }
  ];

  public getItemSources() {
    const apiRequest: WebApiRequest = {
      apiBase: 'dryDockAPI',
      action: 'dictionaries/item-source',
      crud: eCrud.Get,
      entity: 'drydock'
    };

    return apiRequest;
  }
}
