import React, { useState } from "react";
import { Col, Row, Modal } from "react-bootstrap";
import CopyIcon from "../../assets/images/copy_Icon.png";
import "./SwitchNetworkModal.scss";
import { useDispatch, useSelector } from "react-redux";
import { NETWORK_SCAN, NETWORK_SCAN_NAME } from "../../constant";
import { toast } from "../Toast/Toast";
import { CopyToClipboard } from "react-copy-to-clipboard";
import TolerenceIcon from "../../assets/images/tolerence_Icon.png";
import Button from "../Button/Button";
import { ContractServices } from "../../services/ContractServices";
import { login } from "../../redux/actions";
import { useEffect } from "react";

const SwitchNetworkModal = ({ show, handleClose, logout }) => {
  const dispatch = useDispatch();
  const walletType = useSelector((state) => state.persist.walletType);
  // Ls = localStorage
  const walletTypeFromLs = localStorage.getItem("WalletType");
  const isUserConnected = useSelector((state) => state.persist.isUserConnected);
  const [selectedNetwork, setSelectedNetwork] = useState("ETHEREUM");

  const handleSelectNetwork = (
    networkName,
    chainID,
    chainId_NUMBER,
    symbol,
    networkChainName,
    rpcUrl,
    explorerUrl
  ) => {
    if (walletTypeFromLs === "WalletConnect") return;
    setSelectedNetwork(networkName);

    localStorage.setItem("CURRENT NETWORK", networkName);
    localStorage.setItem("CHOSEN NETWORK", networkName);
    localStorage.setItem("REACT_APP_NETWORK_CHAIN_NAME", networkChainName);
    localStorage.setItem("REACT_APP_NETWORK_CHAIN_ID", chainID);
    localStorage.setItem("REACT_APP_NETWORK_CHAIN_ID_NUMBER", chainId_NUMBER);
    localStorage.setItem("REACT_APP_NETWORK_NATIVE_CURRENCY_SYMBOL", symbol);
    localStorage.setItem("REACT_APP_NETWORK_RPC_URL", rpcUrl);
    localStorage.setItem("REACT_APP_NETWORK_LINK", explorerUrl);
    console.log("XXXXX");
    ContractServices.walletWindowListener();
    window.location.reload();
  };

  useEffect(() => {
    const isUserConnected = localStorage.getItem(
      "REACT_APP_NETWORK_CHAIN_NAME"
    );
    const walletType = localStorage.getItem("WalletType");
    if (isUserConnected && walletType === "MetaMask") {
      addListeners();
    }
  }, []);

  const addListeners = async () => {
    let address;
    if (walletType === "Metamask") {
      address = await ContractServices.isMetamaskInstalled("");
    }
    if (walletType === "BinanceChain") {
      address = await ContractServices.isBinanceChainInstalled();
    }

    ContractServices.walletWindowListener();
    if (address) {
      window.ethereum.on("accountsChanged", function (accounts) {
        const account = accounts[0];
        dispatch(login({ account, walletType }));
        window.location.reload();
      });
    }
  };

  return (
    <Modal
      centered
      scrollable={true}
      className="connect_wallet"
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center">
          Select Network
          <div className="d-flex mt-3 gap-2 justify-content-center">
            <Button
              onClick={() =>
                handleSelectNetwork(
                  "Cardax Milkomeda",
                  "0x7d1",
                  "2001",
                  "mAda",
                  "Milkomeda",
                  "https://rpc-devnet-cardano-evm.c1.milkomeda.com/",
                  "https://explorer-devnet-cardano-evm.c1.milkomeda.com/"
                )
              }
              title="Milkomeda"
            >
              <span
                className={
                  selectedNetwork === "milkoMeda"
                    ? "network_eth active_network"
                    : "network_eth"
                }
              ></span>
            </Button>
            {/* <Button
              onClick={() =>
                handleSelectNetwork(
                  "BSC",
                  "0x38",
                  38,
                  "BNB",
                  "Smart Chain",
                  "https://bsc-dataseed.binance.org",
                  "https://bscscan.com"
                )
              }
              title="BSC"
            >
              <span
                className={
                  selectedNetwork === "BSC"
                    ? "network_bsc active_network"
                    : "network_bsc"
                }
              ></span>
            </Button> */}
          </div>
          {/* Hide below buttons before preparing build  ......PROD-CHANGES */}
          {/* <div className="d-flex mt-3 gap-2">
            <Button
              onClick={() =>
                handleSelectNetwork(
                  "ETHEREUM TESTNET",
                  "0x4",
                  4,
                  "ETH",
                  "Ethereum Testnet",
                  "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                  "https://rinkey.etherscan.io"
                )
              }
              title="Ethereum (Testnet) "
            >
              <span
                className={
                  selectedNetwork === "ETHEREUM"
                    ? "network_eth active_network"
                    : "network_eth"
                }
              ></span>
            </Button>
            <Button
              onClick={() =>
                handleSelectNetwork(
                  "BSC TESTNET",
                  "0x61",
                  61,
                  "BNB",
                  "Smart Chain - Testnet",
                  "https://data-seed-prebsc-1-s1.binance.org:8545/",
                  "https://testnet.bscscan.com"
                )
              }
              title="BSC (Testnet)"
            >
              <span
                className={
                  selectedNetwork === "BSC"
                    ? "network_bsc active_network"
                    : "network_bsc"
                }
              ></span>
            </Button>
          </div> */}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col className="baseToken_style">
            <div className="profileModal_sec">
              <p>{isUserConnected}</p>
              <div className="copySec">
                <a
                  href={`${NETWORK_SCAN}/address/${isUserConnected}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on {NETWORK_SCAN_NAME}
                  <img src={TolerenceIcon} />
                </a>
                <div className="ms-3">
                  <span>Copy</span>&nbsp;
                  <CopyToClipboard
                    text={`${NETWORK_SCAN_NAME}/address/${isUserConnected}`}
                    onCopy={() => toast.success("Copied!")}
                  >
                    <img className="copy-icon" alt="copy" src={CopyIcon} />
                  </CopyToClipboard>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default SwitchNetworkModal;
