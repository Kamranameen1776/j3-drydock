import { BusinessException } from '../../core/exceptions/BusinessException';

export class ExampleProjectsService {
    /**
     * Latest date of projects
     */
    public readonly LatestProjectsDate = new Date('2022-01-01');

    /**
     *
     * @param name Name of the project
     * @param dateOfCreation Date of creation of the project
     * @returns Project name, which is a combination of date of creation and project name
     */
    public ChangeProjectName(name: string, dateOfCreation: Date): string {
        if (name == 'Mock') {
            throw new BusinessException('"Mock" project name is not allowed');
        }

        if (dateOfCreation.getTime() < 100000) {
            throw new BusinessException('Invalid date of creation');
        }

        return dateOfCreation.getTime() + '__' + name;
    }
}
