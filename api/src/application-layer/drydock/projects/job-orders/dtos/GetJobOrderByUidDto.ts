import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetJobOrderByUidDto {
    @IsUUID()
    @IsNotEmpty()
    uid: string;
}
