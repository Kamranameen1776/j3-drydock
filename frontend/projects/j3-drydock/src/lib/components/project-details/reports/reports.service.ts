import { Injectable } from '@angular/core';
import { ApiRequestService, Column, GridRowActions, WebApiRequest, eCrud, eGridAction } from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import ODataFilterBuilder from 'odata-filter-builder';
import { localAsUTC } from '../../../utils/date';

@Injectable()
export class DailyReportsGridService {
  constructor(private apiRequestService: ApiRequestService) {}

  public getDailyReportsAPIRequest(projectId: string | null): WebApiRequest {
    let filter = ODataFilterBuilder('and');

    if (projectId) {
      filter = filter.eq('projectUid', projectId);
    }

    const apiRequest: WebApiRequest = {
      // TODO:update jibe lib
      // apiBase: eApiBase.DryDockAPI,
      apiBase: 'dryDockAPI',
      action: 'daily-reports/get-daily-reports',
      crud: eCrud.Post,
      entity: 'drydock',
      odata: {
        filter
      }
    };

    return apiRequest;
  }

  getGridData(projectId: string | null): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.gridName,
      request: this.getDailyReportsAPIRequest(projectId),
      actions: this.gridActions,
      searchFields: ['reportName'],
      filters: [],
      filtersLists: {}
    };
  }

  deleteDailyReport(data: { uid: string }) {
    const request: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      action: 'daily-reports/delete-daily-reports',
      crud: eCrud.Put,
      body: {
        DailyReportUid: data.uid,
        DeletedAt: localAsUTC(new Date())
      }
    };

    return this.apiRequestService.sendApiReq(request);
  }

  createDailyReport(data: { ProjectUid: string; ReportName: string; ReportDate: Date; Remarks: string; CreatedAt: Date }) {
    const request: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      action: 'daily-reports/create-daily-reports',
      crud: eCrud.Post,
      body: {
        ...data,
        ReportDate: localAsUTC(data.ReportDate),
        CreatedAt: localAsUTC(data.CreatedAt)
      }
    };

    return this.apiRequestService.sendApiReq(request);
  }

  public readonly gridName: string = 'reportsGrid';

  private readonly columns: Column[] = [
    {
      DisableSort: false,
      DisplayText: 'Report Name',
      FieldName: 'reportName',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    },
    {
      DisableSort: false,
      DisplayText: 'Report Date',
      FieldName: 'reportDate',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    }
  ];

  private gridActions: GridRowActions[] = [
    { name: eGridAction.Edit, icon: 'icons8-edit' },
    { name: eGridAction.Delete, icon: 'icons8-delete' }
  ];
}
