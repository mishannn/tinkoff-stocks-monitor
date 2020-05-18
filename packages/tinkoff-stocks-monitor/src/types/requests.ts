// import { OperationType } from './operations';

export enum RequestMethod {
  MarketSearchByTicker = '/market/search/by-ticker',
  MarketOrderbook = '/market/orderbook',
}

export interface MarketOrderbookRequestParams {
  figi: string;
  depth: number;
}

export interface MarketSearchByTickerRequestParams {
  ticker: string;
}

// export interface LimitOrderRequestBody {
//   lots: number; // int32
//   operation: OperationType;
//   price: number; // double
// }

// export interface MarketOrderRequest {
//   lots: number; // int32
//   operation: OperationType;
// }

// namespace Get {
//   namespace Parameters {
//     export type BrokerAccountId = string;
//     export type Depth = number; // int32
//     export type Figi = string;
//     /**
//      * ISO8601
//      * example:
//      * 2019-08-19T18:38:33.131642+03:00
//      */
//     export type From = string; // date-time
//     export type Interval = CandleResolution;
//     export type Ticker = string;
//     /**
//      * ISO8601
//      * example:
//      * 2019-08-19T18:38:33.131642+03:00
//      */
//     export type To = string; // date-time
//   }
//   export interface QueryParameters {
//     ticker: Get.Parameters.Ticker;
//   }
//   namespace Responses {
//     export type $200 = MarketInstrumentListResponse;
//     export type $500 = Error;
//   }
// }

// namespace Post {
//   namespace Parameters {
//     export type BrokerAccountId = string;
//     export type Figi = string;
//     export type OrderId = string;
//   }
//   export interface QueryParameters {
//     orderId: Post.Parameters.OrderId;
//     brokerAccountId?: Post.Parameters.BrokerAccountId;
//   }
//   export type RequestBody = MarketOrderRequest;
//   namespace Responses {
//     export type $200 = Empty;
//     export type $500 = Error;
//   }
// }
