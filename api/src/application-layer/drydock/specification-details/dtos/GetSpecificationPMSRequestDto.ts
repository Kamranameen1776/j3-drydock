import { IsUUID, ValidateNested } from 'class-validator';

export class GetSpecificationQueryDto {
    @IsUUID('4')
    uid: string;
}

export class GetSpecificationPmsRequestDto {
    @ValidateNested()
    query: GetSpecificationQueryDto;
}
