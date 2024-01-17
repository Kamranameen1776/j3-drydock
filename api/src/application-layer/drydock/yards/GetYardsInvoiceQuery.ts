import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';

import { InvoiceGeneratorService } from '../../../bll/drydock/yards/invoice';
import { YardsRepository } from '../../../dal/drydock/yards/YardsRepository';
import { Query } from '../core/cqrs/Query';
import { UnitOfWork } from '../core/uof/UnitOfWork';
import { DownloadQuery, InvoiceDto } from './dtos/InvoiceDto';

export class GetYardsInvoiceQuery extends Query<Request, InvoiceDto> {
    yardsRepository = new YardsRepository();
    yardInvoiceService = new InvoiceGeneratorService();
    uow: UnitOfWork = new UnitOfWork();
    protected async AuthorizationHandlerAsync(): Promise<void> {
        return;
    }

    protected async ValidationHandlerAsync(request: Request): Promise<void> {
        const query: DownloadQuery = plainToClass(DownloadQuery, request.query);
        const result = await validate(query);
        if (result.length) {
            throw result;
        }
        return;
    }

    /**
     * @returns All yard details
     */
    protected async MainHandlerAsync(req: Request): Promise<InvoiceDto> {
        const { ProjectUid, YardUid } = req.query;
        const rawData = await this.yardsRepository.getInvoiceData(ProjectUid as string, YardUid as string);
        const preparedData = this.yardInvoiceService.prepareData(rawData);
        const buffer = await this.yardInvoiceService.generateInvoice(preparedData);
        return {
            buffer,
            filename: preparedData.filename,
        };
    }
}
