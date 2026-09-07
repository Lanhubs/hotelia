import { AccommodationRoom } from './accommodationTypes';
import { ROOMS_A } from './accommodationRoomsA';
import { ROOMS_B } from './accommodationRoomsB';

export type { AccommodationRoom };

export const LUXURY_ROOMS: AccommodationRoom[] = [
  ...ROOMS_A,
  ...ROOMS_B,
];
