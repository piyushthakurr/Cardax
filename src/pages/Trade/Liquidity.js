import React, { useEffect, useState } from 'react';
import { Container, Col, Accordion } from 'react-bootstrap';
import CardCustom from '../../components/cardCustom/CardCustom';
import ButtonPrimary from '../../components/Button/Button';
import SettingIcon from '../../assets/images/token_icons/saitamaIcons/settingIcongreen.svg';
import TimerIcon from '../../assets/images/token_icons/saitamaIcons/timeIconGre.svg';

import Plusicon from '../../assets/images/plus_ico.png';
import SettingModal from '../../components/Modal/SettingModal/SettingModal';
import { Link } from 'react-router-dom';
import ButtonLink from '../../components/buttonLink/ButtonLink';
import './Trade.scss';
import RemoveLiquidity from '../../components/Modal/RemoveLiquidity/RemoveLiquidity';
import { useDispatch, useSelector } from 'react-redux';
import { getUserLPTokens } from '../../redux/actions';
import RecentTransactions from '../../components/RecentTransactions/RecentTransactions';
import TokenBalance from './TokenBalance';
import { LS_KEYS } from '../../constant';
import subtractionIcon from '../../assets/images/subtractionIcon.svg';

const Liquidity = ({ handleAddLiquidity, handleRemove }) => {
  const [settingShow, setsettingShow] = useState(false);
  const settingClose = () => setsettingShow(false);
  const settinghandleShow = () => setsettingShow(true);
  // remove liquidity
  const [removeShow, setremoveShow] = useState(false);
  const removeClose = () => setremoveShow(false);
  const removehandleShow = () => setremoveShow(true);

  const dispatch = useDispatch();
  const isUserConnected = useSelector((state) => state.persist.isUserConnected);
  const userLpTokens = useSelector((state) => state.persist.userLpTokens);

  const [showSettings, setShowSettings] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showRecent, setShowRecent] = useState(false);
  const recentTransactionsClose = () => setShowRecent(false);

  const [lptoken, setLptoken] = useState(null);

  const handleCloseSettings = () => setShowSettings(false);
  const handleCloseRecent = () => setShowRecent(false);

  const [isWalletSelected, setIsWalletSelected] = useState(!1);

  useEffect((_) => {
    // onload check if wallet is selected
    const selWalletType = localStorage.getItem(LS_KEYS.WALLET_TYPE);
    if (!selWalletType) {
      setIsWalletSelected(!1);
    } else {
      setIsWalletSelected(!0);
    }
  }, []);

  const init = async () => {
    if (isUserConnected) {
      await dispatch(getUserLPTokens());
    }
  };

  useEffect(() => {
    isWalletSelected && init();
  }, [isUserConnected]);

  const toggleDropdwon = (index) => {
    if (currentIndex === index) {
      setCurrentIndex(-1);
    } else {
      setCurrentIndex(index);
    }
  };
  console.log('userLpTokens', userLpTokens);
  return (
    <>
      <Container fluid className='swapScreen comnSection add_lq_box'>
        <CardCustom>
          <div className='settingSec'>
            <div className='in_title'>
              <h4>Liquidity</h4>
              {/* <p className="mb-0">Add liquidity to receive LP tokens</p> */}
            </div>
            <div className='settingIcon'>
              <img
                src={TimerIcon}
                onClick={() => setShowRecent(true)}
                className='timerImg'
              />
              <img src={SettingIcon} onClick={() => settinghandleShow(true)} />
            </div>
          </div>

          <div className='add_liq text-center'>
            <p className='text-start'>Add liquidity to receive LP tokens</p>
            <ButtonLink
              title='Add Liquidity'
              className='add_liquidity_btn'
              icon={Plusicon}
              link='/trade/liquidity/addLiquidity'
            />
            <ButtonLink
              title='Remove Liquidity'
              className='removeBtn'
              icon={subtractionIcon}
              link='/trade/liquidity/importPool'
            />
          </div>

          <div className='settingSec d-block mb-0'>
            <div className='in_title'>
              <h4>Your Liquidity</h4>
            </div>
          </div>
          {!isUserConnected ? (
            <div className='liquidity_list'>
              <h3>Connect a wallet to view your liquidity</h3>
            </div>
          ) : userLpTokens.length > 0 ? (
            <>
              {userLpTokens.map((lp, index) => (
                <Accordion
                  defaultActiveKey={index}
                  className='yourLiq_accordian'
                >
                  <Accordion.Item eventKey='0'>
                    <Accordion.Header>
                      {lp.pairName} <span className='ms-auto'>Manage</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className='amountDiv'>
                        <ul className='text-start'>
                          <li>Your total pool tokens:</li>
                          <li>Pooled {lp.token0Obj.symbol}:</li>
                          <li>Pooled {lp.token1Obj.symbol}:</li>
                          <li>Your pool share:</li>
                        </ul>
                        <ul className='text-end'>
                          <li>{lp.balance.toFixed(10)}</li>
                          <li>{lp.token0Deposit.toFixed(5)}</li>
                          <li>{lp.token1Deposit.toFixed(5)}</li>
                          <li>{lp.poolShare}%</li>
                        </ul>
                      </div>
                      <div className='remove_liq d-flex text-center mb-2'>
                        <ButtonPrimary
                          title='Add Liquidity'
                          className='remove_liq_btn w-50 me-2'
                          // onClick={() =>  removehandleShow(true)}
                          onClick={() => handleAddLiquidity(lp)}
                          style={{
                            display: 'inline',
                            marginLeft: '6px',
                            marginRight: '162px',
                          }}
                        />

                        <ButtonPrimary
                          title='Remove Liquidity'
                          className='remove_liq_btn w-50 ms-2'
                          onClick={() => {
                            setLptoken(lp);
                            removehandleShow();
                          }}
                          style={{
                            display: 'inline',
                            padding: '2px 7px 3px 6px',
                          }}
                        />
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ))}
            </>
          ) : (
            <div className='liquidity_list text-center'>
              <h3>No Liquidity found.</h3>
            </div>
          )}

          <Col className='tokeninfo'>
            <p>
              Don't see a pool you joined?{' '}
              <Link to={'/trade/liquidity/importPool'}>import it.</Link>
            </p>
            <p>
              {/* Or, if you staked your LP tokens in a farm, unstake them to see
              them here. */}
            </p>
          </Col>
        </CardCustom>
      </Container>
      <SettingModal
        show={settingShow}
        handleShow={settinghandleShow}
        handleClose={settingClose}
      />
      <RemoveLiquidity
        lptoken={lptoken}
        show={removeShow}
        handleShow={removehandleShow}
        handleClose={removeClose}
      />
      <RecentTransactions
        show={showRecent}
        handleClose={recentTransactionsClose}
      />
    </>
  );
};

export default Liquidity;
