import { GroupProjectStatusId } from '../../../../../../bll/drydock/projects/Project/GroupProjectStatusId';
import { IGroupProjectStatusDto } from '../dtos/IGroupProjectStatusDto';
import { GroupProjectStatusesQuery } from '../GroupProjectStatusesQuery';

describe('populateGroupStatuses', () => {
    it('empty projectStatuses should return all group statuses', () => {
        // Arrange
        const projectStatuses: IGroupProjectStatusDto[] = [];

        // Act
        const result = new GroupProjectStatusesQuery().populateGroupStatuses(projectStatuses);

        // Assert
        expect(result.length).toEqual(Object.keys(GroupProjectStatusId).length);
    });

    it('non-empty projectStatuses should return all group statuses', () => {
        // Arrange
        const projectStatuses: IGroupProjectStatusDto[] = [
            {
                GroupProjectStatusId: GroupProjectStatusId.Completed,
                ProjectWithStatusCount: 10,
            },
        ];

        // Act
        const result = new GroupProjectStatusesQuery().populateGroupStatuses(projectStatuses);

        // Assert
        expect(result.length).toEqual(Object.keys(GroupProjectStatusId).length);
    });

    it('non-empty projectStatuses should return all group statuses with count zero expect pass group status', () => {
        // Arrange
        const projectStatus: IGroupProjectStatusDto = {
            GroupProjectStatusId: GroupProjectStatusId.Completed,
            ProjectWithStatusCount: 10,
        };
        const projectStatuses: IGroupProjectStatusDto[] = [projectStatus];

        // Act
        const result = new GroupProjectStatusesQuery().populateGroupStatuses(projectStatuses);

        // Assert
        expect(result.length).toEqual(Object.keys(GroupProjectStatusId).length);

        for (const groupStatus of result) {
            if (groupStatus.GroupProjectStatusId === projectStatus.GroupProjectStatusId) {
                expect(groupStatus.ProjectWithStatusCount).toEqual(projectStatus.ProjectWithStatusCount);
            } else {
                expect(groupStatus.ProjectWithStatusCount).toEqual(0);
            }
        }
    });
});
