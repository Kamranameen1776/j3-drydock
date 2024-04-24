import * as express from 'express';
import multer, { Multer } from 'multer';
import { Controller, Post, Request, Route } from 'tsoa';

import { UploadYardsInvoiceCommand } from '../../../application-layer/drydock/yards/UploadYardsInvoiceCommand';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

const upload: Multer = multer({ storage: multer.memoryStorage() });
export async function uploadYardInvoice(req: express.Request, res: express.Response) {
    upload.single('file')(req, res, async () => {
        const middlewareHandler = new MiddlewareHandler();

        await middlewareHandler.ExecuteAsync(req, res, async () => {
            return new UploadYardsController().uploadYardInvoice(req);
        });
    });
}

exports.post = uploadYardInvoice;

@Route('drydock/yards/upload-yard-invoice')
export class UploadYardsController extends Controller {
    @Post()
    public async uploadYardInvoice(@Request() request: express.Request) {
        const query = new UploadYardsInvoiceCommand();

        return query.ExecuteAsync(request);
    }
}
