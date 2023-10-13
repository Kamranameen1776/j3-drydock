/**
 * Business logic related to the project manager
 */
export class ProjectManagerService {
    /**
     * Gets the full name of the project manager
     * @param firstName First name
     * @param lastName Second name
     * @returns Full name
     */
    public GetFullName(firstName: string, lastName: string): string {
        return (firstName ?? '') + ' ' + (lastName ?? '');
    }
}
