import EventEmitter from 'eventemitter3';
import { PublicKey, Transaction } from '@solana/web3.js';
import { notify } from '../../utils/notifications';
import { DEFAULT_PUBLIC_KEY, WalletAdapter } from '../types';
import { sign } from 'crypto';
export const programId = new PublicKey('9RZ8Fgh2n5urcfkUw6jDHBn1DnrDaiitc9uuc8UevMeY');

type PhantomEvent = 'disconnect' | 'connect';
type PhantomRequestMethod =
  | 'connect'
  | 'disconnect'
  | 'signTransaction'
  | 'signAllTransactions';

interface PhantomProvider {
  publicKey?: PublicKey;
  walletPublicKey?: PublicKey;
  isConnected?: boolean;
  autoApprove?: boolean;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<any>;
  listeners: (event: PhantomEvent) => (() => void)[];
}

export class PhantomWalletAdapter
  extends EventEmitter
  implements WalletAdapter {
  constructor() {
    super();
    this.connect = this.connect.bind(this);
  }

  xenonPda: PublicKey = PublicKey.default;

  private get _provider(): PhantomProvider | undefined {
    if ((window as any)?.solana?.isPhantom) {
      return (window as any).solana;
    }
    return undefined;
  }

  private _handleConnect = (...args) => {

    this.emit('connect', ...args);

    console.log('this._provider?.publicKey :>> ', this._provider?.publicKey);

    if(this._provider && this._provider?.publicKey) {
      this.xenonPda = new PublicKey('78FDFHPP4PTzCaLfXUKt9vZcPELLvnnS3wnQeGNwRAsm')
      // PublicKey.findProgramAddress([this._provider?.publicKey.toBuffer()], programId).then(x =>  this.xenonPda = x[0]);
    }
  }

  private _handleDisconnect = (...args) => {
    this.emit('disconnect', ...args);
  }

  get connected() {
    return this._provider?.isConnected || false;
  }

  get autoApprove() {
    return this._provider?.autoApprove || false;
  }

  async signAllTransactions(
    transactions: Transaction[],
  ): Promise<Transaction[]> {
    if (!this._provider) {
      return transactions;
    }

    return this._provider.signAllTransactions(transactions);
  }

  get publicKey() {
    // return this._provider?.publicKey || DEFAULT_PUBLIC_KEY;
    // const marginPDA = await PublicKey.findProgramAddress([key.toBuffer()], programId);
    // console.log('this.xenonPda :>> ', this.xenonPda);
    return this.xenonPda
  }
  
  get walletPublicKey() {
    // return this._provider?.publicKey || DEFAULT_PUBLIC_KEY;
    // const marginPDA = await PublicKey.findProgramAddress([key.toBuffer()], programId);
    // console.log('this.xenonPda :>> ', this.xenonPda);
    return this._provider?.publicKey
  }

  async signTransaction(transaction: Transaction) {
    console.log("transaction:: ", transaction)
    if (!this._provider) {
      return transaction;
    }
    console.log("transaction final:: ", JSON.parse(JSON.stringify(transaction)))    
    return this._provider.signTransaction(transaction);
  }

  connect() {
    if (!this._provider) {
      window.open('https://phantom.app/', '_blank');
      notify({
        message: 'Connection Error',
        description: 'Please install Phantom wallet',
      });

      return;
    }
    if (!this._provider.listeners('connect').length) {
      this._provider?.on('connect', this._handleConnect);
    }
    if (!this._provider.listeners('disconnect').length) {
      this._provider?.on('disconnect', this._handleDisconnect);
    }
    return this._provider?.connect();
  }

  disconnect() {
    if (this._provider) {
      this._provider.disconnect();
    }
  }
}
