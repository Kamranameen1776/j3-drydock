import { ArrayNotEmpty, IsDefined, IsUUID } from 'class-validator';

export class CreateSpecificationFromStandardJobDto {
    @IsDefined()
    @IsUUID(4)
    ProjectUid: string;

    @IsDefined()
    @IsUUID(4, { each: true })
    @ArrayNotEmpty()
    StandardJobUid: string[];

    token: string;

    createdBy: string;
}
