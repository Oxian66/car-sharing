import { IsDate, Validate } from 'class-validator';
import * as dayjs from 'dayjs';
import { calculatePercent } from 'src/utils';
import { DateValidationRule } from 'src/validator';

export class Reservation {
  @IsDate()
  @Validate(DateValidationRule)
  startRent: Date;

  @IsDate()
  @Validate(DateValidationRule)
  endRent: Date;

  govNumber: string;

  carModel: string;

  static percent(startRent: Date, endRent: Date, daysInMonth: number): number {
    const n = (endRent.valueOf() - startRent.valueOf()) / 1000 / 3600 / 24;
    daysInMonth = dayjs(startRent, 'YYYY-MM-DD').daysInMonth();
    return calculatePercent(n, daysInMonth);
  }
}
