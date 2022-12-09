import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarFooter,
} from "react-pro-sidebar";
import { isMobile } from "react-device-detect";
import Twitter from "../../assets/images/twitter-icon.svg";
import NIOBtoken from "../../assets/images/saitaswap.png";
import Cardax_Favicon from "../../assets/images/Cardax_Favicon.png";
import Telegram from "../../assets/images/telegram-icon.svg";
import Docs from "../../assets/images/docs-icon.svg";
import Youtube from "../../assets/images/token_icons/saitamaIcons/youtube.svg";
import facebook from "../../assets/images/token_icons/saitamaIcons/facebook.svg";
import instagram from "../../assets/images/token_icons/saitamaIcons/instagram.svg";
import discord from "../../assets/images/token_icons/saitamaIcons/discord.svg";

import Medium from "../../assets/images/medium-icon.svg";
import Github from "../../assets/images/git.svg";
import Globe from "../../assets/images/token_icons/saitamaIcons/globeIcon.svg";
import "./Sidebar.scss";
import useWindowDimensions from "../../hooks/getWindowDimensions";
import {
  ANCHOR_BUSD_LP,
  AUDIT,
  DOCS,
  INSURANCE_FUND,
  LOTTERY,
  NIOB_SHARING,
  PREDICTION_TRAINING,
  TRADING_FEE_CASHBACK,
} from "../../assets/tokens";
import { ExchangeService } from "../../services/ExchangeService";
import {
  ExchangeIcon,
  FarmingIcon,
  LinkIcon,
  RightArrowIcon,
  StakingIcon,
} from "../../assets/svg/SvgImages";
import GetStartedIcon from "../../assets/images/GetStartedIcon.png";

