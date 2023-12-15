import { IsUUID } from 'class-validator';

/** Base class for params of a generic action related to specification details sub-items */
export abstract class SubItemActionParams {
    @IsUUID('4')
    readonly specificationDetailsUid: string;
}
