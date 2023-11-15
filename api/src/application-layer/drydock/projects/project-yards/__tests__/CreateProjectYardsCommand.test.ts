import { Request } from 'express';
import { AccessRights } from 'j2utils'; // Import the AccessRights module
import { QueryRunner } from 'typeorm';

import { YardsProjectsRepository } from '../../../../../dal/drydock/project-yards/YardsProjectsRepository';
import { UnitOfWork } from '../../../core/uof/UnitOfWork';
import { CreateProjectYardsCommand } from '../CreateProjectYardsCommand';
import { CreateProjectYardsDto } from '../dtos/CreateProjectYardsDto';

jest.mock('../../../../../dal/drydock/project-yards/YardsProjectsRepository');
jest.mock('j2utils');

describe('CreateProjectYardsCommand', () => {
    let command: CreateProjectYardsCommand;
    let mockRequest: Partial<Request>;
    let mockYardProjectsRepository: jest.Mocked<YardsProjectsRepository>;
    let mockUnitOfWork: jest.Mocked<UnitOfWork>;

    beforeEach(() => {
        mockYardProjectsRepository = new YardsProjectsRepository() as jest.Mocked<YardsProjectsRepository>;
        mockUnitOfWork = new UnitOfWork() as jest.Mocked<UnitOfWork>;
        command = new CreateProjectYardsCommand();
        command.yardProjectsRepository = mockYardProjectsRepository;
        command.uow = mockUnitOfWork;
    });

    describe('ValidationHandlerAsync', () => {
        it('should throw an error if validation fails', async () => {
            mockRequest = {
                body: {
                    projectUid: 'wrongUid',
                    yardsUids: ['wrongUid'],
                } as CreateProjectYardsDto,
            };

            await expect(command['ValidationHandlerAsync'](mockRequest as Request)).rejects.toMatchObject([
                {
                    value: 'wrongUid',
                },
            ]);
        });

        it('should not throw an error if validation passes', async () => {
            mockRequest = {
                body: {
                    projectUid: '12963993-9397-4B5E-849E-0046FB90F564',
                    yardsUids: ['1FE9AE21-A28A-434B-8797-E7BCFA5328EC'],
                } as CreateProjectYardsDto,
            };

            await expect(command['ValidationHandlerAsync'](mockRequest as Request)).resolves.not.toThrow();
        });
    });

    describe('MainHandlerAsync', () => {
        it('should call yardProjectsRepository.create', async () => {
            const mockAccessRights = AccessRights as jest.Mocked<typeof AccessRights>;
            mockAccessRights.authorizationDecode.mockReturnValue({ UserUID: 'mock-user-uid' });
            const spyExecuteAsync = jest.spyOn(mockUnitOfWork, 'ExecuteAsync').mockImplementation(async (callback) => {
                const mockQueryRunner = {} as QueryRunner;
                await callback(mockQueryRunner);
                return Promise.resolve();
            });
            mockRequest = {
                body: new CreateProjectYardsDto(),
            };
            const spy = jest.spyOn(mockYardProjectsRepository, 'create');

            await command['MainHandlerAsync'](mockRequest as Request);

            expect(spy).toHaveBeenCalled();
            expect(spyExecuteAsync).toHaveBeenCalled();
        });
    });
});
