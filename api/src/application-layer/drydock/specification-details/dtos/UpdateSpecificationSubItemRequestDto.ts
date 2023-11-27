import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class UpdateSpecificationSubItemDto {
    @IsString()
    uid: string;

    @IsString()
    itemUid: string;

    @IsNumber()
    qty: number;

    @IsString()
    catalogUid: string;
}

export class UpdateSpecificationSubItemRequestDto {
    @ValidateNested()
    body: UpdateSpecificationSubItemDto;

    headers: {
        authorization: string;
    };
}
