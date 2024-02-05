import { ValidationError } from 'class-validator';
import { Request } from 'express';
import * as httpStatus from 'http-status-codes';
import { AccessRights } from 'j2utils';
import { Controller } from 'tsoa';

import { UserFromToken } from '../../../../application-layer/drydock/core/cqrs/UserDto';
import { AuthorizationException, BusinessException } from '../../../../bll/drydock/core/exceptions';
import { log } from '../../../../logger';
import { ProblemDetails, ProblemDetailsType } from '../ProblemDetails';
import { ExceptionLogDataDto } from './ExceptionLogDataDto';

type ResultGetterRequestHandler<TResult> = (req: Request) => Promise<TResult>;

export class MiddlewareV2Handler {
    functionCode?: string;

    constructor(functionCode?: string) {
        this.functionCode = functionCode;
    }

    public async ExecuteAsync<TResult>(
        controller: Controller,
        req: Request,
        getResult: ResultGetterRequestHandler<TResult>,
    ): Promise<TResult> {
        try {
            const authUser = AccessRights.authorizationDecode(req) as UserFromToken;
            const result = await getResult(req);

            return result;
        } catch (exception: unknown) {
            const error: Error = exception as Error;

            const logMessage = error.message;
            const logData = new ExceptionLogDataDto();
            logData.Stack = error.stack;

            const method = req.path;
            const userId = AccessRights.getUserIdFromReq(req);
            const moduleCode = 'project';
            const functionCode = this.functionCode || 'project';
            const locationId = null;
            const isClient = null;

            if (exception instanceof BusinessException) {
                const ex = exception as BusinessException;

                const details = new ProblemDetails({
                    title: ex.Details.message,
                    detail: ex.Details.description,
                    type: ProblemDetailsType.BusinessException,
                });

                logData.Details = details;

                // Business exceptions it is expected behavior
                log.warn(logMessage, logData, method, userId, moduleCode, functionCode, null, locationId, isClient);

                controller.setStatus(httpStatus.UNPROCESSABLE_ENTITY);

                return details.getJibeError() as any;
            } else if (exception instanceof AuthorizationException) {
                const details = new ProblemDetails({
                    title: 'Access is denied.',
                    type: ProblemDetailsType.AuthorizationException,
                });

                logData.Details = details;

                log.warn(logMessage, logData, method, userId, moduleCode, functionCode, null, locationId, isClient);

                controller.setStatus(httpStatus.FORBIDDEN);

                return details.getJibeError() as any;
            } else if (exception instanceof Array && exception.length && exception[0] instanceof ValidationError) {
                //TODO: think how to refactor it;
                const error = exception[0];
                let message = 'Validation request has failed';
                if (error.constraints && error.property) {
                    const keys = Object.keys(error.constraints);
                    if (keys.length) {
                        message = error.constraints[keys[0]];
                    }
                }

                //log to DB
                const details = new ProblemDetails({
                    title: 'Request validation error',
                    detail: message,
                    type: ProblemDetailsType.ValidationException,
                });
                logData.Details = details;
                log.warn(message, logData, method, userId, moduleCode, functionCode, null, locationId, isClient);

                controller.setStatus(httpStatus.UNPROCESSABLE_ENTITY);

                return details.getJibeError() as any;
            }

            const details = new ProblemDetails({
                title: 'Server Error',
                type: ProblemDetailsType.ApplicationException,
            });
            logData.Details = details;
            log.error(logMessage, logData, method, userId, moduleCode, functionCode, null, locationId, isClient);

            controller.setStatus(httpStatus.INTERNAL_SERVER_ERROR);
            return details.getJibeError() as any;
        }
    }
}
