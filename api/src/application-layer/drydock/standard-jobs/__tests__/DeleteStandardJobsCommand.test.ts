import { UpdateResult } from 'typeorm';

import { DeleteStandardJobsCommand } from '../DeleteStandardJobsCommand';
import { DeleteStandardJobsRequestDto } from '../dto/DeteleStandardJobsRequestDto';

describe('DeleteStandardJobsCommand', () => {
    describe('MainHandlerAsync', () => {
        it('Passing DeleteStandardJobsRequestDto Returns UpdateResult', async () => {
            //Arrange
            const instance = new DeleteStandardJobsCommand();
            const request = {
                uid: 'BD7101EB-7758-45BE-A838-CEC77E91E674',
                UserId: '1B39DF32-F8B6-4C6B-9287-D406401B4B92',
            } as DeleteStandardJobsRequestDto;

            const updateResult = new UpdateResult();
            updateResult.affected = 1;
            instance.uow.ExecuteAsync = jest.fn().mockResolvedValue(updateResult);

            //Act
            const result = await instance.MainHandlerAsync(request);

            //Assert
            expect(result).toBe(updateResult);
            expect(result.affected).toBe(1);
        });
    });
});
