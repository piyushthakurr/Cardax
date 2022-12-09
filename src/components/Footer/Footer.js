import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import logo_white from "../../assets/images/logo_white.png";
import "./Footer.scss";
// import { Link } from "react-router-dom";
// import NIOB from "../../assets/images/saitaswap.png";
// import MetaMask from "../../assets/images/MetaMask-Icon.svg";
// import ScrollTop from "../ScrollTop/ScrollTop";
// import { Button } from "react-bootstrap";
// import { addCommas } from "../../constant";

const Footer = (props) => {
  const footerValues = useSelector((state) => state.persist.footerValues);
  useEffect(() => { }, []);
  const handelToken = async () => {
    const { ethereum } = window;
    const tokenAddress = "0x0eD81CAe766d5B1a4B3ed4DFbED036be13c6C09C";
    const tokenSymbol = "SAITAMA";
    const tokenDecimals = 18;
    //const tokenImage = 'http://placekitten.com/200/300';
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            //image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={`footer_style ${props.className}`}>
      <div className="footer_align">
        <div className="niob_price">
          <a href="#" className="terms-condition-text">
            Terms & Conditions
          </a>
          {/* <img src={NIOB} alt={"img"} /> */}
          {/* <div className="flex"> */}
          {/* <span>SAITAMA</span> */}
          {/* <span className="vlue">${footerValues?.niobValue?.toFixed(2)}</span> */}
          {/* </div> */}
        </div>
        {/* <div className="buy_niob">
          <img src={NIOB} alt={"icon"} onClick={() => handelToken()} />
          <Link to="/trade/exchange">
            <Button className="cm_btn" onClick={() => handelToken()}>
              Buy SAITAMA
            </Button>
          </Link>
        </div> */}
        <div className="copy-right-text">
          <div className="LogoFit">
            <img src={logo_white} alt="footer_logo" />
          </div>
          <span>&#169; Cardax. All Right Reserved</span>
        </div>
        {/* 
        <div className="scrollUp">
          <ScrollTop />
        </div> */}
      </div>
    </div>
  );
};

export default Footer;
