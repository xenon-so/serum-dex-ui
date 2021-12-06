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
import { MARGIN_DATA, XENON_DATA } from './xenonLayouts';

const { Panel } = Collapse;

const SlidingCard = () => {
  const [state, setState] = useState(false);
  // const [xenonProgramData, setXenonProgramData] = useState(null);
  // const [accountMarginData, setAccountMarginData] = useState(null);
  // const [timer, setTimer] = useState(0);
  // const [assetValue, setAssetValue] = useState(0);
  // const [healthPercentage, setHealthPercentage] = useState(0);
  // const [liabilites, setLiabilites] = useState(0);
  // const [usdcLeftToBorrow, setUsdcLeftToBorrow] = useState(0);
  // const [accountLeverage, setAccountLeverage] = useState(0);
  // const [borrowAPR, setBorrowAPR] = useState(0);

  // const { connected, wallet } = useWallet();
  // const connection = useConnection();

  // useEffect(() => {
  //     const interval = setInterval(() => {
  //         setTimer(Date.now())
  //     }, 60000);
  //     return () => clearInterval(interval);
  // }, []);

  // const subscribeXenonProgramDataSubscribe = async () => {
  //     console.log(">>>>>>>>>>>>>>>> ")
  //     const xenonPDA = await PublicKey.findProgramAddress([Buffer.from("xenon_v1")], programId);
  //     let xenonInfo = await connection.getAccountInfo(xenonPDA[0])
  //     if (xenonInfo) {
  //     console.log(">>>>>>>>>>>>>>>> 2222")
  //         let xenonData = XENON_DATA.decode(xenonInfo.data)
  //         setXenonProgramData(xenonData);

  //         const xenonProgramDataSubscription = connection.onAccountChange(xenonPDA[0], (x, y) => {
  //             const data = XENON_DATA.decode(x.data)
  //             setXenonProgramData(data)
  //         }, 'recent')
  //     }
  // }

  // useEffect(() => {
  //     subscribeXenonProgramDataSubscribe();
  // }, [])

  // const subscribeAccountMarginData = async () => {
  //     if (wallet) {
  //         const marginPDA = await PublicKey.findProgramAddress([wallet?.publicKey.toBuffer()], programId);
  //         let xenonInfo = await connection.getAccountInfo(marginPDA[0])
  //         if (xenonInfo) {
  //             let xenonData = MARGIN_DATA.decode(xenonInfo.data)
  //             setAccountMarginData(xenonData)

  //             const solAccountSubscription = connection.onAccountChange(marginPDA[0], (x, y) => {
  //                 const data = MARGIN_DATA.decode(x.data)
  //                 setAccountMarginData(data)
  //             }, 'recent')
  //         }
  //     }
  // }

  // useEffect(() => {
  //     subscribeAccountMarginData();
  // }, [wallet])

  // useEffect(() => {
  //     if (accountMarginData && xenonProgramData && borrowRate) {

  //         const assets = (accountMarginData.assets / 10 ** 6).toFixed(2);
  //         const currentDate = Math.floor(Date.now() / 1000)
  //         const lastUpdatedTime = xenonProgramData.last_updated.toNumber();
  //         const borrowIndex = xenonProgramData.borrow_index + xenonProgramData.borrow_index * borrowRate * (currentDate - lastUpdatedTime)
  //         const liabs = (accountMarginData.liabs / 10 ** 6) * borrowIndex
  //         setLiabilites(liabs);
  //         setUsdcLeftToBorrow(assets - (2 * liabs) < 0 ? 0 : assets - (2 * liabs));
  //         const coll_ratio = (accountMarginData.assets / 10 ** 6) / liabs;
  //         setAccountLeverage((1 / (coll_ratio - 1) + 1).toFixed(2))
  //         setBorrowAPR((borrowRate * 3.154e+7 * 100).toFixed(2));
  //         setAssetValue((accountMarginData.assets / 10 ** 6).toFixed(2));
  //         setHealthPercentage((((accountMarginData.assets / accountMarginData.liabs) - 1.2) * 100).toFixed(0));
  //     }
  // }, [accountMarginData, xenonProgramData, borrowRate])

  // const borrowRate = useMemo(() => {
  //     if (xenonProgramData) {
  //         const totalBorrows = xenonProgramData.total_borrows
  //         const totalDeposits = xenonProgramData.total_deposits

  //         if (totalDeposits === 0 && totalBorrows === 0) {
  //             return 0
  //         }
  //         if (totalDeposits <= totalBorrows) {
  //             return MAX_RATE
  //         }

  //         const utilization = totalBorrows / totalDeposits
  //         if (utilization > OPTIMAL_UTIL) {
  //             const extraUtil = utilization - OPTIMAL_UTIL
  //             const slope = (MAX_RATE - OPTIMAL_RATE) / (1 - OPTIMAL_UTIL)
  //             return OPTIMAL_RATE + slope * extraUtil
  //         } else {
  //             const slope = OPTIMAL_RATE / OPTIMAL_UTIL
  //             return slope * utilization
  //         }
  //     } else {
  //         return 0
  //     }
  // }, [xenonProgramData, timer])

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
          <span>$2000</span>
        </div>
        <div className={'account-status-list'}>
          <p>Margin available</p>
          <span>$355</span>
        </div>
        <div className={'account-status-list'}>
          <p>Leverage</p>
          <span>2.1x</span>
        </div>
        <div className={'progress-bar-wrapper'}>
          <p>Health</p>
          <Progress percent={50} showInfo={false} />
        </div>
        <Collapse
          defaultActiveKey={['1']}
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
                <span>500$</span>
              </div>
            }
            key="1"
          >
            <table className="sliding-card-table">
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
            </table>
          </Panel>
          <Panel
            header={
              <div className={'sliding-card-panel-head'}>
                <h4>
                  <div
                    className="state-img"
                    style={{ background: '#2671C4' }}
                  ></div>
                  RAY
                </h4>
                <span>223$</span>
              </div>
            }
            key="2"
          >
            <table className="sliding-card-table">
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
            </table>
          </Panel>
          <Panel
            header={
              <div className={'sliding-card-panel-head'}>
                <h4>
                  <div
                    className="state-img"
                    style={{ background: '#00B65B' }}
                  ></div>
                  IVN
                </h4>
                <span>392$</span>
              </div>
            }
            key="3"
          >
            <table className="sliding-card-table">
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
            </table>
          </Panel>
        </Collapse>
        <button className="sliding-card-btn">Get Devnet USDC </button>
      </div>
    </div>
  );
};

export default SlidingCard;
