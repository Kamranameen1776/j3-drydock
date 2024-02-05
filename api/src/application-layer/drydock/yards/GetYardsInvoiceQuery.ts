import { validate } from 'class-validator';

import { InvoiceGeneratorService } from '../../../bll/drydock/yards/invoice';
import { YardsRepository } from '../../../dal/drydock/yards/YardsRepository';
import { Query } from '../core/cqrs/Query';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { DownloadQuery, InvoiceDto } from './dtos/InvoiceDto';

export class GetYardsInvoiceQuery extends Query<DownloadQuery, InvoiceDto> {
    yardsRepository = new YardsRepository();
    yardInvoiceService = new InvoiceGeneratorService();
    uow: UnitOfWork = new UnitOfWork();
    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: DownloadQuery): Promise<void> {
        const result = await validate(request);

        if (result.length) {
            throw result;
        }
    }

    /**
     * @returns All yard details
     */
    protected async MainHandlerAsync(req: DownloadQuery): Promise<InvoiceDto> {
        const { ProjectUid, YardUid } = req;
        const rawData = await this.yardsRepository.getInvoiceData(ProjectUid as string, YardUid as string);
        const preparedData = this.yardInvoiceService.prepareData(rawData);
        const buffer = await this.yardInvoiceService.generateInvoice(preparedData);
        return {
            buffer,
            filename: preparedData.filename,
        };
    }
}
