import { BrokerAccountType, UserAccount } from './user';
import { Currency } from './money';

export interface SandboxRegisterRequest {
  brokerAccountType?: BrokerAccountType;
}

export interface SandboxRegisterResponse {
  trackingId: string;
  status: string;
  payload: UserAccount;
}

export interface SandboxSetCurrencyBalanceRequest {
  currency: Currency;
  balance: number; // double
}

export interface SandboxSetPositionBalanceRequest {
  figi?: string;
  balance: number; // double
}
