import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetLatestJobOrderBySpecificationDto {
    @IsUUID()
    @IsNotEmpty()
    specificationUid: string;
}
