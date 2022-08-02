import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'DateValidation', async: false })
@Injectable()
export class DateValidationRule implements ValidatorConstraintInterface {
  validate(day: Date) {
    return day.getDay() > 0 && day.getDay() < 6;
  }
}
