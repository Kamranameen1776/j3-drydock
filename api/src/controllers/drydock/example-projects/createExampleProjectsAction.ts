import { Request, Response } from 'express';

import { CreateExampleProjectCommand } from '../../../application-layer/drydock/example-projects/create-example-projects/CreateExampleProjectCommand';
import { CreateExampleProjectDto } from '../../../application-layer/drydock/example-projects/create-example-projects/CreateExampleProjectDto';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

/**
 * This handler returns all available shipments
 * GET /drydock/example-projects
 * @exports
 * @param {Request} req Express request
 * @param {Response} res Express response
 */
export async function createExampleProjectsAction(req: Request, res: Response) {
    const middlewareHandler = new MiddlewareHandler();

    await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
        // Prepare command payload
        const model: CreateExampleProjectDto = request.body;
        model.UserUid = request.user.userUid;

        const command = new CreateExampleProjectCommand();

        // Execute command
        const project = await command.ExecuteAsync(model);

        return project;
    });
}
