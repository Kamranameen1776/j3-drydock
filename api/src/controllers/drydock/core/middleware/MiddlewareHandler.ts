import { Request, Response } from 'express';
import * as httpStatus from 'http-status-codes';
import { AccessRights } from 'j2utils';

import { ApplicationException } from '../../../../bll/drydock/core/exceptions/ApplicationException';
import { AuthorizationException } from '../../../../bll/drydock/core/exceptions/AuthorizationException';
import { BusinessException } from '../../../../bll/drydock/core/exceptions/BusinessException';
import { log } from '../../../../logger';
import { ProblemDetails, ProblemDetailsType } from '../ProblemDetails';
import { ExceptionLogDataDto } from './ExceptionLogDataDto';

type NextFunction<TResult> = (req: Request, res: Response) => Promise<TResult>;

export class MiddlewareHandler {
    public async ExecuteAsync<TResult>(req: Request, res: Response, func: NextFunction<TResult>) {
        await this.ExceptionHandler(req, res, func);
    }

    private async ExceptionHandler<TResult>(req: Request, res: Response, next: NextFunction<TResult>): Promise<void> {
        try {
            const result = await next(req, res);

            res.status(httpStatus.OK).json(result);

            return;
        } catch (exception: unknown) {
            const error: Error = exception as Error;

            const logMessage = error.message;
            const logData = new ExceptionLogDataDto();
            logData.Stack = error.stack;

            const method = req.method;
            const userId = AccessRights.getUserIdFromReq(req);
            const moduleCode = 'dry_dock';
            const functionCode = null;
            const api = req.path;
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

                res.status(httpStatus.BAD_REQUEST).json(details.params);

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
            }

            log.error(logMessage, logData, method, userId, moduleCode, functionCode, api, locationId, isClient);

            res.status(httpStatus.BAD_REQUEST).send();
        }
    }
}
