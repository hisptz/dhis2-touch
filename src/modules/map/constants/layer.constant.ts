import { timeFormat } from 'd3-time-format';

const formatTime = timeFormat('%Y-%m-%d');

/* EVENT LAYER */
export const EVENT_START_DATE = formatTime(
  new Date().setFullYear(new Date().getFullYear() - 1)
);
export const EVENT_END_DATE = formatTime(new Date());
export const EVENT_COLOR = '#333333';
export const EVENT_RADIUS = 6;
