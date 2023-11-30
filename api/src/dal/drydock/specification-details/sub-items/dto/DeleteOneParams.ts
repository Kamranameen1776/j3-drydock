import { IsNotEmpty, IsString } from 'class-validator';

import { GetOneParams } from './GetOneParams';

export class DeleteOneParams extends GetOneParams {
    @IsString()
    @IsNotEmpty()
    readonly deletedBy: string;
}
