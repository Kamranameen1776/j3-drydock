/* eslint-disable @typescript-eslint/no-namespace */

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { AccessRights } from 'j2utils';
import path from 'path';

/**
 * Extends the Express Request interface to include the 'user' object
 * -> provided by AccessRights.accessRightsMiddleware middleware
 */
declare global {
    namespace Express {
        export interface Request {
            user: { userUid: string };
        }
    }
}

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(AccessRights.accessRightsMiddleware);
app.use(bodyParser.json({ limit: '5mb' }));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const autoRoutes = require('j3-express-auto-routes')(app);
autoRoutes(path.join(__dirname, './controllers'));

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.use(express.static('coverage'));

export { app };
export default app;
