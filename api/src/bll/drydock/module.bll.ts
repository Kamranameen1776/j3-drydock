import { CacheService } from 'j2utils';
import { env } from 'process';
import { getManager } from 'typeorm';

import { INF_Lib_Module } from '../../entity/drydock/dbo/INFLibModuleEntity';

export class ModuleBll {
    public async getJ3BaseUrl(module_code: string) {
        const cacheService = new CacheService('iar', 'getModule', 'getJ3BaseUrl');
        const cacheKey = `getJ3BaseUrl_${module_code}`;

        return cacheService
            .get(cacheKey)
            .then((cacheRes) => {
                return cacheRes;
            })
            .catch(async () => {
                const module = await getManager().findOne(INF_Lib_Module, {
                    where: { Module_Code: module_code, Active_Status: 1 },
                    lock: { mode: 'dirty_read' },
                });

                let base_url;
                if (!module?.base_url?.includes('http')) {
                    base_url = `${env.BASE_URL}/api/`;
                }

                cacheService.put(base_url ?? module?.base_url, cacheKey, 3600);
                return base_url ?? module?.base_url;
            });
    }
}
