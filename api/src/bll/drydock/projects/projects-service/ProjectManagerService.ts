export class ProjectManagerService {
    public GetFullName(firstName: string, lastName: string): string {
        return (firstName ?? '') + ' ' + (lastName ?? '');
    }
}
