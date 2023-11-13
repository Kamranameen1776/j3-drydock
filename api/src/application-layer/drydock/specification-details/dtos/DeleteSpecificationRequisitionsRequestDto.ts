import { IsUUID } from "class-validator";

export class DeleteSpecificationRequisitionsRequestDto {
    @IsUUID('4')
    specificationUid: string;

    @IsUUID('4')
    requisitionUid: string;
}
