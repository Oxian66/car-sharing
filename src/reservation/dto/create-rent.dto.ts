import { IsDate, Validate } from 'class-validator';
import { DateValidationRule } from 'src/validator';

export class CreateRentDto {
  @IsDate()
  @Validate(DateValidationRule)
  startRent: Date;

  @IsDate()
  @Validate(DateValidationRule)
  endRent: Date;

  govNumber: string;

  carModel: string;
}
