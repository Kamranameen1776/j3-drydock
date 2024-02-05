import fs from 'fs';
import { dirname, join } from 'path';

export const getPackage = (): { version: string } => {
    const result = { version: '' };
    try {
        const pkgPath = join(dirname(require?.main?.filename as string), '..', 'package.json');
        const res = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        result.version = res.version;
    } catch (err) {
        console.log(err);
    }

    return result;
};
