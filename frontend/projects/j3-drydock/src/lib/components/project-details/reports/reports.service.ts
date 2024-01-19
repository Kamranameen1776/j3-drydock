import { Injectable } from '@angular/core';
import { ApiRequestService, Column, GridRowActions, WebApiRequest, eCrud, eGridAction, eGridColumnsWidth } from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import ODataFilterBuilder from 'odata-filter-builder';
import { DailyReportCreate, DailyReportUpdate } from '../../../models/interfaces/project-details';
import { Observable } from 'rxjs';
import { IDailyReportsResultDto } from './dto/IDailyReportsResultDto';

@Injectable()
export class DailyReportsGridService {
  public readonly gridName: string = 'reportsGrid';

  private readonly columns: Column[] = [
    {
      DisableSort: false,
      DisplayText: 'Report Date',
      FieldName: 'reportDate',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisableSort: false,
      DisplayText: 'Report Name',
      FieldName: 'reportName',
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      hyperlink: true
    }
  ];
  private gridActions: GridRowActions[] = [
    { name: eGridAction.Edit, icon: 'icons8-edit' },
    { name: eGridAction.Delete, icon: 'icons8-delete' }
  ];

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

  deleteDailyReport(data: { uid: string; projectUid: string }) {
    const request: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      action: 'daily-reports/delete-daily-reports',
      crud: eCrud.Put,
      body: {
        DailyReportUid: data.uid,
        ProjectUid: data.projectUid
      }
    };

    return this.apiRequestService.sendApiReq(request);
  }

  createDailyReport(data: DailyReportCreate) {
    const request: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      action: 'daily-reports/create-daily-reports',
      crud: eCrud.Post,
      body: {
        ...data
      }
    };

    return this.apiRequestService.sendApiReq(request);
  }

  updateDailyReport(data: DailyReportUpdate) {
    const request: WebApiRequest = {
      apiBase: 'dryDockAPI',
      entity: 'drydock',
      action: 'daily-reports/update-daily-reports',
      crud: eCrud.Put,
      body: {
        ...data
      }
    };

    return this.apiRequestService.sendApiReq(request);
  }

  getJobOrders() {
    const request = {
      apiBase: 'dryDockAPI',
      action: 'projects/job-orders/get-job-orders',
      crud: eCrud.Post,
      entity: 'drydock'
    };

    return this.apiRequestService.sendApiReq(request);
  }

  getOneDailyReport(reportUid: string): Observable<IDailyReportsResultDto> {
    const request = {
      apiBase: 'dryDockAPI',
      action: 'daily-reports/get-one-daily-report',
      crud: eCrud.Get,
      entity: 'drydock',
      params: `uid=${reportUid}`
    };

    return this.apiRequestService.sendApiReq(request);
  }
}
