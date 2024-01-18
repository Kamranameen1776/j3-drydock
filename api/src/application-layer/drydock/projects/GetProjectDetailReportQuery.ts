import { Request } from 'express';

import { ProjectDetailReport } from '../../../bll/drydock/projects/ProjectReportService';
import { Query } from '../core/cqrs/Query';

export class GetProjectDetailReportQuery extends Query<Request, any> {
    service = new ProjectDetailReport();

    protected async MainHandlerAsync(request: Request) {
        // TODO: find a better way to deal with this incoming odata parameter
        const reportData = request.body.odata.$filter.split('and');
        const uid = reportData[0].split(' ')[2].slice(1, -2);
        return this.service.getProjectDetailReport(uid, request.headers.authorization as string);
    }
}
