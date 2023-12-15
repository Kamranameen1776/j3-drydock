import { IsNotEmpty, IsString } from 'class-validator';

import { GetManyParams } from './GetManyParams';

export class DeleteManyParams extends GetManyParams {
    @IsString()
    @IsNotEmpty()
    readonly deletedBy: string;
}
