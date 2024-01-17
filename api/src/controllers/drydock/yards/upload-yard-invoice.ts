import { Request, Response } from 'express';
import multer, { Multer } from 'multer';

import { UploadYardsInvoiceCommand } from '../../../application-layer/drydock/yards/UploadYardsInvoiceCommand';
import { ApplicationException } from '../../../bll/drydock/core/exceptions';
import { MiddlewareHandler } from '../core/middleware/MiddlewareHandler';

const upload: Multer = multer({ storage: multer.memoryStorage() });
export async function uploadYardInvoice(req: Request, res: Response) {
    upload.single('file')(req, res, async (err: string) => {
        if (err) throw new ApplicationException(err);
        if (!req.file || !req.file.buffer || req.file.buffer.length === 0) throw new ApplicationException('No file');
        const middlewareHandler = new MiddlewareHandler();
        await middlewareHandler.ExecuteAsync(req, res, async () => {
            const query = new UploadYardsInvoiceCommand();
            await query.ExecuteAsync(req);
        });
    });
}

exports.post = uploadYardInvoice;
