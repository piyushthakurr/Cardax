import React, { useEffect, useState } from "react";
import { Container, Col } from "react-bootstrap";
import ConnectWallet from "../../components/ConnectWallet/ConnectWallet";
import CardCustom from "../../components/cardCustom/CardCustom";
import ButtonPrimary from "../../components/Button/Button";
import SelectCoin from "../../components/selectCoin/SelectCoin";
import Plusicon from "../../assets/images/token_icons/saitamaIcons/plusIcon.svg";
import NIOBIcon from "../../assets/images/NIOB-Token-Icon.svg";
import BNBIcon from "../../assets/images/token_icons/WBNB-Token-Icon.svg";
import ModalCurrency from "../../components/Modal/ModalCurrency/ModalCurrency";
import ButtonBack from "../../components/buttonBack/ButtonBack";
import "./Trade.scss";
import { useSelector, useDispatch } from "react-redux";
import { MAIN_CONTRACT_LIST, TOKEN_LIST, WETH } from "../../assets/tokens";
import { ContractServices } from "../../services/ContractServices";
import { toast } from "../../components/Toast/Toast";
import { ExchangeService } from "../../services/ExchangeService";
import { useHistory } from "react-router-dom";

import {
  addLpToken,
  addTransaction,
  checkUserLpTokens,
  searchTokenByNameOrAddress,
  startLoading,
  stopLoading,
  initializeTokenList,
} from "../../redux/actions";
import Button from "../../components/Button/Button";
import { BigNumber } from "bignumber.js";
import SupplyModal from "../../components/SupplyModal/SupplyModal";
import RecentTransactions from "../../components/RecentTransactions/RecentTransactions";
import awesomePlus from "../../assets/images/plus_yellow.png";
import TokenBalance from "./TokenBalance";
import { Link } from "react-router-dom";
import { LS_KEYS } from "../../constant";

