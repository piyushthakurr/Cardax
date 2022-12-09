import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import "./PlanetCard.scss";
import RightArrow from "../../assets/images/right-arrow.png";
import DownArrow from "../../assets/images/down-arrow.png";
import { useDispatch, useSelector } from "react-redux";
import { ExchangeService } from "../../services/ExchangeService";
import {
  MAIN_CONTRACT_LIST,
  WETH,
  ANCHOR_BUSD_LP,
  TOKEN_LIST,
  BNB_BUSD_LP,
} from "../../assets/tokens";
import { ContractServices } from "../../services/ContractServices";
import { FarmService } from "../../services/FarmService";
import { BigNumber } from "bignumber.js";
import { toast } from "../Toast/Toast";
import { addTransaction, startLoading, stopLoading } from "../../redux/actions";
import { addCommas } from "../../constant";
import defaultImg from "../../assets/images/token_icons/default.svg";

const PlanetCard = (props) => {
  const [classToggle, setClassToggle] = useState(false);

  const dispatch = useDispatch();
  const isUserConnected = useSelector((state) => state.persist.isUserConnected);
  const {
    farm: { poolInfo, userInfo, pid },
    index,
    currentIndex,
    handleChange,
    harvestOnClick,
    stakeHandle,
    handleRoiModal,
    status,
  } = props;

  const [lpTokenDetails, setLpTokenDetails] = useState(null);
  const [showIncrease, setShowIncrease] = useState(false);
  const [totalSupply, setTotalSupply] = useState(0);
  const [liquidity, setLiquidity] = useState(0);
  const [worth, setWorth] = useState(0);
  const [showApproveButton, setShowApproveButton] = useState(true);
  const [approvalConfirmation, setApprovalConfirmation] = useState(false);
  const [showHarvest, setShowHarvest] = useState(false);
  const [balance, setBalance] = useState(0);
  const [stakeAmounts, setStakeAmounts] = useState({ amount: 0, rewards: 0 });
  const [apr, setApr] = useState(0);
  const [roi, setROI] = useState({
    allocPoint: 0,
    totalAllcationPoint: 0,
    anchorPerBlock: 0,
    anchorPrice: 0,
    liquidity: 0,
    lpWorth: 0,
  });
  const [userStakeInDollar, setUserStakeInDollar] = useState(0);
  const [dollarValue, setAnchorDollarValue] = useState(0.01);

  const getSaitaDollarValue = async () => {
    if (poolInfo.lpToken != undefined) {
      try {
        const tokenZero = await ExchangeService.getTokenZero(ANCHOR_BUSD_LP);
        const tokenOne = await ExchangeService.getTokenOne(ANCHOR_BUSD_LP);
        const decimalZero = await ContractServices.getDecimals(tokenZero);
        const decimalOne = await ContractServices.getDecimals(tokenOne);
        const reserves = await ExchangeService.getReserves(ANCHOR_BUSD_LP);

        let val;
        if (tokenZero.toLowerCase() == TOKEN_LIST[1].address.toLowerCase()) {
          val =
            reserves[1] / 10 ** decimalOne / (reserves[0] / 10 ** decimalZero);
        } else {
          val =
            reserves[0] / 10 ** decimalZero / (reserves[1] / 10 ** decimalOne);
        }
        val = val || 0;

        setAnchorDollarValue(val.toFixed(3));
        return val.toFixed(3);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getDollarValue = async (address) => {
    try {
      if (address.toLowerCase() === TOKEN_LIST[1].address.toLowerCase()) {
        const tokenZero = await ExchangeService.getTokenZero(ANCHOR_BUSD_LP);
        const tokenOne = await ExchangeService.getTokenOne(ANCHOR_BUSD_LP);
        const decimalZero = await ContractServices.getDecimals(tokenZero);
        const decimalOne = await ContractServices.getDecimals(tokenOne);
        const reserves = await ExchangeService.getReserves(ANCHOR_BUSD_LP);

        let val;
        if (tokenZero.toLowerCase() == TOKEN_LIST[1].address.toLowerCase()) {
          val =
            reserves[1] / 10 ** decimalOne / (reserves[0] / 10 ** decimalZero);
        } else {
          val =
            reserves[0] / 10 ** decimalZero / (reserves[1] / 10 ** decimalOne);
        }
        val = val || 0;

        return val.toFixed(6);
      } else if (
        address.toLowerCase() === TOKEN_LIST[2].address.toLowerCase()
      ) {
        return 1;
      } else if (address.toLowerCase() != TOKEN_LIST[2].address.toLowerCase()) {
        const pair = await ExchangeService.getPair(
          address,
          TOKEN_LIST[2].address
        );
        const tokenZero = await ExchangeService.getTokenZero(pair);
        const tokenOne = await ExchangeService.getTokenOne(pair);
        const decimalZero = await ContractServices.getDecimals(tokenZero);
        const decimalOne = await ContractServices.getDecimals(tokenOne);
        const reserves = await ExchangeService.getReserves(pair);
        let val;
        if (tokenZero.toLowerCase() == WETH.toLowerCase()) {
          val =
            reserves[1] / 10 ** decimalOne / (reserves[0] / 10 ** decimalZero);
        } else {
          const resA = reserves[1] / 10 ** decimalOne;
          const resB = reserves[0] / 10 ** decimalZero;
          val = resB / resA;
        }
        val = val || 0;
        return val.toFixed(6);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const init = async () => {
    if (poolInfo) {
      const { lpToken } = poolInfo;
      if (lpToken) {
        const totalSupplyTemp = await ContractServices.getTotalSupply(lpToken);
        setTotalSupply(totalSupplyTemp);

        const liquidityInDollar = await handleLiquidity(lpToken);
        setLiquidity(liquidityInDollar);

        let balance = await ContractServices.getTokenBalance(
          poolInfo.lpToken,
          isUserConnected
        );

        // if (balance > 0.00001) {
        //   balance -= 0.00001;
        // }

        const tokenStaked = await ExchangeService.getTokenStaked(lpToken);
        setWorth((liquidityInDollar / tokenStaked) * balance);

        const lpTokenDetailsTemp = await FarmService.getLpTokenDetails(lpToken);
        setLpTokenDetails(lpTokenDetailsTemp);
        const a = await calculateAPR(
          Number(poolInfo.allocPoint),
          lpToken,
          liquidityInDollar
        );
        lpTokenDetailsTemp.apr = a;

        setApr(a);

        if (isUserConnected) {
          const allowance = await ContractServices.allowanceToken(
            lpToken,
            MAIN_CONTRACT_LIST.farm.address,
            isUserConnected
          );
          let check = true;
          if (
            BigNumber(allowance).isGreaterThanOrEqualTo(BigNumber(2 * 255 - 1))
          ) {
            setShowApproveButton(false);
            check = false;
          }

          setBalance(balance);
          const amount = BigNumber(userInfo.amount / 10 ** lpTokenDetailsTemp.decimals).toFixed();

          setUserStakeInDollar(
            (liquidityInDollar / tokenStaked) * amount
          );
          const rewards = Number(
            Number(
              (await FarmService.pendingSaitama(pid, isUserConnected)) / 10 ** 9
            ).toFixed(9)
          );
          if (!check && amount > 0) {
            setShowIncrease(true);
          }
          setStakeAmounts({ amount, rewards });

          //nextHarvest
          const nextHarvestUntil = await FarmService.canHarvest(
            pid,
            isUserConnected
          );
          if (
            !check &&
            rewards > 0 &&
            Number(userInfo.nextHarvestUntil) > 0 &&
            nextHarvestUntil
          ) {
            setShowHarvest(true);
          }
        }
      }
    }
  };
  //call web3 approval function
  const handleTokenApproval = async () => {
    const acc = await ContractServices.getDefaultAccount();
    if (acc && acc.toLowerCase() !== isUserConnected.toLowerCase()) {
      return toast.error("Wallet address doesn`t match!");
    }
    if (approvalConfirmation) {
      return toast.info("Token approval is processing");
    }
    // (2*256 - 1);
    const value =
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

    try {
      dispatch(startLoading());
      setApprovalConfirmation(true);
      const r = await ContractServices.approveToken(
        isUserConnected,
        value,
        MAIN_CONTRACT_LIST.farm.address,
        poolInfo.lpToken
      );
      if (r) {
        let data = {
          message: `Approve LP Token`,
          tx: r.transactionHash,
        };
        dispatch(addTransaction(data));
        setApprovalConfirmation(false);
        init();
      }
      dispatch(stopLoading());
    } catch (err) {
      setApprovalConfirmation(false);
      dispatch(stopLoading());
      toast.error("Approval Transaction Reverted!");
    }
  };

  const beforeStake = async (type) => {
    if (isUserConnected) {
      let bal = 0;
      if (type === "deposit") {
        bal = balance;
      }
      if (type === "withdraw") {
        bal = stakeAmounts.amount;
      }
      stakeHandle({ pid, poolInfo, lpTokenDetails, balance: bal }, type);
    } else {
      return toast.error("Connect wallet first!");
    }
  };

  const calPrice = async (pairAddress) => {
    let price = 0;

    if (pairAddress == "0x0000000000000000000000000000000000000000") {
      return 0;
    }
    const tokenZero = await ExchangeService.getTokenZero(pairAddress);
    const tokenOne = await ExchangeService.getTokenOne(pairAddress);
    const reserve = await ExchangeService.getReserves(pairAddress);
    const decimalZero = await ContractServices.getDecimals(tokenZero);
    const decimalOne = await ContractServices.getDecimals(tokenOne);

    if (tokenZero.toLowerCase() === TOKEN_LIST[2]?.address.toLowerCase()) {
      return (price =
        (reserve[0] * 10 ** decimalOne) / (reserve[1] * 10 ** decimalZero));
    }
    if (tokenOne.toLowerCase() === TOKEN_LIST[2]?.address.toLowerCase()) {
      return (price =
        (reserve[1] * 10 ** decimalZero) / (reserve[0] * 10 ** decimalOne));
    }

    // let priceBNBToUSD = await calPrice(BNB_BUSD_LP); //replace with BNB-USD pair
    if (tokenZero.toLowerCase() === WETH.toLowerCase()) {
      price =
        (reserve[0] * 10 ** decimalOne) / (reserve[1] * 10 ** decimalZero);
      // return price * 0.002;
      return price;
    }

    if (tokenOne.toLowerCase() === WETH.toLowerCase()) {
      price =
        (reserve[1] * 10 ** decimalZero) / (reserve[0] * 10 ** decimalOne);
      // return price * 0.002;
      return price;
    }
  };
  // console.log("anchorPrice::", BigNumber(anchorPrice));
  const calculateAPR = async (allocPoint, lpToken, lpWorth) => {
    const anchorPrice = await calPrice(ANCHOR_BUSD_LP);
    const totalAllcationPoint = Number(
      await FarmService.totalAllocationPoint()
    );

    const anchorPerBlock =
      Number(await FarmService.pantherPerBlock()) /
      10 ** TOKEN_LIST[1].decimals;
    //need to calculate usd price.
    const liquidity = await handleLiquidity(lpToken);
    if (liquidity != 0) {
      const apr =
        ((allocPoint / totalAllcationPoint) *
          (anchorPerBlock * 5760 * 365 * 100 * anchorPrice)) /
        liquidity;
      setROI({
        allocPoint,
        totalAllcationPoint,
        anchorPerBlock,
        anchorPrice,
        liquidity,
        lpWorth,
      });

      return apr.toFixed(2);
    }

    return 0;
  };
  const handleLiquidity = async (pairAddress) => {
    if (pairAddress != "0x0000000000000000000000000000000000000000") {
      const tokenZero = await ExchangeService.getTokenZero(pairAddress);
      const tokenOne = await ExchangeService.getTokenOne(pairAddress);
      const reserve = await ExchangeService.getReserves(pairAddress);

      const decimalZero = await ContractServices.getDecimals(tokenZero);
      const decimalOne = await ContractServices.getDecimals(tokenOne);

      let priceA = await getDollarValue(tokenZero);
      let priceB = await getDollarValue(tokenOne);

      const totalSupply = await ExchangeService.getTotalSupply(pairAddress);
      const tokenStaked = await ExchangeService.getTokenStaked(pairAddress);

      const reserveAInDollar = (reserve[0] / 10 ** decimalZero) * priceA;
      const reserveBInDollar = (reserve[1] / 10 ** decimalOne) * priceB;

      const liquidity =
        ((reserveAInDollar + reserveBInDollar) / totalSupply) * tokenStaked;
      return liquidity;
    } else {
      return 0;
    }
  };
  const handleIcon = (symbol) => {
    if (symbol != undefined) {
      const tokenObj = TOKEN_LIST.find(
        (d) => d.symbol.toLowerCase() === symbol.toLowerCase()
      );
      return tokenObj != undefined && tokenObj.icon;
    }
  };

  const handleDefaultIcon = (symbol) => {
    if (symbol != undefined) {
      const tokenObj = TOKEN_LIST.find(
        (d) => d.symbol.toLowerCase() === symbol.toLowerCase()
      );
      let index = tokenObj != undefined && tokenObj.icon.lastIndexOf("/") + 1;
      let filename = tokenObj != undefined && tokenObj.icon.substr(index);
      return filename == "default.60b90c93.svg" ? "farm-coin" : "";
    }
  };
  const earnedSaitaValue = (dollarValue, rewards) => {
    let fixedAfterDecimal = Number(dollarValue * rewards).toFixed(9);
    let res = addCommas(fixedAfterDecimal);
    return res;
  };

  const earnedDollarValue = (dollarValue, rewards) => {
    let fixedAfterDecimal = Number(dollarValue * rewards).toFixed(9);
    let res = addCommas(fixedAfterDecimal);
    return res;
  };
  useEffect(async () => {
    await getSaitaDollarValue();
    init();
  }, [isUserConnected]);
  // console.log(lpTokenDetailsTemp, "====-lpTokenDetailsTemp=====-");u
  return (
    <>
      <tr className={`planet_bar`} onClick={() => setClassToggle(!classToggle)}>
        <td className="d-flex flex-wrap flex-md-nowrap align-items-start">
          <div className="cions col">
            <span className="coin_imgs uppr">
              <img
                src={
                  handleIcon(lpTokenDetails?.symbol0)
                    ? handleIcon(lpTokenDetails?.symbol0)
                    : ""
                }
              />
            </span>
            <span className="coin_imgs dwn">
              <img
                src={
                  handleIcon(lpTokenDetails?.symbol1)
                    ? handleIcon(lpTokenDetails?.symbol1)
                    : ""
                }
              />
            </span>
            <span className="coin_title">{lpTokenDetails?.lpTokenName}</span>
          </div>
          <div className="fee col">
            {poolInfo.depositFeeBP && Number(poolInfo.depositFeeBP) === 0 && (
              <div className="info_about_card_feeinfo">
                {" "}
                <img src={props.fee_icon} alt="" /> No Fee
              </div>
            )}
            <div className="prcentx">{poolInfo?.allocPoint}X</div>
          </div>
          <div className="coin_detail col">
            {status && (
              <div className="apr">
                <span>APR</span>
                <p>{addCommas(apr) === "NaN" || NaN ? 0 : addCommas(apr)}%</p>
              </div>
            )}
          </div>
          <div className="lqdty col">
            <span>Liquidity</span>
            <p>
              $
              {addCommas(Number(liquidity.toFixed(2))) === "NaN" || NaN
                ? 0
                : addCommas(Number(liquidity.toFixed(2)))}
            </p>
          </div>
          <div className="erndniob col">
            <span>Earned Saita</span>
            <p>
              {addCommas(stakeAmounts.rewards) === "NaN" || NaN
                ? 0
                : addCommas(stakeAmounts.rewards)}
            </p>
            <p>
              ${" "}
              {earnedSaitaValue(dollarValue, stakeAmounts.rewards) === "NaN" ||
                NaN
                ? 0
                : earnedSaitaValue(dollarValue, stakeAmounts.rewards)}
            </p>
          </div>
          <div className="dtl_btn col">
            <p>
              Details{" "}
              <span>
                <img src={DownArrow} />
              </span>
            </p>
          </div>
        </td>
      </tr>
      <tr className={classToggle ? "planet_strip" : "d-none"}>
        <td className="available_funds">
          <div className="funds">
            {isUserConnected ? (
              <>
                {showIncrease ? (
                  <div className="cardFarm_increase">
                    <button
                      type="button"
                      onClick={() => beforeStake("withdraw")}
                    >
                      <span>-</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => beforeStake("deposit")}
                    >
                      <span>+</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {showApproveButton ? (
                      <Button
                        className="funds_btn"
                        onClick={() => handleTokenApproval()}
                      >
                        Enable Farm
                      </Button>
                    ) : (
                      <Button
                        className="funds_btn"
                        onClick={() => beforeStake("deposit")}
                      >
                        Stake
                      </Button>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <Button
                  onClick={() => toast.error("Connect to wallet first!")}
                  className="funds_btn"
                >
                  Unlock Wallet
                </Button>
              </>
            )}
            <div className="count_funds">
              <span>Available LP</span>
              <p>{balance} LP</p>
              <span>LP Worth - </span>
              <span>${addCommas(Number(worth))}</span>
            </div>
            <span className="forwd_arrow">
              <img src={RightArrow} alt={"right-arrow"} />
            </span>
          </div>
          <div className="funds">
            <div className="count_funds">
              <span>{lpTokenDetails?.lpTokenName} STAKED</span>
              {showIncrease ? <p> {stakeAmounts.amount}</p> : <p>0</p>}
              <span>${userStakeInDollar}</span>
            </div>{" "}
            <span className="forwd_arrow">
              <img src={RightArrow} alt={"right-arrow"} />
            </span>
          </div>
          <div className="funds">
            <Button
              onClick={() => {
                setShowHarvest(false);
                harvestOnClick(pid, lpTokenDetails?.lpTokenName);
              }}
              disabled={!showHarvest}
              className="funds_btn"
            >
              Harvest
            </Button>
            <div className="count_funds">
              <span>Earned</span>
              <p>
                {addCommas(stakeAmounts.rewards) === "NaN" || NaN
                  ? 0
                  : addCommas(stakeAmounts.rewards)}{" "}
                SAITA
              </p>
              <span>
                $
                {earnedDollarValue(dollarValue, stakeAmounts.rewards) ===
                  "NaN" || NaN
                  ? 0
                  : earnedDollarValue(dollarValue, stakeAmounts.rewards)}
              </span>
            </div>
          </div>
          <div className="funds">
            <div className="count_funds">
              <span>
                Deposit Fee :{" "}
                {poolInfo.depositFeeBP
                  ? (Number(poolInfo.depositFeeBP) / 10000) * 100
                  : 0}
                %
              </span>
              <span className="d-block">
                Harvest Interval:{" "}
                {poolInfo.harvestInterval
                  ? Number((poolInfo.harvestInterval / 3600).toFixed(2))
                  : 0}{" "}
                Hour(s)
              </span>
            </div>
          </div>
        </td>
      </tr>
      {/* <Button
        className={`planet_bar`}
        onClick={() => setClassToggle(!classToggle)}
      >
        <div className="cions">
          <span className="coin_imgs uppr">
            <img
              src={
                handleIcon(lpTokenDetails?.symbol0)
                  ? handleIcon(lpTokenDetails?.symbol0)
                  : ""
              }
            />
          </span>
          <span className="coin_imgs dwn">
            <img
              src={
                handleIcon(lpTokenDetails?.symbol1)
                  ? handleIcon(lpTokenDetails?.symbol1)
                  : ""
              }
            />
          </span>
          <span className="coin_title">{lpTokenDetails?.lpTokenName}</span>
        </div>
        {poolInfo.depositFeeBP && Number(poolInfo.depositFeeBP) === 0 && (
          <div className="info_about_card_feeinfo">
            {" "}
            <img src={props.fee_icon} alt="" /> No Fee
          </div>
        )}
        <div className="prcentx">{poolInfo?.allocPoint}X</div>
        <div className="coin_detail">
          {status && (
            <div className="apr">
              <span>APR</span>
              <p>{addCommas(apr) === "NaN" || NaN ? 0 : addCommas(apr)}%</p>
            </div>
          )}
          <div className="lqdty">
            <span>Liquidity</span>
            <p>
              $
              {addCommas(Number(liquidity.toFixed(2))) === "NaN" || NaN
                ? 0
                : addCommas(Number(liquidity.toFixed(2)))}
            </p>
          </div>
          <div className="erndniob">
            <span>Earned Saita</span>
            <p>
              {addCommas(stakeAmounts.rewards) === "NaN" || NaN
                ? 0
                : addCommas(stakeAmounts.rewards)}
            </p>
            <p>
              ${" "}
              {earnedSaitaValue(dollarValue, stakeAmounts.rewards) === "NaN" ||
                NaN
                ? 0
                : earnedSaitaValue(dollarValue, stakeAmounts.rewards)}
            </p>
          </div>
        </div>
        <div className="dtl_btn">
          <p>
            Details{" "}
            <span>
              <img src={DownArrow} />
            </span>
          </p>
        </div>
      </Button> */}
    </>
  );
};

export default PlanetCard;
