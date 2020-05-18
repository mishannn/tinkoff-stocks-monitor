export type BrokerAccountType = 'Tinkoff' | 'TinkoffIis';

export interface UserAccount {
  brokerAccountType: BrokerAccountType;
  brokerAccountId: string;
}

export interface UserAccounts {
  accounts: UserAccount[];
}
