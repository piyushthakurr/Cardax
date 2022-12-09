import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Header.scss";
import { Link } from "react-router-dom";
import IconToggle from "../../assets/images/token_icons/saitamaIcons/IconToggle.svg";
import Iconmenu from "../../assets/images/token_icons/saitamaIcons/IconMenu.svg";
import Button from "../Button/Button";
import ConnectWallet from "../ConnectWallet/ConnectWallet";
import ProfileModal from "../ProfileModal/ProfileModal";
import { login, logout, versionManager } from "../../redux/actions";
import { ContractServices } from "../../services/ContractServices";
import SwitchNetworkModal from "../SwitchNetworkModal/SwitchNetworkModal";
import config from "dotenv";
import { WALLET_TYPE } from "../../constant";

const WEB_VER = process.env.WEB_VER;

const Header = (props) => {
  const dispatch = useDispatch();
  const isUserConnected = useSelector((state) => state.persist.isUserConnected);
  const walletType = useSelector((state) => state.persist.walletType);
  const [show, setShow] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(
    localStorage.getItem("CURRENT NETWORK")
  );

  window.addEventListener("storage", () =>
    setCurrentNetwork(localStorage.getItem("CURRENT NETWORK"))
  );

  const handleNetworkModal = () => {
    setShowNetworkModal(!showNetworkModal);
  };

  useEffect(() => {
    const init = async () => {
      await dispatch(versionManager());
      if (walletType) {
        console.log(
          "[tur461] in useEffect header.js, wallet type changed to:",
          walletType
        );
        await ContractServices.setWalletType(walletType);
      } else {
        dispatch(logout());
      }
    };
    init();
    // const alreadyConnected = localStorage.getItem("CURRENT NETWORK");
    // if (alreadyConnected == null) {
    // addListeners();
    // }
  }, []);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const connectCall = () => {
    isUserConnected ? setShow(!show) : setShow(true);
  };
  const addListeners = async () => {
    let address;
    if (walletType === WALLET_TYPE.META_MASK) {
      address = await ContractServices.isMetamaskInstalled("");
    }
    if (walletType === WALLET_TYPE.BSC) {
      address = await ContractServices.isBinanceChainInstalled();
    }

    // const addListeners = async () => {
    //   let address;
    //   if (walletType === "Metamask") {
    //     address = await ContractServices.isMetamaskInstalled("");
    //   }
    //   if (walletType === "BinanceChain") {
    //     address = await ContractServices.isBinanceChainInstalled();
    //   }

    //   ContractServices.walletWindowListener();
    //   if (address) {
    //     window.ethereum.on("accountsChanged", function (accounts) {
    //       const account = accounts[0];
    //       dispatch(login({ account, walletType }));
    //       window.location.reload();
    //     });
    //   }
  };

  const logoutCall = () => {
    dispatch(logout());
    setShow(false);
  };
  // piyush, show me where you select wallet?
  return (
    <div className={`header_style ${props.className}`}>
      <div className="header_left_style">
        <Link to="/home" className="header_logo"></Link>
      </div>
      <div className="header_right_style">
        {/* <Button
          onClick={() => connectCall()}
          title={
            isUserConnected
              ? `${isUserConnected.substring(1, 6)}...${isUserConnected.substr(
                  isUserConnected.length - 4
                )}`
              : "Connect"
          }
        /> */}
        <Button
          disabled={isUserConnected == "" ? true : false}
          className="px-2 me-3"
          onClick={() => handleNetworkModal()}
          title={`${currentNetwork !== null
            ? `${currentNetwork} `
            : "Select Network"
            }`}
        />

        <Button
          onClick={() => connectCall()}
          title={
            isUserConnected
              ? `${isUserConnected.substring(1, 6)}...${isUserConnected.substr(
                isUserConnected.length - 4
              )}`
              : "Connect"
          }
        />
        <div className="for_desktop">
          <div className="hamburg" onClick={props.small_nav}>
            {props.mobileIcon ? (
              <img src={Iconmenu} alt="" />
            ) : (
              <img src={IconToggle} />
            )}
          </div>
        </div>
        <div className="for_mobile">
          <div className="hamburg" onClick={props.small_nav}>
            {props.mobileIcon ? (
              <img src={IconToggle} />
            ) : (
              <img src={Iconmenu} alt="" />
            )}
          </div>
        </div>
      </div>

      {isUserConnected === "" && (
        <ConnectWallet
          show={show}
          handleShow={handleShow}
          handleClose={handleClose}
        />
      )}
      {isUserConnected !== "" && (
        <ProfileModal
          show={show}
          handleClose={handleClose}
          logout={logoutCall}
        />
      )}
      {isUserConnected !== "" && (
        <SwitchNetworkModal
          show={showNetworkModal}
          handleClose={handleNetworkModal}
        />
      )}
    </div>
  );
};

export default Header;
