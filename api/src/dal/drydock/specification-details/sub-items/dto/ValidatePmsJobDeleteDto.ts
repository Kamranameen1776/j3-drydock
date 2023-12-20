import { IsUUID } from 'class-validator';

export class ValidatePmsJobDeleteDto {
    @IsUUID('4')
    specificationUid: string;

    @IsUUID('4')
    pmsJobUid: string;
}
