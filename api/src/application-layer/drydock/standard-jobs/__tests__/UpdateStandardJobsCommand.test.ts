import { QueryRunner } from 'typeorm';

import * as tableName from '../../../../common/drydock/ts-helpers/tableName';
import { StandardJobsRepository } from '../../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { StandardJobs } from '../../../../entity/drydock';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { UpdateStandardJobsRequestDto } from '../dto/UpdateStandardJobsRequestDto';
import { UpdateStandardJobsCommand } from '../UpdateStandardJobsCommand';

jest.mock('../../../../../common/drydock/ts-helpers/tableName');

describe('UpdateStandardJobsCommand', () => {
    let command: UpdateStandardJobsCommand;
    let mockRequestDto: UpdateStandardJobsRequestDto;
    let mockStandardJobsRepository: jest.Mocked<StandardJobsRepository>;
    let mockUnitOfWork: jest.Mocked<UnitOfWork>;

    beforeEach(() => {
        command = new UpdateStandardJobsCommand();
        mockRequestDto = {
            uid: '12963993-9397-4B5E-849E-0046FB90F564',
            vesselTypeId: [21, 24],
            inspectionId: [90, 32],
            UserId: '12963993-9397-4B5E-849E-0046FB90F564',
        } as UpdateStandardJobsRequestDto;
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
                vesselTypeId: [42, 58],
                inspectionId: [23, 28],
                UserId: '12963993-9397-4B5E-849E-0046FB90F564',
            } as UpdateStandardJobsRequestDto;

            const spy = jest
                .spyOn(mockStandardJobsRepository, 'updateStandardJob')
                .mockResolvedValue(Promise.resolve(new StandardJobs()));

            await command['MainHandlerAsync'](mockRequestDto);

            expect(spy).toHaveBeenCalled();
            expect(spyExecuteAsync).toHaveBeenCalled();
        });
    });
});
