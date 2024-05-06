import { ApiRequestService } from 'j2utils';

import { ModuleBll } from '../../bll/drydock/module.bll';
import { eLocation } from '../../bll/drydock/projects/ProjectReportService';
import { JmsAttachmentsDetails } from './TaskManager';

export class FilesService {
    public async downloadAttachment(token: string, uid: string) {
        const apiPath = `infra/file/download?session=${token}&fileUid=${uid.toUpperCase()}&doCompression=false`;
        const { data, headers } = await new ApiRequestService().infra(token, apiPath, 'get');

        return [data, headers['content-type']];
    }

    public async getAllFiles(
        token: string,
        module_code: string,
        function_code: string,
        key1?: string,
        key2?: string,
        key3?: string,
        key4?: string,
    ) {
        let queryParams = `modulecode=${module_code}&key1=${key1}`;

        if (key2) {
            queryParams += `&key2=${key2}`;
        }

        if (key3) {
            queryParams += `&key3=${key3}`;
        }

        if (key4) {
            queryParams += `&key4=${key4}`;
        }

        if (function_code) {
            queryParams += `&functioncode=${function_code}`;
        }

        const apiPath = `infra/file/getfiles?${queryParams}`;

        const { data } = await new ApiRequestService().infra(token, apiPath, 'get');

        return data;
    }

    public async getUrlForAttachment(
        token: string,
        files: JmsAttachmentsDetails[],
        id: string,
        appLocation: eLocation,
    ) {
        const file = files.find((f) => f.key3 === id);

        if (file?.file_type === 'image/png' || file?.file_type === 'image/jpeg') {
            const filePath = file.upload_file_path.includes('/')
                ? file.upload_file_path.split('/').join('\\')
                : file.upload_file_path;
            const filepath = filePath.includes('/') ? filePath.split('/') : filePath.split('\\');
            const fileNameExt = filepath[filepath.length - 1];
            file.upload_file_path = !!file.upload_file_path ? encodeURIComponent(file.upload_file_path) : '';

            if (appLocation === eLocation.Office) {
                const base_url = await new ModuleBll().getJ3BaseUrl('infra');
                return `${base_url}/infra/file/file-download?token=${token}&filepath=${encodeURIComponent(
                    filePath,
                )}&doCompression=true&filename=${encodeURIComponent(fileNameExt)}`;
            } else {
                const { config } = await new ApiRequestService().infra(
                    token,
                    `infra/file/download?session=${token}&filename=${encodeURIComponent(
                        file.upload_file_name,
                    )}&filepath=${file.upload_file_path}&filepath=${
                        file.upload_file_path
                    }&doCompression=false&view=true`,
                    'get',
                );

                return config?.url;
            }
        }
    }
}
