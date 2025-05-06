import { IsInt } from 'class-validator';

export class DeleteClientDto {
  @IsInt()
  id: number;
}
