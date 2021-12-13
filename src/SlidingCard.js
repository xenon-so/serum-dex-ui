import React, { useEffect, useState, useMemo } from 'react';
import { Progress, Collapse } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import {
  MAX_RATE,
  OPTIMAL_RATE,
  OPTIMAL_UTIL,
  programId,
} from './utils/constants';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from './utils/wallet';
import { useConnection } from './utils/connection';
import { ACCOUNT_LAYOUT, MARGIN_DATA, XENON_DATA } from './xenonLayouts';
import { findAssociatedTokenAddress } from './utils/send';
import {
  getOwnedAccountsFilters,
  TOKENS,
  TOKEN_PROGRAM_ID,
} from './utils/tokens';

const { Panel } = Collapse;

export const roundDownTo4Decimals = (value) => {
  if (value) {
    return parseFloat(Math.floor(value * 10000) / 10000).toFixed(4);
  } else {
    return 0;
  }
};

const getTokenData = (mintAddress, programAccounts, parsedProgramAccounts) => {
  // const associatedTokenAddress = programAccounts.find(t => t.pubkey.toBase58())
  // const
};

const mapTokens = (resps) => {
  const tokens = [];
  for (const res of resps) {
    tokens.push({
      pubkey: res.pubkey,
      data: ACCOUNT_LAYOUT.decode(res.account.data),
    });
  }
  return tokens;
};

