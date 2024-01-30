import { SynchronizerService } from 'j2utils';
import { QueryRunner } from 'typeorm';

import * as tableName from '../../../../../common/drydock/ts-helpers/tableName';
import { YardsProjectsRepository } from '../../../../../dal/drydock/project-yards/YardsProjectsRepository';
import { VesselsRepository } from '../../../../../dal/drydock/vessels/VesselsRepository';
import { LibVesselsEntity } from '../../../../../entity/drydock';
import { UnitOfWork } from '../../../core/uof/UnitOfWork';
import { CreateProjectYardsCommand } from '../CreateProjectYardsCommand';
import { CreateProjectYardsDto } from '../dtos/CreateProjectYardsDto';

jest.mock('../../../../../common/drydock/ts-helpers/tableName');
jest.mock('../../../../../dal/drydock/project-yards/YardsProjectsRepository');
jest.mock('j2utils');

describe('CreateProjectYardsCommand', () => {
    let command: CreateProjectYardsCommand;
    let mockYardProjectsRepository: jest.Mocked<YardsProjectsRepository>;
    let mockUnitOfWork: jest.Mocked<UnitOfWork>;
    let mockVesselRepository: jest.Mocked<VesselsRepository>;

    beforeEach(() => {
        mockYardProjectsRepository = new YardsProjectsRepository() as jest.Mocked<YardsProjectsRepository>;
        mockUnitOfWork = new UnitOfWork() as jest.Mocked<UnitOfWork>;
        mockVesselRepository = new VesselsRepository() as jest.Mocked<VesselsRepository>;
        const mockedVesselRepositoryReturn = new LibVesselsEntity();
        mockedVesselRepositoryReturn.VesselId = 42;
        jest.spyOn(mockVesselRepository, 'GetVesselByProjectUid').mockResolvedValue(mockedVesselRepositoryReturn);
        command = new CreateProjectYardsCommand();
        command.yardProjectsRepository = mockYardProjectsRepository;
        command.uow = mockUnitOfWork;
        command.vesselRepository = mockVesselRepository;
        (tableName.getTableName as jest.Mock).mockImplementation(() => 'string');
    });

    describe('ValidationHandlerAsync', () => {
        it('should throw an error if validation fails', async () => {
            const mockRequestDto = {
                projectUid: 'wrongUid',
                yardsUids: ['wrongUid'],
                createdBy: 'wrongUid',
            } as CreateProjectYardsDto;

            await expect(command['ValidationHandlerAsync'](mockRequestDto)).rejects.toMatchObject([
                {
                    value: 'wrongUid',
                },
            ]);
        });

        it('should not throw an error if validation passes', async () => {
            const mockRequestDto = {
                projectUid: '12963993-9397-4B5E-849E-0046FB90F564',
                yardsUids: ['1FE9AE21-A28A-434B-8797-E7BCFA5328EC'],
                createdBy: '12963993-9397-4B5E-849E-0046FB90F564',
            } as CreateProjectYardsDto;

            await expect(command['ValidationHandlerAsync'](mockRequestDto)).resolves.not.toThrow();
        });
    });

    describe('MainHandlerAsync', () => {
        it('should call yardProjectsRepository.create', async () => {
            const mockSynchronizerService = SynchronizerService as jest.Mocked<typeof SynchronizerService>;
            mockSynchronizerService.dataSynchronizeByConditionManager.mockImplementation();
            const spyExecuteAsync = jest.spyOn(mockUnitOfWork, 'ExecuteAsync').mockImplementation(async (callback) => {
                const mockQueryRunner = {} as QueryRunner;
                await callback(mockQueryRunner);
                return Promise.resolve();
            });
            const mockRequestDto = {
                projectUid: '12963993-9397-4B5E-849E-0046FB90F564',
                yardsUids: ['1FE9AE21-A28A-434B-8797-E7BCFA5328EC'],
                createdBy: '12963993-9397-4B5E-849E-0046FB90F564',
            } as CreateProjectYardsDto;

            const spy = jest.spyOn(mockYardProjectsRepository, 'create').mockResolvedValue(['123']);

            await command['MainHandlerAsync'](mockRequestDto);

            expect(spy).toHaveBeenCalled();
            expect(spyExecuteAsync).toHaveBeenCalled();
        });
    });
});