const CurrentChain = localStorage.getItem("CURRENT NETWORK");
// console.log("777777777777777777", CurrentChain);
const Sidebar = (props) => {
  const { width } = useWindowDimensions();

  const [selectedOption, setSelectedOption] = useState("");
  const [NiobBusdValue, setNiobBusdValue] = useState("");
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");

  const closeSidebar = () => {
    if (width < 991) {
      props.small_nav();
    }
  };

  const setSideBarOption = (option) => {
    if (selectedOption == option) {
      setSelectedOption("");
    } else {
      if (props.showSocial) {
        if (!isMobile) {
          // props.closeSidebar();
        }
      }
      setSelectedOption(option);
    }
  };

  const getNiobDollarValue = async () => {
    const res = await ExchangeService.getAmountsOutForDValue(10 ** 9, [
      "0xce3f08e664693ca792cace4af1364d5e220827b2",
      "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    ]);
    setNiobBusdValue(res[1] / 10 ** 6);
  };

  React.useEffect(() => {
    getNiobDollarValue();
    if (props.showSocial) {
      setSelectedOption("");
    }
  }, [props.showSocial]);
  return (
    <ProSidebar className={`sidebar_style ${props.className}`}>
      <Menu iconShape="square">
        {/* <MenuItem
          onClick={() => { closeSidebar(); setSideBarOption("") }}
          className={splitLocation[1] === "home" ? "active" : ""}
          icon={<i className="home_nav_icon"></i>}
        >
          <Link to="/home">Homebase</Link>
        </MenuItem>
        <MenuItem
          onClick={() => { closeSidebar(); setSideBarOption("") }}
          className={splitLocation[1] === "home" ? "active" : ""}
          icon={<i className="pred_nav_icon"></i>}
        >
          <Link to="/home">Prediction Trading</Link>
          <a href={"https://prdt.niob.app"} target="_blank">Prediction Trading</a>
        </MenuItem> */}
        <SubMenu
          title={
            <>
              Exchange
              <RightArrowIcon />
            </>
          }
          open={selectedOption == "Exchange"}
          onOpenChange={() => setSideBarOption("Exchange")}
          icon={<ExchangeIcon />}
        >
          <MenuItem
            onClick={() => closeSidebar()}
            className={splitLocation[2] === "exchange" ? "active" : ""}
            // icon={<i className="exchange_nav_icon"></i>}
          >
            <Link to="/trade/exchange">Swap</Link>
          </MenuItem>
          <MenuItem
            onClick={() => closeSidebar()}
            className={splitLocation[2] === "liquidity" ? "active" : ""}
            // icon={<i className="liquidity_nav_icon"></i>}
          >
            <Link to="/trade/liquidity">Liquidity</Link>
          </MenuItem>
        </SubMenu>
        <SubMenu
          title={
            <>
              <a
                href="https://cardano-bridge.milkomeda.com/bridge"
                target="_blank"
              >
                Bridge
              </a>
              <RightArrowIcon />
            </>
          }
          open={selectedOption == "Exchange"}
          // onOpenChange={() => setSideBarOption("Exchange")}
          icon={<LinkIcon />}
        ></SubMenu>
        <SubMenu
          title={
            <>
              <a href="https://docs.cardax.io/get-started" target="_blank">
                Get Started
              </a>
              <RightArrowIcon />
            </>
          }
          open={selectedOption == "Exchange"}
          // onOpenChange={() => setSideBarOption("Exchange")}
          icon={
            <>
              <div className="IconPng">
                <img src={GetStartedIcon} alt="GetStartedIcon" />
              </div>
            </>
          } 
        ></SubMenu>   
        {CurrentChain === "ETHEREUM" ? (
          <MenuItem
            onClick={() => {
              closeSidebar();
              setSideBarOption("");
            }}
            className={splitLocation[1] === "staking" ? "active" : ""}
            icon={<StakingIcon />}
          >
            <Link to="/staking">Staking</Link>
            <RightArrowIcon />
          </MenuItem>
        ) : null}

        {/* <MenuItem
          open={selectedOption == "Farm"}
          onOpenChange={() => setSideBarOption("Farm")}
          className={splitLocation[1] === "farmplanets" ? "active" : ""}
          icon={<FarmingIcon />}
        >
          <Link to="/farmplanets/active">Farming</Link>
          <RightArrowIcon />
        </MenuItem> */}
        {/* <SubMenu
          title="Farming"
          open={selectedOption == "Farm"}
          onOpenChange={() => setSideBarOption("Farm")}
          icon={<FarmingIcon />}
        >
          <MenuItem
            onClick={() => closeSidebar()}
            className={splitLocation[2] === "exchange" ? "active" : ""}
          >
            <Link to="/farmplanets/active">Farm 1</Link>
          </MenuItem>
          
        </SubMenu> */}
        {/* <MenuItem
          onClick={() => {
            closeSidebar();
            setSideBarOption("");
          }}
          className={splitLocation[1] === "farmplanets" ? "active" : ""}
          icon={<i className="farm_nav_icon"></i>}
        >
          <Link to="/farms/active">Farms</Link>
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            closeSidebar();
            setSideBarOption("");
          }}
          className={splitLocation[1] === "poolgalaxy" ? "active" : ""}
          icon={<i className="pools_nav_icon"></i>}
        >
          <Link to="/poolgalaxy">Pool Galaxy</Link>
        </MenuItem> */}
        {/* <MenuItem onClick={()=>setSideBarOption("")} icon={<i className="lottery_nav_icon"></i>}><Link to="/lottery">Lottery</Link></MenuItem> */}
        {/* <MenuItem
          onClick={() => {
            closeSidebar();
            setSideBarOption("");
          }}
          className={splitLocation[1] === "referral" ? "active" : ""}
          icon={<i className="referrals_nav_icon"></i>}
        >
          <Link to="/referral">Referral</Link>
        </MenuItem> */}
        {/* <MenuItem
          onClick={() => {
            setSideBarOption("");
            closeSidebar();
          }}
          icon={<i className="audits_nav_icon"></i>}
        >
          <a href={AUDIT} target="_blank">
            Audits
          </a>
        </MenuItem> */}
        {/* <SubMenu
          title="Features"
          open={selectedOption == "Features"}
          onOpenChange={() => setSideBarOption("Features")}
          icon={<i className="features_nav_icon"></i>}
        > */}
        {/* <MenuItem
            onClick={() => { closeSidebar() }}
          >
            <a href={LOTTERY} target="_blank">Lottery</a>
          </MenuItem>  */}
        {/* <MenuItem
            onClick={() => { closeSidebar() }}
          >
            <a href={NIOB_SHARING} target="_blank">Niob-Sharing</a>
          </MenuItem>
          <MenuItem
            onClick={() => { closeSidebar() }}
          >
            <a href={PREDICTION_TRAINING} target="_blank">Prediction Trading</a>
          </MenuItem>
          <MenuItem
            onClick={() => { closeSidebar() }}
          >
            <a href={INSURANCE_FUND} target="_blank">Insurance Fund</a>
          </MenuItem> */}
        {/* <MenuItem
            onClick={() => { closeSidebar() }}
          >
            <a href={TRADING_FEE_CASHBACK} target="_blank">Trading-Fee Cashback</a>
          </MenuItem> */}
        {/* </SubMenu> */}

        {/* <SubMenu
          title="Listings"
          open={selectedOption == "Listings"}
          onOpenChange={() => setSideBarOption("Listings")}
          icon={<i className="listings_nav_icon"></i>}
        >
          <MenuItem
            onClick={() => {closeSidebar()}}
          >
            <Link to="/">Listing A</Link>
          </MenuItem>
          <MenuItem
            onClick={() => {closeSidebar()}}
          >
            <Link to="/">Listing B</Link>
          </MenuItem>
        </SubMenu> */}

        {/* <SubMenu
          title="Analytics"
          open={selectedOption == "Analytics"}
          onOpenChange={() => setSideBarOption("Analytics")}
          icon={<i className="analytics_nav_icon"></i>}
        >
          <MenuItem
            onClick={() => {
              closeSidebar();
            }}
          >
            <Link to="/">Analytic A</Link>
          </MenuItem>
          <MenuItem
            onClick={() => {
              closeSidebar();
            }}
          >
            <Link to="/">Analytic B</Link>
          </MenuItem>
        </SubMenu> */}

        {/* <SubMenu
          title="More"
          open={selectedOption == "More"}
          onOpenChange={() => setSideBarOption("More")}
          icon={<i className="more_nav_icon"></i>}
        > */}
        {/* <MenuItem
            onClick={() => {
              closeSidebar();
            }}
          >
            <a href={DOCS} target="_blank">
              Docs
            </a>
          </MenuItem> */}
        {/* <MenuItem
            onClick={() => {closeSidebar()}}
          >
            <Link to="/">Blog</Link>
          </MenuItem> */}
        {/* </SubMenu> */}
      </Menu>
      {/* {props.showSocial ? (
        <></>
      ) : ( */}
      <SidebarFooter className="sidebar_footer">
        <ul className="token-language">
          <li className="token_list">
            <img src={Cardax_Favicon} />{" "}
            <span>${NiobBusdValue ? NiobBusdValue.toFixed(4) : "0"}</span>
          </li>
          <li className="token_list">
            <img src={Globe} /> <span className="lang_text">EN</span>
          </li>
        </ul>
        <ul className="social_links">
          {/* <li>
            <Link>
              <img src={Github} />
            </Link>
          </li> */}
          {/* <li>
            <a href="https://www.instagram.com/we.are.saitama/" target="_blank">
              <img src={instagram} />
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/groups/1275234186328559/"
              target="_blank"
            >
              <img src={facebook} />
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/channel/UCcgXSwHloSMeXygKx8bTGBA"
              target="_blank"
            >
              <img src={Youtube} />
            </a>
          </li> */}
          <li>
            <a href="https://discord.com/invite/abrEFCh3qF" target="_blank">
              <img src={discord} />
            </a>
          </li>
          {/* <li>
            <Link>
              <img src={Medium} />
            </Link>
          </li> */}
          <li>
            <a href="https://twitter.com/CardaxDEX" target="_blank">
              <img src={Twitter} />
            </a>
          </li>
          {/* <li>
            <a href="https://t.me/+PjupkZhaJSc1Mjhh" target="_blank">
              <img src={Telegram} />
            </a>
          </li> */}
        </ul>
      </SidebarFooter>
      {/* )} */}
    </ProSidebar>
  );
};
export default Sidebar;
