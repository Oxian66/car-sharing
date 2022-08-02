import { CreateRentDto } from './reservation/dto/create-rent.dto';
import { Injectable } from '@nestjs/common';
import { Reservation } from './reservation/reservation.entity';
import { client } from './db.connect';
import { isArray } from 'class-validator';
import * as dayjs from 'dayjs';
import { getPrice } from './utils';

@Injectable()
export class ReservationService {
  async getRentInformation(id: string) {
    try {
      const res = await client.query(
        'SELECT * FROM public.car_rent WHERE id=$1;',
        [id],
      );
      return res.rows;
    } catch (e) {
      console.error(e);
    }
  }

  getInterval(year: number, month: number) {
    const inMonth = dayjs(`${year}-${month}-1`).daysInMonth();
    const lastDay = new Date(`${year}-${month}-${inMonth}`);
    const firstDay = new Date(`${year}-${month}-1`);
    return {
      firstDay,
      lastDay,
    };
  }

  async getReportfromAllCars(intervalStart: Date, intervalEnd: Date) {
    try {
      const res = await client.query(
        'SELECT * FROM public.car_rent WHERE "startRent" <= $2 AND "endRent" >= $1',
        [intervalStart, intervalEnd],
      );

      const byCar = {};
      for (const row of res.rows) {
        if (row.startRent < intervalStart) row.startRent = intervalStart;
        if (row.endRent > intervalEnd) row.endRent = intervalEnd;
        if (!byCar[row.govNumber]) byCar[row.govNumber] = 0;
        byCar[row.govNumber] +=
          Math.round(
            ((dayjs(row.endRent).diff(dayjs(row.startRent), 'day') + 1) /
              dayjs(intervalStart).daysInMonth()) *
              10000,
          ) / 100;
      }
      return byCar;
    } catch (e) {
      console.log(e);
    }
  }

  async isDateFree(input: CreateRentDto): Promise<boolean> {
    const res = (
      await client.query(
        //'SELECT "startRent", "endRent" FROM public.car_rent WHERE "govNumber" = $1',
        'SELECT * FROM public.car_rent WHERE "govNumber" = $1 , "startRent" <= $3 AND "endRent" >= $2 LIMIT 1',
        [input.govNumber, input.startRent, input.endRent],
      )
    ).rows;
    // for (const entry of res) {
    //   const start = dayjs(entry.endRent).add(3, 'day');
    //   const end = dayjs(entry.startRent).subtract(3, 'day');
    //   if (
    //     !(
    //       dayjs(input.startRent).isAfter(start) ||
    //       dayjs(input.endRent).isBefore(end)
    //     )
    //   ) {
    //     return false;
    //   }
    // }
    // return true;
    return res.length === 0 ? true : false;
  }

  async createRent(input: CreateRentDto) {
    const price = getPrice(input.startRent, input.endRent);
    client.query(
      'INSERT INTO public.car_rent ("startRent", "endRent", "govNumber", "carModel") VALUES ($1, $2, $3, $4)',
      [input.startRent, input.endRent, input.govNumber, input.carModel],
    );
    return `Стоимость вашей аренды составит ${price} условных единиц`;
  }
}
