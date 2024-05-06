import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export interface IUploadInvoiceRawDataUpdateDto {
    technicalData: string;
    qty: number;
    uom: string;
    unitPrice: string;
    discount: string;
    comments: string;
}

export interface IUploadInvoiceRawDataCreateDto extends IUploadInvoiceRawDataUpdateDto {
    description: string | undefined;
    subject: string;
}

export interface IUploadRawDataDto {
    invoiceId: string;
    update: Array<IUploadInvoiceRawDataUpdateDto>;
    create: Array<IUploadInvoiceRawDataCreateDto>;
    hasErrors?: boolean;
}

export class UploadInvoiceRawDataUpdateDto implements IUploadInvoiceRawDataUpdateDto {
    @IsString()
    technicalData: string;

    @IsOptional()
    @IsNumber()
    qty: number;

    @IsOptional()
    uom: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    unitPrice: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Max(1)
    @Min(0)
    discount: string;

    @IsOptional()
    @IsString()
    comments: string;
}
