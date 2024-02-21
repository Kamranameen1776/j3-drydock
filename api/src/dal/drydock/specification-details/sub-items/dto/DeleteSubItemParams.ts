import { IsNotEmpty, IsString } from 'class-validator';

import { GetSubItemParams } from './GetSubItemParams';

export class DeleteSubItemParams extends GetSubItemParams {
    @IsString()
    @IsNotEmpty()
    readonly deletedBy: string;
}
