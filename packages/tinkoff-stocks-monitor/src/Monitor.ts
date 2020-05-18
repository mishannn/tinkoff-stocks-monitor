import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { RequestMethod, MarketSearchByTickerRequestParams, MarketOrderbookRequestParams } from './types/requests';
import { Response } from './types/responses';
import { MarketInstrumentList, MarketInstrument } from './types/instruments';
import { Orderbook } from './types/orders';
import interval from 'interval-promise';

export interface MonitorOptions {
  apiUrl: string;
  secretToken: string;
}

export interface MonitorStartOptions {
  tickers: string[];
  secondsInterval?: number;
  notifyStepPercents?: number;
}

interface StoredPrice {
  [figi: string]: number;
}

interface MonitorNotification {
  ticker: string;
  name: string;
  price: number;
  currency: string;
  diff?: {
    percents: number;
    value: number;
  };
}

interface MonitorError {
  error: {
    message: string;
  };
}

type MonitorCallback = (data: (MonitorNotification | undefined)[] | MonitorError) => void;

export class Monitor {
  private client!: AxiosInstance;

  private monitorStartOptions: MonitorStartOptions | undefined = undefined;
  private callback: MonitorCallback | undefined = undefined;

  private instruments: (MarketInstrument | undefined)[] = [];
  private storedPrices: StoredPrice = {};

  constructor(options: MonitorOptions) {
    if (!options || !options.apiUrl || !options.secretToken) {
      throw new Error('Неверные параметры конструктора');
    }

    this.client = axios.create({
      baseURL: options.apiUrl,
      headers: {
        Authorization: `Bearer ${options.secretToken}`,
      },
    });
  }

  async start(options: MonitorStartOptions, callback: MonitorCallback): Promise<void> {
    // if (this.monitorIntervalIndex) {
    //   throw new Error('Монитор уже запущен');
    // }

    if (!options || !options.tickers || !callback) {
      throw new Error('Неверные параметры монитора');
    }

    this.monitorStartOptions = options;
    this.callback = callback;

    const instrumentPromises = options.tickers.map(ticker => this.searchInstrument(ticker));
    this.instruments = await Promise.all(instrumentPromises);

    interval(async () => await this.updatePrices(), (options.secondsInterval || 60) * 1000);
  }

  private async requestMethod<S, R>(method: RequestMethod, params: S): Promise<R> {
    const response: AxiosResponse<Response<R>> = await this.client.get(method, { params });
    const payload = response.data.payload;

    if ('message' in payload && 'code' in payload) {
      throw new Error(payload.message);
    }

    return payload;
  }

  private async searchInstrument(ticker: string): Promise<MarketInstrument | undefined> {
    const instrumentList = await this.requestMethod<MarketSearchByTickerRequestParams, MarketInstrumentList>(
      RequestMethod.MarketSearchByTicker,
      { ticker },
    );

    if (instrumentList.total < 1) {
      return undefined;
    }

    return instrumentList.instruments[0];
  }

  private async getOrderbook(figi: string, depth = 1): Promise<Orderbook> {
    const orderbook = await this.requestMethod<MarketOrderbookRequestParams, Orderbook>(RequestMethod.MarketOrderbook, {
      figi,
      depth,
    });

    return orderbook;
  }

  private async updatePrices(): Promise<void> {
    try {
      const orderbookPromises = this.instruments.map(instrument => {
        if (!instrument) {
          return Promise.resolve(undefined);
        }

        return this.getOrderbook(instrument.figi);
      });

      const orderbooks = await Promise.all(orderbookPromises);

      const notifications = orderbooks.map((orderbook, index): MonitorNotification | undefined => {
        if (!orderbook || !orderbook.lastPrice) {
          return undefined;
        }

        const price = orderbook.lastPrice;
        const notification: MonitorNotification = {
          ticker: this.monitorStartOptions?.tickers[index] || '',
          name: this.instruments[index]?.name || '',
          price,
          currency: this.instruments[index]?.currency || '',
        };

        const figi = orderbook.figi;
        const prevPrice = this.storedPrices[figi];

        if (!prevPrice) {
          this.storedPrices[figi] = orderbook.lastPrice;
          return notification;
        }

        const priceDiff = price - prevPrice;
        const percentsDiff = (priceDiff / prevPrice) * 100;
        const notifyStepPercents = this.monitorStartOptions?.notifyStepPercents || 0;

        if (percentsDiff === 0 || (notifyStepPercents > 0 && Math.abs(percentsDiff) < notifyStepPercents)) {
          return notification;
        }

        notification.diff = {
          value: priceDiff,
          percents: percentsDiff,
        };

        this.storedPrices[figi] = orderbook.lastPrice;
        return notification;
      });

      this.callback?.(notifications);
    } catch (e) {
      this.callback?.({
        error: {
          message: e.message,
        },
      });
    }
  }
}
