import { IsUUID } from 'class-validator';

export class ValidateFindingDeleteDto {
    @IsUUID('4')
    specificationUid: string;

    @IsUUID('4')
    findingUid: string;
}
