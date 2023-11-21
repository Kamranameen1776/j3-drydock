import { Request } from 'express';

import { DeleteProjectYardsCommand } from '../DeleteProjectYardsCommand';
import { DeleteProjectYardsDto } from '../dtos/DeleteProjectYardsDto';

describe('DeleteProjectYardsCommand', () => {
    let command: DeleteProjectYardsCommand;
    let mockRequest: Partial<Request>;

    beforeEach(() => {
        command = new DeleteProjectYardsCommand();
        mockRequest = {
            body: {
                uid: '12963993-9397-4B5E-849E-0046FB90F564',
            } as DeleteProjectYardsDto,
        };
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
            await expect(command['ValidationHandlerAsync'](mockRequest as Request)).rejects.toThrow(
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

            await expect(command['ValidationHandlerAsync'](mockRequest as Request)).resolves.not.toThrow();
        });
    });
});
