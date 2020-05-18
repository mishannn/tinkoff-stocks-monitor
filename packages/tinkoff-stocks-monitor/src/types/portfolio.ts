import { InstrumentType } from './instruments';
import { MoneyAmount } from './money';

export interface Portfolio {
  positions: PortfolioPosition[];
}

export interface PortfolioPosition {
  figi: string;
  ticker?: string;
  isin?: string;
  instrumentType: InstrumentType;
  balance: number; // double
  blocked?: number; // double
  expectedYield?: MoneyAmount;
  lots: number; // int32
  averagePositionPrice?: MoneyAmount;
  averagePositionPriceNoNkd?: MoneyAmount;
  name: string;
}
