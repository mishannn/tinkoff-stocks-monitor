export type Currency = 'RUB' | 'USD' | 'EUR' | 'GBP' | 'HKD' | 'CHF' | 'JPY' | 'CNY' | 'TRY';

export interface Currencies {
  currencies: CurrencyPosition[];
}

export interface CurrencyPosition {
  currency: Currency;
  balance: number; // double
  blocked?: number; // double
}

export interface MoneyAmount {
  currency: Currency;
  value: number; // double
}
