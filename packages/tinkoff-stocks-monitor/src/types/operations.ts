import { InstrumentType } from './instruments';
import { MoneyAmount, Currency } from './money';

export interface Operation {
  id: string;
  status: OperationStatus;
  trades?: OperationTrade[];
  commission?: MoneyAmount;
  currency: Currency;
  payment: number; // double
  price?: number; // double
  quantity?: number; // int32
  figi?: string;
  instrumentType?: InstrumentType;
  isMarginCall: boolean;
  /**
   * ISO8601
   * example:
   * 2019-08-19T18:38:33.131642+03:00
   */
  date: string; // date-time
  operationType?: OperationTypeWithCommission;
}

/**
 * Статус заявки
 */
export type OperationStatus = 'Done' | 'Decline' | 'Progress';

export interface OperationTrade {
  tradeId: string;
  /**
   * ISO8601
   * example:
   * 2019-08-19T18:38:33.131642+03:00
   */
  date: string; // date-time
  price: number; // double
  quantity: number; // int32
}

export type OperationType = 'Buy' | 'Sell';

export type OperationTypeWithCommission =
  | 'Buy'
  | 'BuyCard'
  | 'Sell'
  | 'BrokerCommission'
  | 'ExchangeCommission'
  | 'ServiceCommission'
  | 'MarginCommission'
  | 'OtherCommission'
  | 'PayIn'
  | 'PayOut'
  | 'Tax'
  | 'TaxLucre'
  | 'TaxDividend'
  | 'TaxCoupon'
  | 'TaxBack'
  | 'Repayment'
  | 'PartRepayment'
  | 'Coupon'
  | 'Dividend'
  | 'SecurityIn'
  | 'SecurityOut';

export interface Operations {
  operations: Operation[];
}

export interface OperationsResponse {
  trackingId: string;
  status: string;
  payload: Operations;
}
