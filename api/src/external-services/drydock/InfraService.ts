import { ApiRequestService } from 'j2utils';

import { TaskManagerConstants } from '../../shared/constants';
import { ApiRequestMethods } from '../../shared/enum/ApiRequestMethods.enum';

export class InfraService {
    public async CopyAttachmentsFromStandardJobToSpecification(
        token: string,
        copy_from_key1: string,
        copy_to_key1: string,
        copy_to_key2: string,
        copy_to_key3: string,
        syncToVesselId: number,
    ): Promise<void> {
        const apiEndpoint = 'infra/file/copy-files-to-new-record';

        const payload = {
            copy_from: {
                key1: [copy_from_key1],
                module_code: TaskManagerConstants.standardJob.module_code,
                function_code: TaskManagerConstants.standardJob.function_code,
            },
            copy_to: {
                keys: [
                    {
                        key1: copy_to_key1,
                        key2: copy_to_key2,
                        key3: copy_to_key3,
                    },
                ],
                module_code: TaskManagerConstants.specification.module_code,
                function_code: TaskManagerConstants.specification.function_code,
            },

            sync_to: syncToVesselId,
        };

        await new ApiRequestService().infra(token, apiEndpoint, ApiRequestMethods.Post, payload);
    }
}
