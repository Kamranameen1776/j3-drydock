import { ApiRequestService } from 'j2utils';

import { ApiRequestMethods } from '../../shared/enum/ApiRequestMethods.enum';

export class SlfAccessor {
    UserSlfPath = 'Infra/slf/get-user-slf-details?slfType=vessel';

    public async getUserAssignedVessels(token: string): Promise<number[]> {
        const userVessels = await new ApiRequestService().infra(token, this.UserSlfPath, ApiRequestMethods.Get);
        return userVessels.data.sort();
    }
}