const SlidingCard = () => {
  const [state, setState] = useState(false);
  const [xenonProgramData, setXenonProgramData] = useState(null);
  const [accountMarginData, setAccountMarginData] = useState(null);
  const [timer, setTimer] = useState(0);
  const [assetValue, setAssetValue] = useState(0);
  const [healthPercentage, setHealthPercentage] = useState(0);
  const [liabilites, setLiabilites] = useState(0);
  const [usdcLeftToBorrow, setUsdcLeftToBorrow] = useState(0);
  const [accountLeverage, setAccountLeverage] = useState(0);
  const [borrowAPR, setBorrowAPR] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [wsolBalance, setWsolBalance] = useState(0);
  const [btcBalance, setBtcBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);

  const { connected, wallet } = useWallet();
  const connection = useConnection();
  const [xenonPDA, setXenonPDA] = useState(null);

  useEffect(() => {
    if (connected) {
      (async () => {
        console.log(
          'wallet.publicKey 111 :>> ',
          wallet.walletPublicKey.toBase58(),
        );
        const x = await PublicKey.findProgramAddress(
          [wallet.walletPublicKey.toBuffer()],
          programId,
        );
        setXenonPDA(x[0]);
      })();
    }
  }, [connected]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const subscribeXenonProgramDataSubscribe = async () => {
    console.log('>>>>>>>>>>>>>>>> ');
    const xenonPDA = await PublicKey.findProgramAddress(
      [Buffer.from('xenon_v1')],
      programId,
    );
    let xenonInfo = await connection.getAccountInfo(xenonPDA[0]);
    if (xenonInfo) {
      console.log('>>>>>>>>>>>>>>>> 2222');
      let xenonData = XENON_DATA.decode(xenonInfo.data);
      console.log('xenonData:', xenonData);
      setXenonProgramData(xenonData);

      const xenonProgramDataSubscription = connection.onAccountChange(
        xenonPDA[0],
        (x, y) => {
          const data = XENON_DATA.decode(x.data);
          console.log('in xenonData:', xenonData);

          setXenonProgramData(data);
        },
        'recent',
      );
    }
  };

  useEffect(() => {
    if (connected) {
      subscribeXenonProgramDataSubscribe();
    }
  }, [connected]);

  const subscribeAccountMarginData = async () => {
    if (connected) {
      const marginPDA = await PublicKey.findProgramAddress(
        [wallet?.walletPublicKey.toBuffer()],
        programId,
      );
      let xenonInfo = await connection.getAccountInfo(marginPDA[0]);
      if (xenonInfo) {
        let xenonData = MARGIN_DATA.decode(xenonInfo.data);
        setAccountMarginData(xenonData);

        const solAccountSubscription = connection.onAccountChange(
          marginPDA[0],
          (x, y) => {
            const data = MARGIN_DATA.decode(x.data);
            setAccountMarginData(data);
          },
          'recent',
        );
      }
    }
  };

  useEffect(() => {
    if (connected) {
      subscribeAccountMarginData();
    }
  }, [connected]);

  const borrowRate = useMemo(() => {
    if (xenonProgramData) {
      const totalBorrows = xenonProgramData.total_borrows;
      const totalDeposits = xenonProgramData.total_deposits;

      if (totalDeposits === 0 && totalBorrows === 0) {
        return 0;
      }
      if (totalDeposits <= totalBorrows) {
        return MAX_RATE;
      }

      const utilization = totalBorrows / totalDeposits;
      if (utilization > OPTIMAL_UTIL) {
        const extraUtil = utilization - OPTIMAL_UTIL;
        const slope = (MAX_RATE - OPTIMAL_RATE) / (1 - OPTIMAL_UTIL);
        return OPTIMAL_RATE + slope * extraUtil;
      } else {
        const slope = OPTIMAL_RATE / OPTIMAL_UTIL;
        return slope * utilization;
      }
    } else {
      return 0;
    }
  }, [connected, xenonProgramData, timer]);

  useEffect(() => {
    if (accountMarginData && xenonProgramData && borrowRate) {
      const assets = (accountMarginData.assets / 10 ** 6).toFixed(2);
      const currentDate = Math.floor(Date.now() / 1000);
      const lastUpdatedTime = xenonProgramData.last_updated.toNumber();
      const borrowIndex =
        xenonProgramData.borrow_index +
        xenonProgramData.borrow_index *
          borrowRate *
          (currentDate - lastUpdatedTime);
      const liabs = (accountMarginData.liabs / 10 ** 6) * borrowIndex;
      setLiabilites(liabs);
      setUsdcLeftToBorrow(assets - 2 * liabs < 0 ? 0 : assets - 2 * liabs);
      const coll_ratio = accountMarginData.assets / 10 ** 6 / liabs;
      setAccountLeverage((1 / (coll_ratio - 1) + 1).toFixed(2));
      setBorrowAPR((borrowRate * 3.154e7 * 100).toFixed(2));
      setAssetValue((accountMarginData.assets / 10 ** 6).toFixed(2));
      setHealthPercentage(
        (
          (accountMarginData.assets / accountMarginData.liabs - 1.2) *
          100
        ).toFixed(0),
      );
    }
  }, [connected, accountMarginData, xenonProgramData, borrowRate]);

  useEffect(() => {
    console.log('xenonPDA >>>> 222 >>>>  :>> ', xenonPDA);
    if (connected && xenonPDA != null) {
      (async () => {
        let filters = getOwnedAccountsFilters(xenonPDA);
        let resp = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
          filters,
        });
        console.log('resp :>> ', resp);
        const tokenData = resp.map((t) =>
          ACCOUNT_LAYOUT.decode(t.account.data),
        );
        // console.log('tokenData :>> ', tokenData);
        const mappedTokens = mapTokens(resp);
        // console.log('mapTokens :>> ',
        // USDC account
        try {
          console.log('wallet.publicKey >>>> :>> ', xenonPDA.toBase58());
          const token = mappedTokens.find(
            (t) => t.data.mint.toBase58() === TOKENS.USDC.mintAddress,
          );
          const accounts = token.pubkey;
          console.log('accounts :>> ', accounts);
          const walletBalance = await connection.getTokenAccountBalance(
            accounts,
            'max',
          );
          setUsdcBalance(walletBalance.value.uiAmountString);

          const USDCAccountSubscription = connection.onAccountChange(
            accounts,
            (x, y) => {
              const USDCAccState = ACCOUNT_LAYOUT.decode(x.data);
              const bal = roundDownTo4Decimals(
                USDCAccState.amount.toNumber() / 10 ** TOKENS.USDC.decimals,
              );
              setUsdcBalance(bal);
              // console.log("state changed ::", USDCAccState, bal)
            },
            'recent',
          );
        } catch (error) {
          console.error('error reading usdc account :>> ', error);
        }

        try {
          const token = mappedTokens.find(
            (t) => t.data.mint.toBase58() === TOKENS.WSOL.mintAddress,
          );
          const accounts = token.pubkey;
          const walletBalance = await connection.getTokenAccountBalance(
            accounts,
            'max',
          );
          setWsolBalance(walletBalance.value.uiAmountString);

          const USDCAccountSubscription = connection.onAccountChange(
            accounts,
            (x, y) => {
              const USDCAccState = ACCOUNT_LAYOUT.decode(x.data);
              const bal = roundDownTo4Decimals(
                USDCAccState.amount.toNumber() / 10 ** TOKENS.WSOL.decimals,
              );
              setWsolBalance(bal);
              // console.log("state changed ::", USDCAccState, bal)
            },
            'recent',
          );
        } catch (error) {
          console.error('error reading WSOL account :>> ', error);
        }

        try {
          const token = mappedTokens.find(
            (t) => t.data.mint.toBase58() === TOKENS.WSOL.mintAddress,
          );
          const accounts = token.pubkey;
          const walletBalance = await connection.getTokenAccountBalance(
            accounts,
            'max',
          );
          setBtcBalance(walletBalance.value.uiAmountString);

          const USDCAccountSubscription = connection.onAccountChange(
            accounts,
            (x, y) => {
              const USDCAccState = ACCOUNT_LAYOUT.decode(x.data);
              const bal = roundDownTo4Decimals(
                USDCAccState.amount.toNumber() / 10 ** TOKENS.BTC.decimals,
              );
              setBtcBalance(bal);
              // console.log("state changed ::", USDCAccState, bal)
            },
            'recent',
          );
        } catch (error) {
          console.error('error reading BTC account :>> ', error);
        }
        try {
          const token = mappedTokens.find(
            (t) => t.data.mint.toBase58() === TOKENS.ETH.mintAddress,
          );
          const accounts = token.pubkey;
          const walletBalance = await connection.getTokenAccountBalance(
            accounts,
            'max',
          );
          setEthBalance(walletBalance.value.uiAmountString);

          const USDCAccountSubscription = connection.onAccountChange(
            accounts,
            (x, y) => {
              const USDCAccState = ACCOUNT_LAYOUT.decode(x.data);
              const bal = roundDownTo4Decimals(
                USDCAccState.amount.toNumber() / 10 ** TOKENS.ETH.decimals,
              );
              setEthBalance(bal);
              // console.log("state changed ::", USDCAccState, bal)
            },
            'recent',
          );
        } catch (error) {
          console.error('error reading ETH account :>> ', error);
        }
      })();
    }
  }, [connected, xenonPDA]);

  return (
    <div className={`sliding_card_warper ${state ? `active_card` : ``}`}>
      <div
        className="sliding_card_switch"
        onClick={() => {
          setState(!state);
        }}
      >
        <img src="./angle-left.svg" alt="" />
      </div>
      <div className="sliding_card_inner borrow_account_status_wrapper">
        <h2>Margin Account</h2>
        <div className={'account-status-list'}>
          <p>Assets</p>
          <span>${assetValue}</span>
        </div>
        <div className={'account-status-list'}>
          <p>Margin available</p>
          <span>${usdcLeftToBorrow.toFixed(2)}</span>
        </div>
        <div className={'account-status-list'}>
          <p>Leverage</p>
          <span>{accountLeverage}x</span>
        </div>
        <div className={'progress-bar-wrapper'}>
          <p>Health</p>
          <Progress percent={healthPercentage} showInfo={true} />
        </div>
        <Collapse
          // defaultActiveKey={['1']}
          expandIcon={({ isActive }) => (
            <CaretDownOutlined rotate={isActive ? 180 : 0} />
          )}
          className="site-collapse-custom-collapse"
          ghost
        >
          <Panel
            header={
              <div className={'sliding-card-panel-head'}>
                <h4>
                  <div
                    className="state-img"
                    style={{ background: '#d27800' }}
                  ></div>
                  USDC
                </h4>
                <span>{usdcBalance}</span>
              </div>
            }
            key="1"
          >
            {/* <table className="sliding-card-table">
                            <tr>
                                <th>Token</th>
                                <th>Amount</th>
                                <th>Value</th>
                            </tr>
                            <tr>
                                <td>SRM</td>
                                <td>11</td>
                                <td>$33</td>
                            </tr>
                            <tr>
                                <td>FTT</td>
                                <td>122</td>
                                <td>$2000</td>
                            </tr>
                        </table> */}
          </Panel>
          <Panel
            header={
              <div className={'sliding-card-panel-head'}>
                <h4>
                  <div
                    className="state-img"
                    style={{ background: '#2671C4' }}
                  ></div>
                  BTC
                </h4>
                <span>{btcBalance}</span>
              </div>
            }
            key="2"
          >
            {/* <table className="sliding-card-table">
                            <tr>
                                <th>Token</th>
                                <th>Amount</th>
                                <th>Value</th>
                            </tr>
                            <tr>
                                <td>SRM</td>
                                <td>11</td>
                                <td>$33</td>
                            </tr>
                            <tr>
                                <td>FTT</td>
                                <td>122</td>
                                <td>$2000</td>
                            </tr>
                        </table> */}
          </Panel>
          <Panel
            header={
              <div className={'sliding-card-panel-head'}>
                <h4>
                  <div
                    className="state-img"
                    style={{ background: '#00B65B' }}
                  ></div>
                  ETH
                </h4>
                <span>{ethBalance}</span>
              </div>
            }
            key="3"
          >
            {/* <table className="sliding-card-table">
                            <tr>
                                <th>Token</th>
                                <th>Amount</th>
                                <th>Value</th>
                            </tr>
                            <tr>
                                <td>SRM</td>
                                <td>11</td>
                                <td>$33</td>
                            </tr>
                            <tr>
                                <td>FTT</td>
                                <td>122</td>
                                <td>$2000</td>
                            </tr>
                        </table> */}
          </Panel>
          <Panel
            header={
              <div className={'sliding-card-panel-head'}>
                <h4>
                  <div
                    className="state-img"
                    style={{ background: '#00B65B' }}
                  ></div>
                  WSOL
                </h4>
                <span>{wsolBalance}</span>
              </div>
            }
            key="4"
          >
            {/* <table className="sliding-card-table">
                            <tr>
                                <th>Token</th>
                                <th>Amount</th>
                                <th>Value</th>
                            </tr>
                            <tr>
                                <td>SRM</td>
                                <td>11</td>
                                <td>$33</td>
                            </tr>
                            <tr>
                                <td>FTT</td>
                                <td>122</td>
                                <td>$2000</td>
                            </tr>
                        </table> */}
          </Panel>
        </Collapse>
        {/* <button className="sliding-card-btn">Get Devnet USDC </button> */}
      </div>
    </div>
  );
};

export default SlidingCard;
