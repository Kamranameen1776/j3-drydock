import * as ExcelJS from 'exceljs';
import { DataUtilService } from 'j2utils';

import { SpecificationDetailsEntity } from '../../../entity/drydock';
import {
    calculateCost,
    SpecificationDetailsSubItemEntity,
    SubItemCostFactorsExcerpt,
} from '../../../entity/drydock/SpecificationDetailsSubItemEntity';
import { UnitTypeEntity } from '../../../entity/drydock/UnitTypeEntity';
import { BusinessException } from '../core/exceptions';
import {
    IUploadInvoiceRawDataCreateDto,
    IUploadInvoiceRawDataUpdateDto,
    IUploadRawDataDto,
} from './dto/UploadInvoiceDto';

export class UploadInvoiceService {
    public async getRawData(buffer: Buffer, ProjectUid: string): Promise<IUploadRawDataDto> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.getWorksheet(1) as ExcelJS.Worksheet;
        const invoiceId = worksheet.getCell('A1').value?.toString() as string;
        if (invoiceId !== ProjectUid) {
            throw new BusinessException('That invoice doesnt belong to this project');
        }
        let index = 16;
        const update: Array<IUploadInvoiceRawDataUpdateDto> = [];
        const create: Array<IUploadInvoiceRawDataCreateDto> = [];

        while (worksheet.getCell(`A${index}`).value !== invoiceId) {
            if (!!worksheet.getCell(`A${index}`).value) {
                if (!!worksheet.getCell(`B${index}`).value) {
                    update.push({
                        technicalData: worksheet.getCell(`A${index}`).value as string,
                        qty: worksheet.getCell(`D${index}`).value as number,
                        uom: worksheet.getCell(`E${index}`).value as string,
                        unitPrice: worksheet.getCell(`F${index}`).value as string,
                        discount: worksheet.getCell(`G${index}`).value as string,
                        comments: worksheet.getCell(`I${index}`).value as string,
                    });
                } else if (!!worksheet.getCell(`C${index}`).value) {
                    const text = worksheet.getCell(`C${index}`).value as string;
                    const lines = text.split('\n');
                    const subject = lines.shift() as string;
                    let description: string | undefined = undefined;
                    if (lines.length) {
                        description = lines.join('\n');
                    }
                    create.push({
                        technicalData: worksheet.getCell(`A${index}`).value as string,
                        subject,
                        description,
                        qty: worksheet.getCell(`D${index}`).value as number,
                        uom: worksheet.getCell(`E${index}`).value as string,
                        unitPrice: worksheet.getCell(`F${index}`).value as string,
                        discount: worksheet.getCell(`G${index}`).value as string,
                        comments: worksheet.getCell(`I${index}`).value as string,
                    });
                }
            }
            index++;
        }
        return {
            invoiceId,
            update,
            create,
        };
    }
    public async prepareUpdateData(
        data: Array<IUploadInvoiceRawDataUpdateDto>,
        UnitTypes: Array<UnitTypeEntity>,
    ): Promise<Array<SpecificationDetailsSubItemEntity>> {
        const dataToUpdate: Array<SpecificationDetailsSubItemEntity> = [];
        data.forEach((item: IUploadInvoiceRawDataUpdateDto) => {
            const obj = JSON.parse(item.technicalData);
            if (this.isUpdateRequired(item, obj)) {
                const ut = UnitTypes.find((unit) => unit.types === item.uom);
                const entity = new SpecificationDetailsSubItemEntity();
                entity.quantity = item.qty;
                entity.unitPrice = item.unitPrice;
                entity.discount = item.discount;
                entity.yardComments = item.comments;
                entity.uid = obj.uid;
                if (ut) {
                    entity.unitType = ut;
                }
                const newSubItemCostFactorsExcerpt: SubItemCostFactorsExcerpt = {
                    quantity: entity.quantity ?? 0,
                    unitPrice: entity.unitPrice ?? '0',
                    discount: entity.discount ?? '0',
                    estimatedCost: entity.estimatedCost ?? 0,
                };
                entity.cost = calculateCost(newSubItemCostFactorsExcerpt).toFixed(2);
                dataToUpdate.push(entity);
            }
        });
        return dataToUpdate;
    }

    public async prepareCreateData(
        data: Array<IUploadInvoiceRawDataCreateDto>,
        UnitTypes: Array<UnitTypeEntity>,
    ): Promise<Array<SpecificationDetailsSubItemEntity>> {
        const dataToCreate: Array<SpecificationDetailsSubItemEntity> = [];
        data.forEach((item: IUploadInvoiceRawDataCreateDto) => {
            const SpecificationUid = item.technicalData;
            const ut = UnitTypes.find((unit) => unit.types === item.uom);
            const entity = new SpecificationDetailsSubItemEntity();
            entity.uid = DataUtilService.newUid();
            entity.subject = item.subject;
            entity.description = item.description;
            entity.quantity = item.qty;
            entity.unitPrice = item.unitPrice;
            entity.discount = item.discount;
            entity.yardComments = item.comments;
            entity.specificationDetails = {
                uid: SpecificationUid,
            } as SpecificationDetailsEntity;
            entity.active_status = true;
            const newSubItemCostFactorsExcerpt: SubItemCostFactorsExcerpt = {
                quantity: entity.quantity ?? 0,
                unitPrice: entity.unitPrice ?? '0',
                discount: entity.discount ?? '0',
                estimatedCost: entity.estimatedCost ?? 0,
            };
            entity.cost = calculateCost(newSubItemCostFactorsExcerpt).toFixed(2);
            if (ut) {
                entity.unitType = ut;
            }
            dataToCreate.push(entity);
        });
        return dataToCreate;
    }
    private isUpdateRequired(item: any, obj: any) {
        let flag = false;
        const keys = ['uom', 'qty', 'unitPrice', 'discount', 'comments'];
        keys.forEach((key) => {
            flag = flag || obj[key] != item[key];
        });
        return flag;
    }
}
