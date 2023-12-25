import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import * as httpStatus from 'http-status-codes';
import { AccessRights } from 'j2utils';

import { UserFromToken } from '../../../../application-layer/drydock/core/cqrs/UserDto';
import {
    ApplicationException,
    AuthorizationException,
    BusinessException,
} from '../../../../bll/drydock/core/exceptions';
import { log } from '../../../../logger';
import { ProblemDetails, ProblemDetailsType } from '../ProblemDetails';
import { ExceptionLogDataDto } from './ExceptionLogDataDto';

type ResultGetterRequestHandler<TResult> = (req: Request, res: Response, user: UserFromToken) => Promise<TResult>;
export class MiddlewareHandler {
    functionCode?: string;

    constructor(functionCode?: string) {
        this.functionCode = functionCode;
    }

    public async ExecuteAsync<TResult>(req: Request, res: Response, getResult: ResultGetterRequestHandler<TResult>) {
        await this.ExceptionHandler(req, res, getResult);
    }

    private async ExceptionHandler<TResult>(
        req: Request,
        res: Response,
        getResult: ResultGetterRequestHandler<TResult>,
    ): Promise<void> {
        try {
            const authUser = AccessRights.authorizationDecode(req) as UserFromToken;
            const result = await getResult(req, res, authUser);

            res.status(httpStatus.OK).json(result);

            return;
        } catch (exception: unknown) {
            const error: Error = exception as Error;

            const logMessage = error.message;
            const logData = new ExceptionLogDataDto();
            logData.Stack = error.stack;

            const method = req.path;
            const userId = AccessRights.getUserIdFromReq(req);
            const moduleCode = 'project';
            const functionCode = this.functionCode || 'project';
            const api = 'DryDockAPI';
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
                log.warn(logMessage, logData, method, userId, moduleCode, functionCode, api, locationId, isClient);

                res.status(httpStatus.UNPROCESSABLE_ENTITY).json(details.params);

                return;
            } else if (exception instanceof AuthorizationException) {
                const details = new ProblemDetails({
                    title: 'Access is denied.',
                    type: ProblemDetailsType.AuthorizationException,
                });

                logData.Details = details;

                log.warn(logMessage, logData, method, userId, moduleCode, functionCode, api, locationId, isClient);

                res.status(httpStatus.FORBIDDEN).json(details.params);

                return;
            } else if (exception instanceof ApplicationException) {
                const details = new ProblemDetails({
                    title: 'Server Error',
                    type: ProblemDetailsType.ApplicationException,
                });

                logData.Details = details;

                log.error(logMessage, logData, method, userId, moduleCode, functionCode, api, locationId, isClient);

                res.status(httpStatus.INTERNAL_SERVER_ERROR).json(details.params);

                return;
            } else if (exception instanceof Array && exception.length && exception[0] instanceof ValidationError) {
                //TODO: think how to refactor it;
                const error = exception[0];
                let message = 'Validation request has failed';
                let property = 'Something';
                if (error.constraints && error.property) {
                    property = error.property;
                    const keys = Object.keys(error.constraints);
                    if (keys.length) {
                        message = error.constraints[keys[0]];
                    }
                }

                //log to DB
                const details = new ProblemDetails({
                    title: 'Request validation error',
                    type: ProblemDetailsType.ValidationException,
                });
                logData.Details = details;
                log.warn(message, logData, method, userId, moduleCode, functionCode, api, locationId, isClient);

                res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                    title: 'Request validation error',
                    property,
                    message,
                });

                return;
            }

            log.error(logMessage, logData, method, userId, moduleCode, functionCode, api, locationId, isClient);

            res.status(httpStatus.BAD_REQUEST).send();
        }
    }
}
