import { Injectable } from '@angular/core';
import { ApiRequestService } from 'jibe-components';
import ODataFilterBuilder from 'odata-filter-builder';
import { JobOrdersService } from '../../../../services/project-monitoring/job-orders/JobOrdersService';

export enum OverdueStatus {
  All = 'all',
  True = 'true',
  False = 'false'
}

@Injectable()
export class GanttChartService {
  constructor(
    private jobOrdersService: JobOrdersService,
    private requestService: ApiRequestService
  ) {}

  getData(projectId: string, overdue: OverdueStatus | null) {
    const request = { ...this.jobOrdersService.getJobOrdersRequest() };

    request.odata = { filter: new ODataFilterBuilder('and'), top: '99999999' };

    request.odata.filter = request.odata.filter.eq('projectUid', projectId);

    if (overdue !== OverdueStatus.All && overdue) {
      request.odata.filter = request.odata.filter.eq('overdue', JSON.parse(overdue));
    }

    return this.requestService.sendApiReq(request);
  }
}
