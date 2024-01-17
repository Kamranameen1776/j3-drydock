import { IsUUID } from 'class-validator';
import * as ExcelJS from 'exceljs';
export class DownloadQuery {
    @IsUUID()
    ProjectUid: string;

    @IsUUID()
    YardUid: string;
}
export class InvoiceDto {
    filename: string;
    buffer: ExcelJS.Buffer;
}

export class UploadBody {
    @IsUUID()
    ProjectUid: string;
}
