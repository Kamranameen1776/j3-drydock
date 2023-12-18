import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetJobOrderBySpecificationDto {
    @IsUUID()
    @IsNotEmpty()
    SpecificationUid: string;
}
