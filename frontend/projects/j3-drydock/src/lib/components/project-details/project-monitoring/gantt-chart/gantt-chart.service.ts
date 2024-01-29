import { Injectable } from '@angular/core';
import { ApiRequestService } from 'jibe-components';
import ODataFilterBuilder from 'odata-filter-builder';
import { JobOrdersService } from '../../../../services/project-monitoring/job-orders/JobOrdersService';

@Injectable()
export class GanttChartService {
  constructor(
    private jobOrdersService: JobOrdersService,
    private requestService: ApiRequestService
  ) {}

  getData(projectId: string) {
    const request = { ...this.jobOrdersService.getJobOrdersRequest() };

    request.odata = { filter: new ODataFilterBuilder('and'), top: '99999999' };

    request.odata.filter = request.odata.filter.eq('projectUid', projectId);

    return this.requestService.sendApiReq(request);
  }
}
