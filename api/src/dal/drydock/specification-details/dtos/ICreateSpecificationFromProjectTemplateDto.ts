import { IsDefined, IsUUID } from 'class-validator';

export class CreateSpecificationFromProjectTemplateDto {
    @IsDefined()
    @IsUUID(4)
    ProjectUid: string;

    @IsDefined()
    @IsUUID(4)
    ProjectTemplateUid: string;

    token: string;

    createdBy: string;
}
