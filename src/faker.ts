import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

export function fakeCar() {
  return {
    carModel: faker.vehicle.model(),
    govNumber: faker.vehicle.vrm(),
  };
}

export function fakeCarSet(n: number) {
  const set = [];
  for (let i = 0; i < n; i++) set.push(fakeCar());
  return set;
}

export function randomWeekday() {
  const dayFrom = Math.floor(Math.random() * 5) + 1;
  return dayjs().day(dayFrom);
}

export function randomInterval(bias?: Date) {
  let startRent: Date;
  if (bias) {
    startRent = new Date(
      bias.valueOf() + (Math.round(Math.random() * 15) + 3) * 1000 * 3600 * 24,
    );
  } else {
    startRent = new Date();
    startRent.setDate(-Math.round(Math.random() * 365) - 30);
  }
  if (startRent.getDay() < 1 || startRent.getDay() > 5)
    startRent.setDate(startRent.getDate() + 2);
  const endRent = new Date(startRent);
  endRent.setDate(startRent.getDate() + Math.round(Math.random() * 28 + 2));
  if (endRent.getDay() < 1 || endRent.getDay() > 5)
    endRent.setDate(endRent.getDate() - 2);
  return { startRent, endRent };
}

export function randomIntervalSet(n: number) {
  const set = [];
  set.push(randomInterval());
  for (let i = 1; i < n; i++) {
    set.push(randomInterval(set[set.length - 1].endRent));
  }
  return set;
}
