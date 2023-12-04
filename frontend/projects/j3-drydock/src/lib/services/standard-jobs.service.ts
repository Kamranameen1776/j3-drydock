import { Injectable } from '@angular/core';
import {
  ApiRequestService,
  UserRightsService,
  WebApiRequest,
  eApiBase,
  eCrud,
  eEntities,
  eJMSFilterDataKeys,
  Column, Filter, FilterListSet, eFieldControlType
} from "jibe-components";
import { ODataFilterBuilder } from 'odata-filter-builder';
import { eStandardJobsMainFields } from '../models/enums/standard-jobs-main.enum';
import { SubItem } from '../models/interfaces/sub-items';
import { eModule } from '../models/enums/module.enum';
import { eFunction } from '../models/enums/function.enum';
import { FunctionsService } from './functions.service';
import { GridInputsWithRequest } from "../models/interfaces/grid-inputs";

@Injectable({ providedIn: 'root' })
export class StandardJobsService {
  private readonly popupGridName: string = 'specificationGridPopup';

  private readonly columns: Column[] = [
    {
      DisableSort: true,
      DisplayText: 'Item No',
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
      DisplayText: 'Inspection / Survey',
      FieldName: 'inspection',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      pipe: { value: 'yesNoValue' }
    },
    {
      DisableSort: true,
      DisplayText: 'Sub Items',
      FieldName: 'hasSubItems',
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
      Active_Status_Config_Filter: true
    },
    {
      DisplayText: 'Sub Items',
      FieldName: 'subItems',
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
  ];

  private filtersLists: FilterListSet = {
    subItmes: {
      list: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
      type: eFieldControlType.MultiSelect,
      odataKey: 'subItmes'
    },
    inspection: {
      list: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
      type: eFieldControlType.MultiSelect,
      odataKey: 'inspection'
    },
  };

  constructor(
    private apiRequestService: ApiRequestService,
    private userRights: UserRightsService,
    private functionsService: FunctionsService
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

  getSelectionPopupGridData(vesselType: number, functionUIDs: string[]): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.popupGridName,
      request: this.getStandardJobsRequestWithFilters(vesselType, functionUIDs),
      filters: this.filters,
      filtersLists: this.filtersLists
    };
  }

  public getStandardJobsRequestWithFilters(vesselType: number, functionUIDs: string[]): WebApiRequest {
    let filter = ODataFilterBuilder('and');

    if (vesselType) {
      filter.contains('vesselTypeId', vesselType.toString());
    }

    if (functionUIDs?.length > 0) {
      filter.in('function_uid', functionUIDs);
    }

    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'standard-jobs/get-standard-jobs',
      crud: eCrud.Post,
      entity: 'drydock',
      odata: {
        filter
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

  getStandardJobFunctions() {
    return this.functionsService.getFunctions();
  }

  getVesselSpevificList() {
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
  private getUpsertStandardJobBody(uid: string, formValue: any) {
    return {
      ...formValue,
      [eStandardJobsMainFields.UID]: uid || '',
      [eStandardJobsMainFields.Function]: formValue.function.jb_value_label || '',
      [eStandardJobsMainFields.FunctionUid]: formValue.function.Child_ID || ''
    };
  }
}
