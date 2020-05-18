export type CandleResolution =
  | '1min'
  | '2min'
  | '3min'
  | '5min'
  | '10min'
  | '15min'
  | '30min'
  | 'hour'
  | 'day'
  | 'week'
  | 'month';

export interface Candle {
  figi: string;
  interval: CandleResolution;
  o: number; // double
  c: number; // double
  h: number; // double
  l: number; // double
  v: number; // int32
  time: string; // date-time
}

export interface Candles {
  figi: string;
  interval: CandleResolution;
  candles: Candle[];
}
