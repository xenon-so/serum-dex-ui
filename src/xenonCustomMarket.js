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
