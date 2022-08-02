import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReservationService } from './app.service';
import { CreateRentDto } from './reservation/dto/create-rent.dto';

@Controller()
export class ReservationController {
  constructor(private readonly rentService: ReservationService) {}

  @Get('/reports')
  getReportfromAllCars(
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const interval = this.rentService.getInterval(year, month);
    return this.rentService.getReportfromAllCars(
      interval.firstDay,
      interval.lastDay,
    );
  }

  @Get('/car/:id')
  getRentCar(@Param('id') id: string) {
    return this.rentService.getRentInformation(id);
  }

  @Post('/rent')
  async createRent(@Body() input: CreateRentDto) {
    if (await this.rentService.isDateFree(input))
      return this.rentService.createRent(input);
    return 'Should be pass 3 day after previously rent at least';
  }
}
