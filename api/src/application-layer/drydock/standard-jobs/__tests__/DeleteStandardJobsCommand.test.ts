import { UpdateResult } from 'typeorm';

import * as tableName from '../../../../common/drydock/ts-helpers/tableName';
import { DeleteStandardJobsCommand } from '../DeleteStandardJobsCommand';
import { DeleteStandardJobsRequestDto } from '../dto/DeteleStandardJobsRequestDto';

jest.mock('../../../../../common/drydock/ts-helpers/tableName');

describe('DeleteStandardJobsCommand', () => {
    let command: DeleteStandardJobsCommand;
    let mockRequestDto: DeleteStandardJobsRequestDto;

    beforeEach(() => {
        command = new DeleteStandardJobsCommand();
        mockRequestDto = {
            uid: '12963993-9397-4B5E-849E-0046FB90F564',
            UserId: '12963993-9397-4B5E-849E-0046FB90F564',
        } as DeleteStandardJobsRequestDto;
        (tableName.getTableName as jest.Mock).mockImplementation(() => 'string');
    });

    describe('MainHandlerAsync', () => {
        it('should not throw an error if the standard job is found and active', async () => {
            jest.spyOn(command.standardJobsRepository, 'deleteStandardJob').mockResolvedValue(
                Promise.resolve({ affected: 1 } as UpdateResult),
            );

            await expect(command['MainHandlerAsync'](mockRequestDto)).resolves.not.toThrow();
        });
    });
});
