import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetSpecificationByUidDto {
    @IsNotEmpty()
    @IsUUID()
    public uid: string;
}
