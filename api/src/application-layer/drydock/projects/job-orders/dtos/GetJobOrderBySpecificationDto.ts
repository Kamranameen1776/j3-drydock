import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetJobOrderBySpecificationDto {
    @IsUUID()
    @IsNotEmpty()
    specificationUid: string;
}
