import { QueryRunner } from 'typeorm';

import * as tableName from '../../../../common/drydock/ts-helpers/tableName';
import { StandardJobsRepository } from '../../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { UpdateStandardJobSubItemsRequestDto } from '../dto/UpdateStandardJobSubItemsRequestDto';
import { UpdateStandardJobSubItemsCommand } from '../UpdateStandardJobSubItemsCommand';

jest.mock('../../../../../common/drydock/ts-helpers/tableName');

describe('UpdateStandardJobSubItemsCommand', () => {
    let command: UpdateStandardJobSubItemsCommand;
    let mockRequestDto: UpdateStandardJobSubItemsRequestDto;
    let mockUnitOfWork: jest.Mocked<UnitOfWork>;
    let mockStandardJobsRepository: jest.Mocked<StandardJobsRepository>;

    beforeEach(() => {
        command = new UpdateStandardJobSubItemsCommand();
        mockRequestDto = {
            uid: '12963993-9397-4B5E-849E-0046FB90F564',
            subItems: [
                {
                    uid: '12963993-9397-4B5E-849E-0046FB90F564',
                    code: 'string',
                    subject: 'string',
                    description: 'string',
                    standardJobUid: '12963993-9397-4B5E-849E-0046FB90F564',
                },
            ],
            UserUID: '12963993-9397-4B5E-849E-0046FB90F564',
        } as UpdateStandardJobSubItemsRequestDto;
        (tableName.getTableName as jest.Mock).mockImplementation(() => 'string');
    });

    describe('MainHandlerAsync', () => {
        it('should call standardJobsRepository.create', async () => {
            const spyExecuteAsync = jest.spyOn(mockUnitOfWork, 'ExecuteAsync').mockImplementation(async (callback) => {
                const mockQueryRunner = {} as QueryRunner;
                await callback(mockQueryRunner);
                return Promise.resolve();
            });
            const mockRequestDto = {
                uid: '12963993-9397-4B5E-849E-0046FB90F564',
                subItems: [
                    {
                        uid: '12963993-9397-4B5E-849E-0046FB90F564',
                        code: 'string',
                        subject: 'string',
                        description: 'string',
                        standardJobUid: '12963993-9397-4B5E-849E-0046FB90F564',
                    },
                ],
                UserUID: '12963993-9397-4B5E-849E-0046FB90F564',
            } as UpdateStandardJobSubItemsRequestDto;

            const spy = jest.spyOn(mockStandardJobsRepository, 'updateStandardJobSubItems');

            await command['MainHandlerAsync'](mockRequestDto);

            expect(spy).toHaveBeenCalled();
            expect(spyExecuteAsync).toHaveBeenCalled();
        });
    });
});
