import { IsUUID } from "class-validator";

export class LinkSpecificationRequisitionsRequestDto {
    @IsUUID('4')
    specificationUid: string;

    @IsUUID('4', { each: true })
    requisitionUid: string[];
}
