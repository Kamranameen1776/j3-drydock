import { ArrayMinSize, ArrayUnique, IsArray, IsUUID, ValidateNested } from 'class-validator';

export class UpdateSpecificationPmsDto {
    @IsUUID('4')
    uid: string;

    @IsArray()
    @ArrayUnique()
    @IsUUID('4', { each: true })
    @ArrayMinSize(1)
    PmsIds: Array<string>;
}

export class UpdateSpecificationPmsRequestDto {
    @ValidateNested()
    body: UpdateSpecificationPmsDto;
}
