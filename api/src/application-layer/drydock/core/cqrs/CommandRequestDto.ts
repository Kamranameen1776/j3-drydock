import { Request } from 'express';

import { UserFromToken } from './UserDto';

export type CommandRequest = {
    request: Request;
    user: UserFromToken;
};
