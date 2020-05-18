import { Currency } from './money';

export type InstrumentType = 'Stock' | 'Currency' | 'Bond' | 'Etf';

export interface MarketInstrument {
  figi: string;
  ticker: string;
  isin?: string;
  minPriceIncrement?: number; // double
  lot: number; // int32
  currency?: Currency;
  name: string;
  type: InstrumentType;
}

export interface MarketInstrumentList {
  total: number; // int32
  instruments: MarketInstrument[];
}
