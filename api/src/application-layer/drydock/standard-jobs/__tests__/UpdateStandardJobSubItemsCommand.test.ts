import { UpdateStandardJobSubItemsRequestDto } from '../dto/UpdateStandardJobSubItemsRequestDto';
import { UpdateStandardJobSubItemsCommand } from '../UpdateStandardJobSubItemsCommand';

describe('UpdateStandardJobSubItemsCommand', () => {
    describe('MainHandlerAsync', () => {
        it('Passing UpdateStandardJobSubItemsRequestDto', async () => {
            //Arrange
            const instance = new UpdateStandardJobSubItemsCommand();
            const request = {
                uid: 'ED9F667B-6BB0-4DFB-9DEB-7C8F56F7E585',
                subItems: [],
                UserUID: 'BCBC2350-2FE3-41F5-AE2A-5D4679A456C8',
            } as UpdateStandardJobSubItemsRequestDto;

            instance.uow.ExecuteAsync = jest.fn().mockResolvedValue(true);

            //Act
            const result = await instance.MainHandlerAsync(request);

            //Assert
            expect(result).toBe(true);
        });
    });
});
