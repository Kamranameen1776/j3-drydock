import * as tableName from '../../../../../common/drydock/ts-helpers/tableName';
import { UpdateProjectYardsDto } from '../dtos/UpdateProjectYardsDto';
import { UpdateProjectYardsCommand } from '../UpdateProjectYardsCommand';

jest.mock('../../../../../common/drydock/ts-helpers/tableName');

describe('UpdateProjectYardsCommand', () => {
    let command: UpdateProjectYardsCommand;
    let mockRequestDto: UpdateProjectYardsDto;

    beforeEach(() => {
        command = new UpdateProjectYardsCommand();
        mockRequestDto = {
            uid: '12963993-9397-4B5E-849E-0046FB90F564',
            isSelected: true,
            updatedBy: '12963993-9397-4B5E-849E-0046FB90F564',
        } as UpdateProjectYardsDto;
        (tableName.getTableName as jest.Mock).mockImplementation(() => 'string');
    });

    describe('ValidationHandlerAsync', () => {
        it('should throw an error if the yard project is not found or not active', async () => {
            jest.spyOn(command.yardProjectsRepository, 'get').mockResolvedValue({
                uid: '12963993-9397-4B5E-849E-0046FB90F564',
                yardUid: '12963993-9397-4B5E-849E-0046FB90F564',
                projectUid: '12963993-9397-4B5E-849E-0046FB90F564',
                lastExportedDate: new Date(),
                isSelected: true,
                activeStatus: false,
            });

            await expect(command['ValidationHandlerAsync'](mockRequestDto)).rejects.toThrow(
                'The project yard identified by UID: 12963993-9397-4B5E-849E-0046FB90F564 could not be found or has been deleted.',
            );
        });

        it('should not throw an error if the yard project is found and active', async () => {
            jest.spyOn(command.yardProjectsRepository, 'get').mockResolvedValue({
                uid: '12963993-9397-4B5E-849E-0046FB90F564',
                yardUid: '12963993-9397-4B5E-849E-0046FB90F564',
                projectUid: '12963993-9397-4B5E-849E-0046FB90F564',
                lastExportedDate: new Date(),
                isSelected: true,
                activeStatus: true,
            });

            jest.spyOn(command.yardProjectsRepository, 'getAllByProject').mockResolvedValue([
                {
                    uid: '12963993-9397-4B5E-849E-0046FB90F564',
                    yardUid: 'string',
                    projectUid: 'string',
                    lastExportedDate: new Date(),
                    isSelected: false,
                    yardName: 'string',
                    yardLocation: 'string',
                },
            ]);

            await expect(command['ValidationHandlerAsync'](mockRequestDto)).resolves.not.toThrow();
        });

        it('should throw an error if other project is selected', async () => {
            jest.spyOn(command.yardProjectsRepository, 'get').mockResolvedValue({
                uid: '12963993-9397-4B5E-849E-0046FB90F564',
                yardUid: '12963993-9397-4B5E-849E-0046FB90F564',
                projectUid: '12963993-9397-4B5E-849E-0046FB90F564',
                lastExportedDate: new Date(),
                isSelected: true,
                activeStatus: true,
            });

            jest.spyOn(command.yardProjectsRepository, 'getAllByProject').mockResolvedValue([
                {
                    uid: '27cec8c3-2b36-4222-a1b9-fd59258f51b2',
                    yardUid: 'string',
                    projectUid: 'string',
                    lastExportedDate: new Date(),
                    isSelected: true,
                    yardName: 'string',
                    yardLocation: 'string',
                },
            ]);

            await expect(command['ValidationHandlerAsync'](mockRequestDto)).rejects.toThrow(
                'Multiple yard selection for the same project 12963993-9397-4B5E-849E-0046FB90F564 is not allowed',
            );
        });
    });
});
