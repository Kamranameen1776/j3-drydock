import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
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
    UploadInvoiceRawDataUpdateDto,
} from './dto/UploadInvoiceDto';

export class UploadInvoiceService {
    public async getRawData(buffer: Buffer, ProjectUid: string): Promise<IUploadRawDataDto> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.getWorksheet(1) as ExcelJS.Worksheet;
        const invoiceId = worksheet.getCell('A1').value?.toString() as string;
        if (invoiceId !== ProjectUid) {
            throw new BusinessException({
                description: 'Incorrect project',
                message: 'The provided Excel file can not be imported',
            });
        }
        let index = 16;
        const update: Array<IUploadInvoiceRawDataUpdateDto> = [];
        const create: Array<IUploadInvoiceRawDataCreateDto> = [];
        let hasErrors = false;

        while (worksheet.getCell(`A${index}`).value !== invoiceId) {
            if (!!worksheet.getCell(`A${index}`).value) {
                if (!!worksheet.getCell(`B${index}`).value) {
                    const item: IUploadInvoiceRawDataUpdateDto = {
                        technicalData: worksheet.getCell(`A${index}`).value as string,
                        qty: worksheet.getCell(`D${index}`).value as number,
                        uom: worksheet.getCell(`E${index}`).value as string,
                        unitPrice: worksheet.getCell(`F${index}`).value as string,
                        discount: worksheet.getCell(`G${index}`).value as string,
                        comments: worksheet.getCell(`I${index}`).value as string,
                    };

                    const validationObject = plainToClass(UploadInvoiceRawDataUpdateDto, item);

                    const errors = await validate(validationObject);

                    if (errors.length > 0) {
                        this.handleValidationErrors(errors, item);
                        hasErrors = true;
                    }

                    update.push(item);
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
            hasErrors,
        };
    }

    public prepareUpdateData(
        data: Array<IUploadInvoiceRawDataUpdateDto>,
        UnitTypes: Array<UnitTypeEntity>,
    ): SpecificationDetailsSubItemEntity[] {
        const dataToUpdate: Array<SpecificationDetailsSubItemEntity> = [];
        data.forEach((item: IUploadInvoiceRawDataUpdateDto) => {
            const obj = JSON.parse(item.technicalData);
            if (this.isUpdateRequired(item, obj)) {
                this.ValidateDiscount(item.discount);

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

    public prepareCreateData(
        data: Array<IUploadInvoiceRawDataCreateDto>,
        UnitTypes: Array<UnitTypeEntity>,
    ): Array<SpecificationDetailsSubItemEntity> {
        const dataToCreate: Array<SpecificationDetailsSubItemEntity> = [];
        data.forEach((item: IUploadInvoiceRawDataCreateDto) => {
            this.ValidateDiscount(item.discount);

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

    private ValidateDiscount(discount: string) {
        const discountValue = parseFloat(discount);

        if (discountValue < 0 || discountValue > 100) {
            throw new BusinessException('Discount should be between 0 and 100');
        }
    }

    private isUpdateRequired(item: any, obj: any) {
        let flag = false;
        const keys = ['uom', 'qty', 'unitPrice', 'discount', 'comments'];
        keys.forEach((key) => {
            flag = flag || obj[key] != item[key];
        });
        return flag;
    }

    private handleValidationErrors(errors: ValidationError[], item: IUploadInvoiceRawDataUpdateDto) {
        errors.forEach((error) => {
            const property = error.property as keyof IUploadInvoiceRawDataUpdateDto;
            switch (property) {
                case 'qty':
                    item.qty = 0;
                    break;
                case 'unitPrice':
                    item.unitPrice = '';
                    break;
                case 'discount':
                    item.discount = '0';
                    break;
            }
        });
    }
}
