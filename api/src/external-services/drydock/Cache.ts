import { CacheService } from 'j2utils';

export class Cache {
    j2UtilsCache;
    constructor(moduleCode = 'project', functionCode = 'dry_dock', action: string | undefined) {
        this.j2UtilsCache = new CacheService(moduleCode, functionCode, action);
    }
    public async get(key: string, options?: any): Promise<any> {
        try {
            const result = await this.j2UtilsCache.get(key, options);
            return result;
        } catch (e) {
            //TODO: think if we need to catch it somehow.
            //we need this catch block, if cacheService doesnt have value, it throws an error.
            return;
        }
    }

    public async put(value: any, key: string, ttl = 300, options?: any): Promise<void> {
        return this.j2UtilsCache.put(value, key, ttl, options);
    }
}
