import { PublicKey } from '@solana/web3.js';

export const xenonMarkets = [
  {
    address: new PublicKey('DW83EpHFywBxCHmyARxwj3nzxJd7MUdSeznmrdzZKNZB'),
    deprecated: false,
    name: 'BTC/USDC',
    programId: new PublicKey('DESVgJVGajEgKGXhb6XmqDHGz3VjdgP7rEVESBgxmroY'),
    quoteLabel: 'USDC',
    baseLabel: 'BTC',
  },
  {
    address: new PublicKey('BkAraCyL9TTLbeMY3L1VWrPcv32DvSi5QDDQjik1J6Ac'),
    deprecated: false,
    name: 'ETH/USDC',
    programId: new PublicKey('DESVgJVGajEgKGXhb6XmqDHGz3VjdgP7rEVESBgxmroY'),
    quoteLabel: 'USDC',
    baseLabel: 'ETH',
  },
  {
    address: new PublicKey('249LDNPLLL29nRq8kjBTg9hKdXMcZf4vK2UvxszZYcuZ'),
    deprecated: false,
    name: 'SRM/USDC',
    programId: new PublicKey('DESVgJVGajEgKGXhb6XmqDHGz3VjdgP7rEVESBgxmroY'),
    quoteLabel: 'USDC',
    baseLabel: 'SRM',
  },
];

export const xenonTokens = {
  USDC: '8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN',
  BTC: '3UNBZ6o52WTWwjac2kPUb4FyodhU1vFkRJheu1Sh2TvU',
  ETH: 'Cu84KB3tDL6SbFgToHMLYVDJJXdJjenNzSKikeAvzmkA',
  SRM: 'AvtB6w9xboLwA145E221vhof5TddhqsChYcx7Fy3xVMH',
};
