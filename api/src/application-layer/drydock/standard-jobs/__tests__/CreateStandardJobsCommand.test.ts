import { QueryRunner } from 'typeorm';

import * as tableName from '../../../../common/drydock/ts-helpers/tableName';
import { StandardJobsRepository } from '../../../../dal/drydock/standard-jobs/StandardJobsRepository';
import { LibVesselsEntity, StandardJobs } from '../../../../entity/drydock';
import { UnitOfWork } from '../../core/uof/UnitOfWork';
import { CreateStandardJobsCommand } from '../CreateStandardJobsCommand';
import { CreateStandardJobsRequestDto } from '../dto/CreateStandardJobsRequestDto';

jest.mock('../../../../../common/drydock/ts-helpers/tableName');
jest.mock('../../../../../dal/drydock/project-yards/YardsProjectsRepository');
jest.mock('j2utils');

describe('CreateStandardJobsCommand', () => {
    let command: CreateStandardJobsCommand;
    let mockStandardJobsRepository: jest.Mocked<StandardJobsRepository>;
    let mockUnitOfWork: jest.Mocked<UnitOfWork>;

    beforeEach(() => {
        mockStandardJobsRepository = new StandardJobsRepository() as jest.Mocked<StandardJobsRepository>;
        mockUnitOfWork = new UnitOfWork() as jest.Mocked<UnitOfWork>;
        const mockedVesselRepositoryReturn = new LibVesselsEntity();
        mockedVesselRepositoryReturn.VesselId = 42;
        command = new CreateStandardJobsCommand();
        command.standardJobsRepository = mockStandardJobsRepository;
        command.uow = mockUnitOfWork;
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
            } as CreateStandardJobsRequestDto;

            const spy = jest
                .spyOn(mockStandardJobsRepository, 'createStandardJob')
                .mockResolvedValue(Promise.resolve(new StandardJobs()));

            await command['MainHandlerAsync'](mockRequestDto);

            expect(spy).toHaveBeenCalled();
            expect(spyExecuteAsync).toHaveBeenCalled();
        });
    });
});
