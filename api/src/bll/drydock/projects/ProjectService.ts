import { ConfigurationService, ApiRequestService } from 'j2utils';

export class ProjectService {
    public async GetProjectCode(): Promise<string> {
        // TODO: tmp change it after task-manager integration
        return `DD-${await this.IsOffice() ? 'O' : 'V'}-${Math.round(Math.random() * 1000 + 1)}`;
    }

    public async IsOffice(): Promise<boolean> {
        const location = await ConfigurationService.getConfiguration('location');
        return location === 'office';
    }


}
