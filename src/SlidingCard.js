import React, { useState } from 'react';
import { Progress, Collapse } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
const { Panel } = Collapse;

const SlidingCard = () => {
  const [state, setState] = useState(false);
  return (
    <div className={`sliding_card_warper ${state ? `active_card` : ``}`}>
      <div
        className="sliding_card_switch"
        onClick={() => {
          console.log('heee');
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
        <button className="sliding-card-btn">Get 200$ Faucet</button>
      </div>
    </div>
  );
};

export default SlidingCard;
