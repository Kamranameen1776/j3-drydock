import { type RequestHandler } from 'express';

import { TestQuery } from './TestQuery';

const test: RequestHandler = async (req, res): Promise<void> => {
    try {
        const query = new TestQuery();
        const result = await query.ExecuteAsync();

        res.send({ result });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
};

exports.get = test;
