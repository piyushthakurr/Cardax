import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LS_KEYS } from "../../constant";
import { ContractServices } from "../../services/ContractServices";

const TokenBalance = ({ address }) => {
  const [balance, setBalance] = useState("");
  const isUserConnected = useSelector((state) => state.persist.isUserConnected);

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

  useEffect(() => {
    isWalletSelected && init();
  }, [isUserConnected, address]);

  const init = async () => {
    try {
      let res = 0;
      if (address === "BNB") {
        res = await ContractServices.getBNBBalance(isUserConnected);
        setBalance(res);
      } else {
        res = await ContractServices.getTokenBalance(address, isUserConnected);
        setBalance(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return <span className="tokenName_textStyle">{balance}</span>;
};

export default TokenBalance;
