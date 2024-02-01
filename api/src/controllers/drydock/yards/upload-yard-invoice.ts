import { Request, Response } from 'express';
import multer, { Multer } from 'multer';
import { Body, Controller, Post } from 'tsoa';

import { UploadYardsInvoiceCommand } from '../../../application-layer/drydock/yards/UploadYardsInvoiceCommand';
import { ApplicationException } from '../../../bll/drydock/core/exceptions';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

const upload: Multer = multer({ storage: multer.memoryStorage() });
export async function uploadYardInvoice(req: Request, res: Response) {
    upload.single('file')(req, res, async (err: string) => {
        if (err) {
            throw new ApplicationException(err);
        }

        if (!req.file || !req.file.buffer || req.file.buffer.length === 0) throw new ApplicationException('No file');

        const middlewareHandler = new MiddlewareHandler();

        await middlewareHandler.ExecuteAsync(req, res, async () => {
            const result = await new UploadYardsController().uploadYardInvoice(req);

            return result;
        });
    });
}

exports.post = uploadYardInvoice;

// @Route('drydock/yards/upload-yard-invoice')
export class UploadYardsController extends Controller {
    @Post()
    public async uploadYardInvoice(@Body() request: Request): Promise<void> {
        const query = new UploadYardsInvoiceCommand();

        const result = await query.ExecuteAsync(request);

        return result;
    }
}
