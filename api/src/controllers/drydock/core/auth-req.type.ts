import { Request } from 'express';

import { UserFromToken } from '../../../application-layer/drydock/core/cqrs/UserDto';

export type AuthRequest = Request & { authUser: UserFromToken };
