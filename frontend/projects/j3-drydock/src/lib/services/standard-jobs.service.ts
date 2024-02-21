import { Injectable } from '@angular/core';
import {
  ApiRequestService,
  UserRightsService,
  WebApiRequest,
  eApiBase,
  eCrud,
  eEntities,
  eJMSFilterDataKeys,
  Column,
  Filter,
  FilterListSet,
  eFieldControlType,
  SearchField
} from 'jibe-components';
import { ODataFilterBuilder } from 'odata-filter-builder';
import { eStandardJobsMainFields, eStandardJobsMainLabels } from '../models/enums/standard-jobs-main.enum';
import { SubItem } from '../models/interfaces/sub-items';
import { eModule } from '../models/enums/module.enum';
import { eFunction } from '../models/enums/function.enum';
import { GridInputsWithRequest } from '../models/interfaces/grid-inputs';

@Injectable({ providedIn: 'root' })
export class StandardJobsService {
  private readonly popupGridName: string = 'specificationGridPopup';

  private readonly columns: Column[] = [
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.Code,
      FieldName: eStandardJobsMainFields.Code,
      hyperlink: true,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.Subject,
      FieldName: eStandardJobsMainFields.Subject,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.HasInspection,
      FieldName: eStandardJobsMainFields.HasInspection,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.HasSubItems,
      FieldName: eStandardJobsMainFields.HasSubItems,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    }
  ];

  private readonly filters: Filter[] = [
    {
      DisplayText: eStandardJobsMainLabels.HasInspection,
      FieldName: eStandardJobsMainFields.HasInspection,
      placeholder: 'Select',
      default: true,
      FieldID: 1,
      DisplayCode: 'displayName',
      type: 'multiselect',
      Active_Status: true,
      Active_Status_Config_Filter: true,
      includeFilter: true,
      gridName: this.popupGridName
    },
    {
      DisplayText: eStandardJobsMainLabels.HasSubItems,
      FieldName: eStandardJobsMainFields.HasSubItems,
      placeholder: 'Select',
      default: true,
      FieldID: 2,
      DisplayCode: 'displayName',
      type: 'multiselect',
      Active_Status: true,
      Active_Status_Config_Filter: true,
      includeFilter: true,
      gridName: this.popupGridName
    }
  ];

  private filtersLists: FilterListSet = {
    hasSubItems: {
      list: [
        {
          label: 'Yes',
          value: 'Yes'
        },
        {
          label: 'No',
          value: 'No'
        }
      ],
      type: eFieldControlType.MultiSelect,
      odataKey: 'hasSubItems',
      includeFilter: true
    },
    hasInspection: {
      list: [
        {
          label: 'Yes',
          value: 'Yes'
        },
        {
          label: 'No',
          value: 'No'
        }
      ],
      type: eFieldControlType.MultiSelect,
      odataKey: 'hasInspection',
      includeFilter: true
    }
  };

  private searchFields: SearchField[] = [
    {
      field: 'code',
      pattern: 'contains'
    },
    {
      field: 'subject',
      pattern: 'contains'
    }
  ];

  constructor(
    private apiRequestService: ApiRequestService,
    private userRights: UserRightsService
  ) {}

  getStandardJobsRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'standard-jobs/get-standard-jobs',
      crud: eCrud.Post,
      entity: 'drydock',
      odata: {
        orderby: 'code asc'
      }
    };
    return apiRequest;
  }

  getStandardJobPopupGridData(vesselType: number, functionUIDs: string[]): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.popupGridName,
      request: this.getStandardJobsRequestWithFilters(vesselType, functionUIDs),
      filters: this.filters,
      filtersLists: this.filtersLists,
      searchFields: this.searchFields
    };
  }

  public getStandardJobsRequestWithFilters(vesselType: number, functionUIDs: string[]): WebApiRequest {
    const filter = ODataFilterBuilder('and');

    if (vesselType) {
      filter.contains('vesselTypeId', vesselType.toString()).or(ODataFilterBuilder().eq('vesselTypeId', null));
    }

    if (functionUIDs?.length > 0) {
      filter.in('functionUid', functionUIDs);
    }

    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'standard-jobs/get-standard-jobs',
      crud: eCrud.Post,
      entity: 'drydock',
      odata: {
        filter,
        orderby: 'code asc'
      }
    };
    return apiRequest;
  }

  deleteStandardJob(uid: string) {
    const apiReq: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      crud: eCrud.Put,
      action: 'standard-jobs/delete-standard-jobs',
      body: {
        uid
      }
    };
    return this.apiRequestService.sendApiReq(apiReq);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  upsertStandardJob(uid: string, formValue: any) {
    const body = this.getUpsertStandardJobBody(uid, formValue);
    const action = uid ? 'standard-jobs/update-standard-jobs' : 'standard-jobs/create-standard-jobs';
    const apiReq: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      crud: uid ? eCrud.Put : eCrud.Post,
      action: action,
      body: body
    };
    return this.apiRequestService.sendApiReq(apiReq);
  }

  getStandardJobsFiltersRequest(fieldName: eStandardJobsMainFields) {
    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'standard-jobs/get-standard-jobs-filters',
      crud: eCrud.Post,
      entity: 'drydock',
      body: {
        key: fieldName
      }
    };
    return apiRequest;
  }

  getVesselTypesRequest(): WebApiRequest {
    const apiRequest: WebApiRequest = {
      apiBase: eApiBase.MasterAPI,
      entity: eEntities.Master,
      crud: eCrud.Get,
      action: 'datasource/getDatasource',
      params: 'dataSourceName=vessel_type',
      odata: {
        filter: ODataFilterBuilder().eq(eJMSFilterDataKeys.ActiveStatus, 1)
      }
    };
    return apiRequest;
  }

  updateJobSubItems(jobUid: string, subItems: SubItem[]) {
    const apiRequest: WebApiRequest = {
      apiBase: 'dryDockAPI',
      action: 'standard-jobs/update-standard-jobs-sub-items',
      crud: eCrud.Put,
      entity: 'drydock',
      body: {
        uid: jobUid,
        subItems: subItems
      }
    };
    return this.apiRequestService.sendApiReq(apiRequest);
  }

  getVesselSpecificList() {
    return [
      {
        label: 'Yes',
        value: 1
      },
      {
        label: 'No',
        value: 0
      }
    ];
  }

  hasAccess(action: string) {
    return !!this.userRights.getUserRights(eModule.Project, eFunction.StandardJob, action);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getUpsertStandardJobBody(uid: string, formValue: { editors: any; standardJobsUpsertFormId: any }) {
    const { editors, standardJobsUpsertFormId } = formValue;

    return {
      ...standardJobsUpsertFormId,
      [eStandardJobsMainFields.UID]: uid || '',
      [eStandardJobsMainFields.Function]: standardJobsUpsertFormId.function.jb_value_label || '',
      [eStandardJobsMainFields.FunctionUid]: standardJobsUpsertFormId.function.Child_ID || '',
      [eStandardJobsMainFields.Description]: editors.description,
      [eStandardJobsMainFields.Scope]: editors.scope
    };
  }
}
