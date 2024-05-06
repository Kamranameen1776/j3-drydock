import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';
import * as ExcelJS from 'exceljs';
import { File } from 'tsoa';

import { IsFile } from '../../../../shared/validators/is-file';

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

export class UploadRequest {
    @Type(() => UploadBody)
    @ValidateNested()
    body: UploadBody;

    @IsFile({
        mime: [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'application/msexcel',
            'application/x-msexcel',
            'application/x-ms-excel',
            'application/x-excel',
            'application/x-dos_ms_excel',
            'application/xls',
            'application/x-xls',
        ],
    })
    file?: File;
}
