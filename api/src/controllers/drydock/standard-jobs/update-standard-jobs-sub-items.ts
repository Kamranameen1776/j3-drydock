import { MiddlewareHandler } from "../core/middleware/MiddlewareHandler";
import { Request, Response } from "express";
import {
  UpdateStandardJobSubItemsCommand
} from "../../../application-layer/drydock/standard-jobs";

async function updateStandardJobsSubItems(req: Request, res: Response) {
  const middlewareHandler = new MiddlewareHandler();

  await middlewareHandler.ExecuteAsync(req, res, async (request: Request) => {
    const command = new UpdateStandardJobSubItemsCommand();

    return await command.ExecuteAsync(request);
  });
}

exports.post = updateStandardJobsSubItems;
