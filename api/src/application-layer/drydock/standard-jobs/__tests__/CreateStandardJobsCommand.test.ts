import { LibSurveyCertificateAuthority, LibVesseltypes } from '../../../../entity/drydock/dbo';
import { StandardJobs } from '../../../../entity/drydock/StandardJobsEntity';
import { CreateStandardJobsCommand } from '../CreateStandardJobsCommand';
import { CreateStandardJobsRequestDto } from '../dto/CreateStandardJobsRequestDto';

describe('CreateStandardJobsCommand', () => {
    describe('MainHandlerAsync', () => {
        it('Passing CreateStandardJobsRequestDto Returns StandardJobs', async () => {
            //Arrange
            const instance = new CreateStandardJobsCommand();
            const request = {
                uid: '6EF829E7-4652-4BA6-B639-5B4774C10656',
                vesselTypeId: [1, 2, 3],
                inspectionId: [1, 2, 3],
                UserId: '34F21705-83A0-4BCD-8E23-EF7873CDAD72',
            } as CreateStandardJobsRequestDto;

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
