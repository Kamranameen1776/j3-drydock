import { CommandRequest } from '../../core/cqrs/CommandRequestDto';
import { CreateSpecificationDetailsCommand } from '../CreateSpecificationDetailsCommand';

describe('CreateSpecificationDetailsCommand', () => {
    describe('MainHandlerAsync', () => {
        it('Passing request returns SpecificationDetails', async () => {
            //Arrange
            const instance = new CreateSpecificationDetailsCommand();
            const request = {
                request: {
                    body: {
                        uid: '6EF829E7-4652-4BA6-B639-5B4774C10656',
                        specificationId: [1, 2, 3],
                        UserId: '34F21705-83A0-4BCD-8E23-EF7873CDAD72',
                    },
                },
            } as CommandRequest;

            const specificationDetails = new SpecificationDetails();
            specificationDetails.uid = request.uid as string;
            specificationDetails.specification = request.specificationId as Partial<LibSpecification>[];
            specificationDetails.created_by = request.UserId;

            instance.uow.ExecuteAsync = jest.fn().mockResolvedValue(specificationDetails);

            //Act
            const result: SpecificationDetails = await instance.MainHandlerAsync(request);

            //Assert
            expect(result).toBe(specificationDetails);
            expect(result.uid).toBe(specificationDetails.uid);
            expect(result.specification).toBe(specificationDetails.specification);
            expect(result.created_by).toBe(specificationDetails.created_by);
        });
    });
});
