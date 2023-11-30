import { ClassConstructor, type ClassTransformOptions as TransformParams, plainToInstance } from 'class-transformer';
import { validate, type ValidatorOptions as ValidateParams } from 'class-validator';

/** @private */
interface Params {
    readonly transform?: TransformParams;
    readonly validate?: ValidateParams;
}

export async function validateAgainstModel<Model extends object>(
    Model: ClassConstructor<Model>,
    plain: object,
    params?: Params,
): Promise<Model> {
    const instance = plainToInstance(Model, plain, params?.transform);
    const errors = await validate(instance, params?.validate);

    if (errors.length > 0) {
        throw errors;
    }

    return instance;
}
