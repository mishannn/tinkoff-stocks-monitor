import { OperationType } from './operations';
import { MoneyAmount } from './money';

export type TradeStatus = 'NormalTrading' | 'NotAvailableForTrading';

/**
 * Статус заявки
 */
export type OrderStatus =
  | 'New'
  | 'PartiallyFill'
  | 'Fill'
  | 'Cancelled'
  | 'Replaced'
  | 'PendingCancel'
  | 'Rejected'
  | 'PendingReplace'
  | 'PendingNew';

/**
 * Тип заявки
 */
export type OrderType = 'Limit' | 'Market';

export interface Order {
  orderId: string;
  figi: string;
  operation: OperationType;
  status: OrderStatus;
  requestedLots: number; // int32
  executedLots: number; // int32
  type: OrderType;
  price: number; // double
}

export interface OrderResponse {
  price: number; // double
  quantity: number; // int32
}

export interface Orderbook {
  figi: string;
  depth: number; // int32
  bids: OrderResponse[];
  asks: OrderResponse[];
  tradeStatus: TradeStatus;
  /**
   * Шаг цены
   */
  minPriceIncrement: number; // double
  /**
   * Номинал для облигаций
   */
  faceValue?: number; // double
  lastPrice?: number; // double
  closePrice?: number; // double
  /**
   * Верхняя граница цены
   */
  limitUp?: number; // double
  /**
   * Нижняя граница цены
   */
  limitDown?: number; // double
}

export interface PlacedOrder {
  orderId: string;
  operation: OperationType;
  status: OrderStatus;
  rejectReason?: string;
  /**
   * Сообщение об ошибке
   */
  message?: string;
  requestedLots: number;
  executedLots: number;
  commission?: MoneyAmount;
}