const AddLiquidity = (props) => {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const handleShow = (value) => {
    setShow(true);
  };

  const dispatch = useDispatch();
  const isUserConnected = useSelector((state) => state.persist.isUserConnected);
  const tokenList = useSelector((state) => state.persist.tokenList);

  const [modalCurrency, setModalCurrency] = useState(false);
  const [tokenOne, setTokenOne] = useState("");
  const [tokenTwo, setTokenTwo] = useState({});
  const [tokenOneCurrency, setCurrencyNameForTokenOne] = useState("");
  const [tokenTwoCurrency, setCurrencyNameForTokenTwo] =
    useState("Select a currency");
  const [tokenOneValue, setTokenOneValue] = useState(0);
  const [tokenTwoValue, setTokenTwoValue] = useState(0);
  const [tokenOneSymbol, setTokenOneSymbol] = useState("hh");
  const [tokenTwoSymbol, setTokenTwoSymbol] = useState("jj");

  const [lpTokenBalance, setLpTokenBalance] = useState(0);
  const [tokenType, setTokenType] = useState("TK1");

  const [search, setSearch] = useState("");
  const [filteredTokenList, setFilteredTokenList] = useState([]);

  const [selectedCurrency, setSelectedCurrency] = useState("");

  const [currentPairAddress, setCurrentPairAddress] = useState("");

  useEffect(() => {
    dispatch(initializeTokenList(TOKEN_LIST));
  }, []);

  useEffect(() => {
    setFilteredTokenList(
      tokenList.filter((token) =>
        token.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, tokenList, setTokenOne, setTokenTwo]);

  const onHandleOpenModal = (tokenType) => {
    if (!isUserConnected) {
      return toast.error("Connect wallet first!");
    }
    setShow(true);
    setSelectedCurrency(
      tokenType === "TK1" ? tokenTwoCurrency : tokenOneCurrency
    );
    setModalCurrency({ modalCurrency: true });
    setTokenType(tokenType);
  };
  const onHandleSelectCurrency = async (token, selecting) => {
    const { address, symbol } = token;
    let pairName = "";
    if (!isUserConnected) {
      return toast.error("Connect wallet first!");
    }
    let a1, a2;
    if (selecting === "TK1") {
      handleClose();
      a1 = address;
      setTokenOne(token);
      setCurrencyNameForTokenOne(symbol);
      pairName = `${symbol}/${tokenTwoCurrency} LP`;

      if (tokenTwo.address) {
        a2 = tokenTwo.address;
      }
    }
    if (selecting === "TK2") {
      handleClose();
      a2 = address;
      setTokenTwo(token);
      setCurrencyNameForTokenTwo(symbol);
      pairName = `${tokenOneCurrency}/${symbol} LP`;

      if (tokenOne.address) {
        a1 = tokenOne.address;
      }
    }
    setModalCurrency(!modalCurrency);
    setSearch("");
    setFilteredTokenList(tokenList);

    if (a1 && a2) {
      console.log(a1, a2, "a1", "a2");
      dispatch(startLoading());
      let currentPairAddress;
      if (a1 === "BNB") {
        a1 = WETH; //WETH
        currentPairAddress = await ExchangeService.getPair(a1, a2);
      } else if (a2 === "BNB") {
        a2 = WETH; //WETH
        currentPairAddress = await ExchangeService.getPair(a1, a2);
      } else {
        currentPairAddress = await ExchangeService.getPair(a1, a2);
      }
      if (currentPairAddress !== "0x0000000000000000000000000000000000000000") {
        console.log("currentPairAddress", currentPairAddress);
        const tk0 = await ExchangeService.getTokenZero(currentPairAddress);
        const tk1 = await ExchangeService.getTokenOne(currentPairAddress);

        const lpdata = {
          pair: currentPairAddress,
          decimals: 18,
          name: "Import LPs",
          pairName,
          symbol: "Anchor-LP",
          token0: tk0,
          token1: tk1,
        };
        console.log("lpdata", lpdata);

        const result = await dispatch(addLpToken(lpdata));
        if (result) {
          console.log("this is the result", result);

          setLpTokenBalance(result.balance);
          setCurrentPairAddress(currentPairAddress);
          setTokenOneSymbol(result?.token0Obj?.symbol);
          setTokenTwoSymbol(result?.token1Obj?.symbol);

          setTokenOneValue(result?.token0Deposit.toFixed(6));
          setTokenTwoValue(result?.token1Deposit.toFixed(6));
        }
      } else {
        setLpTokenBalance(0);
        setCurrentPairAddress("");
        setTokenOneValue(0);
        setTokenTwoValue(0);
      }
      dispatch(stopLoading());
    }
  };

  const handleSearchToken = async (data) => {
    try {
      const res = await dispatch(searchTokenByNameOrAddress(data));
      setFilteredTokenList(res);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  if (currentPairAddress) {
    history.push("/trade/liquidity");
  }
  console.log("lpTokenBalance", lpTokenBalance);
  return (
    <>
      <Container fluid className="swapScreen comnSection">
        <CardCustom>
          <div className="d-flex align-items-center">
            <ButtonBack />
            <h4 className="import-text">Import Pool</h4>
          </div>
          <button
            className="importpoolbox"
            onClick={() => onHandleOpenModal("TK1")}
          >
            {tokenOne.address ? (
              <>
                <img src={tokenOne?.icon} alt="icon" />
                <span>{tokenOne?.symbol}</span>
              </>
            ) : (
              <span>Select a Token</span>
            )}
          </button>
          <div className="convert_plus my-0">
            <span>
              <img src={Plusicon} />
            </span>
          </div>
          <button
            className="importpoolbox mb-3"
            onClick={() => onHandleOpenModal("TK2")}
          >
            {tokenTwo.address ? (
              <>
                <img src={tokenTwo?.icon} alt="icon" />
                <span>{tokenTwo?.symbol}</span>
              </>
            ) : (
              <span>Select a Token</span>
            )}
          </button>
          {tokenOne.address && tokenTwo.address ? (
            currentPairAddress ? (
              <div className="importpooldetails">
                <p>Pool Found!</p>
                <h4>LP TOKENS IN YOUR WALLET</h4>
                <ul>
                  <li>
                    <span>
                      <img src={tokenOne.icon} alt="icon" />{" "}
                      <img src={tokenTwo.icon} alt="icon" /> {tokenOne.symbol}/
                      {tokenTwo?.symbol}
                    </span>{" "}
                    <span>{lpTokenBalance?.toFixed(12)}</span>
                  </li>
                  <br />
                  <li>
                    {tokenOneSymbol}: {tokenOneValue}
                  </li>{" "}
                  <br />
                  <li>
                    {tokenTwoSymbol}: {tokenTwoValue}
                  </li>{" "}
                  <br />
                </ul>
              </div>
            ) : (
              <div className="importpooldetails">
                <p style={{ textAlign: "center" }}>No pool found</p>
                {/* <p>
                                    <Link to="#" onClick={() => props.addBtn()}>Create pool</Link>
                                </p> */}
                <br />
              </div>
            )
          ) : (
            <div className="importpooldetails">
              <p>Select a token to find your liquidity.</p>
              <br />
            </div>
          )}
        </CardCustom>
      </Container>
      <ModalCurrency
        show={show}
        handleShow={handleShow}
        searchToken={handleSearchToken}
        handleClose={handleClose}
        tokenList={filteredTokenList}
        searchByName={setSearch}
        selectCurrency={onHandleSelectCurrency}
        currencyName={selectedCurrency}
        tokenType={tokenType}
      />
    </>
  );
};

export default AddLiquidity;
