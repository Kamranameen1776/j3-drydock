import { MiddlewareHandler } from "../core/middleware/MiddlewareHandler";
import { Request, Response } from "express";
import { DeleteStandardJobsCommand } from "../../../application-layer/drydock/standard-jobs";

async function deleteStandardJobs(req: Request, res: Response) {
  const middlewareHandler = new MiddlewareHandler();

  await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
    const command = new DeleteStandardJobsCommand();

    return await command.ExecuteAsync(request);
  });
}

exports.delete = deleteStandardJobs;
