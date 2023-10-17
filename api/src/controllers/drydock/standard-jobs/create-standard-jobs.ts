import { MiddlewareHandler } from "../core/middleware/MiddlewareHandler";
import { Request, Response } from "express";
import { CreateStandardJobsCommand } from "../../../application-layer/drydock/standard-jobs";

async function getStandardJobs(req: Request, res: Response) {
  const middlewareHandler = new MiddlewareHandler();

  await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
    const command = new CreateStandardJobsCommand();

    return await command.ExecuteAsync(request);
  });
}

exports.post = getStandardJobs;
