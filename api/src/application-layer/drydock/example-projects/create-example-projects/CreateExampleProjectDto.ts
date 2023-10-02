import { BasicRequestDto } from '../../core/cqrs/BasicRequestDto';

export class CreateExampleProjectDto extends BasicRequestDto {
    public Name: string;
}
