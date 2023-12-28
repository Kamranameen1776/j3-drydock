import { YardsRepository } from '../../../dal/drydock/yards/YardsRepository';
import { Query } from '../core/cqrs/Query';
import { GetYardsDto } from './dtos/GetYardsDto';
import { ReportGeneratorService } from '../../../bll/drydock/yards/reports';
import { Workbook } from 'exceljs';

export class GetYardsReportQuery extends Query<string, Workbook> {
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
    protected async MainHandlerAsync(): Promise<Workbook> {
        const dummyData = {
            title: 'SHIPYARD QUOTATION TEMPLATE',
            notes: `Please refer to the accompanying Drydock Specification for detailed description of repairs
Please observe that the format and layout of this document is maintained while edited. The document is subject to automated processing when returned.
Additional quoting rows can be created under each job, but the composition of columns are not to be altered.
The quotation currency MUST be the same for all quoted costs, and has to be chosen from the allowed list of currencies.`,
            yardRemark: `Quotation is provided basis our standard terms and conditions found here - www.keppel.com/terms.`,
            vessel: 'qwerty',
            requestedBy: 'ewq',
            yard: 'ds',
            project: 'SS1 - IMPERIA - 2024',
            period: '01 MARCH 1999 - 10 MARCH 2024',
            currency: 'EUR',
            discount: '20,00%',
            berthDays: 19,
            dockDays: 17,
            functions: [
                {
                    name: 'qwerty->qwerty',
                    jobs: [
                        {
                            specificationCode: 'qwqwqw',
                            specificationDescription: 'qwerty',
                            subItems: [
                                {
                                    code: 'dsa',
                                    description: 'dsa',
                                    qty: 2,
                                    uom: 'UOM',
                                    price: 500,
                                    discount: '50%',
                                    comment: 'comment',
                                },
                            ],
                        },
                    ],
                },
                {
                    name: 'asdf->asdf',
                    jobs: [
                        {
                            specificationCode: 'qwqwqw',
                            specificationDescription: 'qwerty',
                            subItems: [
                                {
                                    code: 'dsa',
                                    description: 'dsa',
                                    qty: 2,
                                    uom: 'UOM',
                                    price: 500,
                                    discount: '50%',
                                    comment: 'comment',
                                },
                                {
                                    code: 'dsa',
                                    description: 'dsa',
                                    qty: 89,
                                    uom: 'UOM',
                                    price: 543,
                                    discount: '10%',
                                    comment: 'comment',
                                },
                            ],
                        },
                        {
                            specificationCode: 'dsadsa',
                            specificationDescription: 'vcxvcxv',
                            subItems: [
                                {
                                    code: 'dsa',
                                    description: 'dsa',
                                    qty: 2,
                                    uom: 'UOM',
                                    price: 500,
                                    discount: '50%',
                                    comment: 'comment',
                                },
                            ],
                        },
                    ],
                },
            ],
            footer: 'END OF SPECIFICATIONS',
        };
        return this.yardReportService.generateReport(dummyData);
    }
}
