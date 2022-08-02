import { client } from './db.connect';
import { Module, OnModuleInit } from '@nestjs/common';
import { ReservationController } from './app.controller';
import { ReservationService } from './app.service';
import { fakeCarSet, randomIntervalSet } from './faker';
import * as format from 'pg-format';

@Module({
  imports: [],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    const rentsReq = await client.query('SELECT * FROM public.car_rent');
    let rents;
    if (rentsReq.rowCount < 1) {
      const cars = fakeCarSet(5);
      rents = [];
      for (const car of cars) {
        const dates = randomIntervalSet(5);
        rents = rents.concat(
          dates.map((date) => {
            return [date.startRent, date.endRent, car.govNumber, car.carModel];
          }),
        );
      }

      client.query(
        format(
          'INSERT INTO public.car_rent ("startRent", "endRent", "govNumber", "carModel" ) VALUES %L',
          rents,
        ),
      );
    }
  }
}
