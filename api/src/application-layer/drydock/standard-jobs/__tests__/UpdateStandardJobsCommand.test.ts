import { LibSurveyCertificateAuthority, LibVesseltypes } from '../../../../entity/drydock/dbo';
import { StandardJobs } from '../../../../entity/drydock/StandardJobsEntity';
import { UpdateStandardJobsRequestDto } from '../dto/UpdateStandardJobsRequestDto';
import { UpdateStandardJobsCommand } from '../UpdateStandardJobsCommand';

describe('UpdateStandardJobsCommand', () => {
    describe('MainHandlerAsync', () => {
        it('Passing UpdateStandardJobsRequestDto Returns StandardJobs', async () => {
            //Arrange
            const instance = new UpdateStandardJobsCommand();
            const request = {
                uid: 'C81C1BF0-8FB3-45BA-A3D2-808CE0D94A87',
                vesselTypeId: [1, 2, 3],
                inspectionId: [1, 2, 3],
                UserId: '4E92F58B-197D-47E3-B8BF-566D7CB8CDC5',
            } as UpdateStandardJobsRequestDto;

            const standardJobs = new StandardJobs();
            standardJobs.uid = request.uid as string;
            standardJobs.vesselType = request.vesselTypeId as Partial<LibVesseltypes>[];
            standardJobs.inspection = request.inspectionId as Partial<LibSurveyCertificateAuthority>[];
            standardJobs.created_by = request.UserId;

            instance.uow.ExecuteAsync = jest.fn().mockResolvedValue(standardJobs);

            //Act
            const result: StandardJobs = await instance.MainHandlerAsync(request);

            //Assert
            expect(result).toBe(standardJobs);
            expect(result.uid).toBe(standardJobs.uid);
            expect(result.vesselType).toBe(standardJobs.vesselType);
            expect(result.inspection).toBe(standardJobs.inspection);
            expect(result.created_by).toBe(standardJobs.created_by);
        });
    });
});
