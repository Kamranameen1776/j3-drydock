import { IsUUID } from 'class-validator';

export class GetSpecificationQueryDto {
    @IsUUID('4')
    uid: string;
}
