import { TOTAL_NUMBERS } from '../constants';

export const getRandom = (max: number = TOTAL_NUMBERS): number => Math.floor(Math.random() * max) + 1;
