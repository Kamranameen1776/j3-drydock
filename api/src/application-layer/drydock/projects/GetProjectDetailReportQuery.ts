import { BusinessException } from '../../../bll/drydock/core/exceptions';
import { ProjectDetailReport } from '../../../bll/drydock/projects/ProjectReportService';
import { OdataRequest } from '../core/cqrs/odata/OdataRequest';
import { Query } from '../core/cqrs/Query';

export class GetProjectDetailReportQuery extends Query<OdataRequest, unknown> {
    service = new ProjectDetailReport();
    projectUid: string;

    protected async ValidationHandlerAsync(request: OdataRequest): Promise<void> {
        // the PDF export feature in J2Infra_API was initially developed for a task manager module, where incoming
        // parameters are arriving in "odata" which should be used to create a DB query. Our module has totally
        // different schema, so we can't use the odata query as is. The only way is to parse it and get the required
        // parameters. Example of incoming data:
        // {"$filter":"(job_history_uid eq '5C3B49D8-F13C-4644-9836-AEC25300F9C8') and (wltype eq 'dry_dock') and (templateUid eq 'BB94AAF5-4565-4BAA-9078-AA675CF124E2') and (vessel_id eq 91)"}
        const match = request.odata.odata.$filter.match(/job_history_uid eq '([^']+)'/);
        if (!match) {
            throw new BusinessException("Can't find job_history_uid in the request body");
        }
        this.projectUid = match[1];
    }

    protected async MainHandlerAsync(request: OdataRequest) {
        return this.service.getProjectDetailReport(this.projectUid, request.request.headers.authorization as string);
    }
}
