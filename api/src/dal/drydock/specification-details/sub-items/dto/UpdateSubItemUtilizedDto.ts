import { IsNumber, IsUUID, ValidateNested } from 'class-validator';

export class SubItemUtilized {
    @IsUUID('4')
    uid: string;

    @IsNumber()
    utilized: number;
}

export class UpdateSubItemUtilizedDto {
    @ValidateNested({ each: true })
    subItems: SubItemUtilized[];

    @IsUUID('4')
    specificationDetailsUid: string;

    UserId: string;
}
