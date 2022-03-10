import { Connection, PublicKey } from "@solana/web3.js";

export const cluster = "https://ssc-dao.genesysgo.net/";
export const connection = new Connection(cluster, "confirmed");

export const programId = new PublicKey('9RZ8Fgh2n5urcfkUw6jDHBn1DnrDaiitc9uuc8UevMeY');
export const adapterProgramId = new PublicKey('8ZuvEP7LtkJ57BssnFfENr7zSEWYyhhmvbeWD4Ccg5A4');

export const SYSTEM_PROGRAM_ID = new PublicKey('11111111111111111111111111111111')
export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
export const MEMO_PROGRAM_ID = new PublicKey('Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo')
export const RENT_PROGRAM_ID = new PublicKey('SysvarRent111111111111111111111111111111111')
export const CLOCK_PROGRAM_ID = new PublicKey('SysvarC1ock11111111111111111111111111111111')
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')

// devnet faucet data
export const FAUCET_PROGRAM_ID = new PublicKey('4bXpkKSV8swHSnwqtzuboGPaPDeEgAn4Vt8GfarV5rZt')
export const FAUCET_KEY = new PublicKey('B87AhxX6BkBsj3hnyHzcerX2WxPoACC7ZyDr8E7H9geN')

export const MAX_RATE = 4.75 * 10**-8;
export const MAX_RATE_YEAR = 1.5
export const OPTIMAL_UTIL = 0.7
export const OPTIMAL_RATE = 1.90 * 10**-9;
export const OPTIMAL_RATE_YEAR = 0.06
