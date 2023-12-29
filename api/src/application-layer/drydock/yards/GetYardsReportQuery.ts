import { Workbook } from 'exceljs';

import { ReportGeneratorService } from '../../../bll/drydock/yards/reports';
import { YardsRepository } from '../../../dal/drydock/yards/YardsRepository';
import { Query } from '../core/cqrs/Query';

export class GetYardsReportQuery extends Query<any, any> {
    yardsRepository = new YardsRepository();
    yardReportService = new ReportGeneratorService();
    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(): Promise<void> {
        return;
    }

    /**
     * @returns All yard details
     */
    protected async MainHandlerAsync(query: any): Promise<any> {
        const { ProjectUid, YardUid } = query;
        const rawData = await this.yardsRepository.getReportData(ProjectUid, YardUid);
        const preparedData = this.yardReportService.prepareData(rawData);
        return {
            workbook: await this.yardReportService.generateReport(preparedData),
            filename: preparedData.filename,
        };
    }
}
