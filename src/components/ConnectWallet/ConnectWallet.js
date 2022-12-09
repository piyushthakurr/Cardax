import React, { useEffect, useState } from "react";
import { Col, Row, Modal, Button, Form } from "react-bootstrap";

import { useDispatch } from "react-redux";
import { ContractServices } from "../../services/ContractServices";
import { login } from "../../redux/actions";
import { toast } from "../../components/Toast/Toast";
import WalletConnectProvider from "@walletconnect/web3-provider";
import iconMatamask from "../../assets/images/metamask_icon.png";
import iconCoinbase from "../../assets/images/coinbase_icon.svg";
import iconWallet from "../../assets/images/wallet_icon.svg";
import TokenPocket from "../../assets/images/tp.png";
import TrustWallet from "../../assets/images/trust-wallet.png";
import Binance from "../../assets/images/Binance-chain.png";
import MathWallet from "../../assets/images/mathwallet.png";
import { LS_KEYS, WALLET_TYPE } from "../../constant";
import { Link } from "react-router-dom";
// 3;

const ConnectWallet = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const loginCall = async (walletType, type) => {
    try {
      localStorage.setItem(LS_KEYS.WALLET_TYPE, walletType);
      if (walletType === WALLET_TYPE.COIN_BASE) {
        // const CoinbaseWallet = new WalletLinkConnector({
        //   url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
        //   appName: "Web3-react Demo",
        //   supportedChainIds: [1, 3, 4, 5, 42],
        //  });
      } else if (walletType === WALLET_TYPE.BSC) {
        const account = await ContractServices.isBinanceChainInstalled();
        if (account) {
          dispatch(login({ account, walletType }));
          handleClose(false);
          window.location.reload();
        }
      } else if (walletType === WALLET_TYPE.WALLET_CONNECT) {
        try {
          localStorage.setItem("WalletType", "WalletConnect");
          // const d = await ContractServices.callWeb3ForWalletConnect();
          const d = await ContractServices.callWeb3ForWalletConnectMobile();
          const account = d.provider.accounts[0];

          // const d = await ContractServices.callWeb3ForWalletConnect();
          // const account = d.provider.accounts[0];
          console.log("rpc url by scanner => ", d.provider.rpcUrl);
          const currentNetwork = localStorage.getItem("CURRENT NETWORK");

          // Ethereum TestNet Connection
          if (
            currentNetwork == null &&
            d.provider.rpcUrl.includes("https://rinkeby.infura.io/")
          ) {
            localStorage.setItem("CURRENT NETWORK", "ETHEREUM TESTNET");
            localStorage.setItem("REACT_APP_NETWORK_CHAIN_NAME", "Ethereum");
            localStorage.setItem("REACT_APP_NETWORK_CHAIN_ID", "0x4");
            localStorage.setItem("REACT_APP_NETWORK_CHAIN_ID_NUMBER", 4);
            localStorage.setItem(
              "REACT_APP_NETWORK_NATIVE_CURRENCY_SYMBOL",
              "Eth"
            );
            localStorage.setItem(
              "REACT_APP_NETWORK_RPC_URL",
              "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
            );
            localStorage.setItem(
              "REACT_APP_NETWORK_LINK",
              "https://rinkey.etherscan.io"
            );
            ContractServices.walletWindowListener();
            window.location.reload();
          }

          // Ethereum Mainnet Connection
          if (
            currentNetwork == null &&
            d.provider.rpcUrl.includes("https://mainnet.infura.io/v3/")
          ) {
            localStorage.setItem("CURRENT NETWORK", "ETHEREUM");
            localStorage.setItem("REACT_APP_NETWORK_CHAIN_NAME", "Ethereum");
            localStorage.setItem("REACT_APP_NETWORK_CHAIN_ID", "0x1");
            localStorage.setItem("REACT_APP_NETWORK_CHAIN_ID_NUMBER", 1);
            localStorage.setItem(
              "REACT_APP_NETWORK_NATIVE_CURRENCY_SYMBOL",
              "Eth"
            );
            localStorage.setItem(
              "REACT_APP_NETWORK_RPC_URL",
              "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
            );
            localStorage.setItem(
              "REACT_APP_NETWORK_LINK",
              "https://etherscan.io"
            );
            ContractServices.walletWindowListener();
            window.location.reload();
          }

          // BSC TestNet Connection
          if (
            currentNetwork == null &&
            d.provider.rpcUrl.includes("https://data-seed-prebsc")
          ) {
            localStorage.setItem("CURRENT NETWORK", "BSC TESTNET");
            localStorage.setItem(
              "REACT_APP_NETWORK_CHAIN_NAME",
              "Smart Chain - Testnet"
            );
            localStorage.setItem("REACT_APP_NETWORK_CHAIN_ID", "0x61");
            localStorage.setItem("REACT_APP_NETWORK_CHAIN_ID_NUMBER", 61);
            localStorage.setItem(
              "REACT_APP_NETWORK_NATIVE_CURRENCY_SYMBOL",
              "BNB"
            );
            localStorage.setItem(
              "REACT_APP_NETWORK_RPC_URL",
              "https://data-seed-prebsc-2-s3.binance.org:8545/"
            );
            localStorage.setItem(
              "REACT_APP_NETWORK_LINK",
              "https://testnet.bscscan.com"
            );
            ContractServices.walletWindowListener();
            window.location.reload();
          }

          // BSC Mainnet Connection
          if (
            currentNetwork == null &&
            d.provider.rpcUrl == "https://bsc-dataseed.binance.org/"
          ) {
            localStorage.setItem("CURRENT NETWORK", "BSC");
            localStorage.setItem("REACT_APP_NETWORK_CHAIN_NAME", "Smart Chain");
            localStorage.setItem("REACT_APP_NETWORK_CHAIN_ID", "0x38");
            localStorage.setItem("REACT_APP_NETWORK_CHAIN_ID_NUMBER", 38);
            localStorage.setItem(
              "REACT_APP_NETWORK_NATIVE_CURRENCY_SYMBOL",
              "BNB"
            );
            localStorage.setItem(
              "REACT_APP_NETWORK_RPC_URL",
              "https://bsc-dataseed.binance.org/"
            );
            localStorage.setItem(
              "REACT_APP_NETWORK_LINK",
              "https://bscscan.com"
            );
            ContractServices.walletWindowListener();
            window.location.reload();
          }

          console.log("in connect wallet", account, d);
          d.provider.on("connect", (_) =>
            console.log("congrats u r connected..")
          );
          d.provider.on("accountsChanged", async (accounts) => {
            console.log("account changed on remote");
            setTimeout(function () {
              window.location.reload();
            }, 500);
            let account = accounts[0];
            console.log("in connect wallet1", account);
            dispatch(login({ account, walletType }));
            handleClose(false);
            //return;
            // window.location.reload();
          });
          dispatch(login({ account, walletType }));
          handleClose(false);
          //  window.location.reload();
        } catch (error) {
          console.log(error, "wallet error");
        }
      } else if (walletType === WALLET_TYPE.META_MASK) {
        localStorage.setItem("WalletType", "MetaMask");
        const account = await ContractServices.isMetamaskInstalled(type);
        console.log("we have got the account", account);
        if (account) {
          dispatch(login({ account, walletType }));
          handleClose(false);
          // window.location.reload();
        }
      } else {
        console.log("Wallet type invalid");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  useEffect(() => {
    (async () => {
      const selWalletType = localStorage.getItem(LS_KEYS.WALLET_TYPE);
      if (selWalletType) {
        console.log("[tur461] connecting to wallet connect found in LS");
        loginCall(selWalletType);
      }
    })();
  }, []);
  const [isChecked, setIschecked] = useState(false);

  return (
    <Modal
      centered
      scrollable={true}
      className="connect_wallet"
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Connect to a wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col className="baseToken_style token_strut">
            <div className="PolicyCheck">
              <Form.Check
                type="checkbox"
                onClick={() => setIschecked(!isChecked)}
              />
              <p>
                By connecting your wallet, you agree to our{" "}
                <a href="">Use Terms</a>
                &nbsp; and our <a href="">Privacy Policy</a>.
              </p>
            </div>
            <ul>
              <li>
                <Button  
                  onClick={() => loginCall(WALLET_TYPE.META_MASK)}
                  disabled={isChecked == true ? false : true}
                >
                  MetaMask
                  <span>
                    <img src={iconMatamask} />
                  </span>{" "}
                </Button>
              </li>
              {/* <li>
                <Button>
                  CoinBase Wallet
                  <span>
                    <img src={iconCoinbase} />
                  </span>{" "}
                </Button>
              </li> */}
              <li>
                <Button
                  onClick={() => loginCall(WALLET_TYPE.WALLET_CONNECT)}
                  disabled={isChecked == true ? false : true}
                >
                  WalletConnect
                  <span>
                    <img src={iconWallet} />
                  </span>{" "}
                </Button>
              </li>

              {/* <li>
                <Button>
                  TrustWallet
                  <span>
                    <img src={TrustWallet} />
                  </span>{" "}
                </Button>
              </li>
              <li>
                <Button>
                  MathWallet
                  <span>
                    <img src={MathWallet} />
                  </span>{" "}
                </Button>
              </li>
              <li>
                <Button>
                  TokenPocket
                  <span>
                    <img src={TokenPocket} />
                  </span>{" "}
                </Button>
              </li>
              <li>
                <Button>
                  Binance Chain Wallet
                  <span>
                    <img src={Binance} />
                  </span>{" "}
                </Button>
              </li> */}
            </ul>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ConnectWallet;
