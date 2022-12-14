import packageJson from "../../../package.json";
import { EVENTS, WALLET_TYPE } from "../../constant";
import { ContractServices } from "../../services/ContractServices";

/** seting action types */
export const actionTypes = {
  USER_CONNECTED: "USER_CONNECTED",
  LOGOUT: "LOGOUT",
  TOKEN_LIST_ADD: "TOKEN_LIST_ADD",
  TOKEN_LIST_DEL: "TOKEN_LIST_DEL",
  SAVE_SLIPPAGE_PERCENTAGE: "SAVE_SLIPPAGE_PERCENTAGE",
  SAVE_DEADLINE: "SAVE_DEADLINE",
  LOGIN_USER_SUCCESS: "LOGIN_USER_SUCCESS",
  SAVE_USER_LP_TOKENS: "SAVE_USER_LP_TOKENS",
  SAVE_USER_RECENT_TRANSACTIONS: "SAVE_USER_RECENT_TRANSACTIONS",
  SAVE_REFFRAL_ADDRESS: "SAVE_REFFRAL_ADDRESS",
  CHECK_USER_LPTOKENS: "CHECK_USER_LPTOKENS",
  LOGIN_CONFIRMATION_SREEN: "LOGIN_CONFIRMATION_SREEN",
  LOGOUT_CONFIRMATION_SREEN: "LOGOUT_CONFIRMATION_SREEN",
  SAVE_FOOTER_DATA: "SAVE_FOOTER_DATA",
  INITIALIZE_TOKEN_LIST: "INITIALIZE_TOKEN_LIST",
};

export const versionManager = () => async (dispatch, getState) => {
  try {
    const version = packageJson.version;
    const react_version = localStorage.getItem("react_version");
    if (react_version && version !== react_version) {
      localStorage.clear();
      window.location.reload();
    }
    if (!react_version) {
      localStorage.setItem("react_version", version);
    }
  } catch (error) {
    console.log(error);
  }
};

export const initializeTokenList = (data) => {
  return {
    type: actionTypes.INITIALIZE_TOKEN_LIST,
    payload: data,
  };
};

/*
 * Action creators
 */
export const login = (data) => {
  // console.log("##hi i am sam");
  setTimeout((_) => {
    document.dispatchEvent(new Event(EVENTS.LOGIN_SUCCESS, {}));
  }, 100);
  return {
    type: actionTypes.USER_CONNECTED,
    payload: data,
  };
};
export const logout = () => {
  ContractServices.setWalletType(WALLET_TYPE.NONE);
  localStorage.clear();
  window.location.reload();
  return {
    type: actionTypes.LOGOUT,
  };
};

export const tokenListAdd = (data) => {
  return {
    type: actionTypes.TOKEN_LIST_ADD,
    payload: data,
  };
};
export const tokenListDel = (data) => {
  return {
    type: actionTypes.TOKEN_LIST_DEL,
    payload: data,
  };
};
export const saveSlippagePercentage = (data) => {
  return {
    type: actionTypes.SAVE_SLIPPAGE_PERCENTAGE,
    payload: data,
  };
};
export const saveDeadline = (data) => {
  return {
    type: actionTypes.SAVE_DEADLINE,
    payload: data,
  };
};
export const saveUser = (data) => {
  return {
    type: actionTypes.LOGIN_USER_SUCCESS,
    payload: data,
  };
};
export const saveUserLpTokens = (data) => {
  return {
    type: actionTypes.SAVE_USER_LP_TOKENS,
    payload: data,
  };
};
export const checkUserLpTokens = (payload) => {
  return {
    type: actionTypes.CHECK_USER_LPTOKENS,
    payload,
  };
};

export const savereffralAddress = (address) => {
  return {
    type: actionTypes.SAVE_REFFRAL_ADDRESS,
    payload: address,
  };
};

export const addTransaction = (data) => async (dispatch, getState) => {
  let {
    persist: { recentTransactions },
  } = getState();
  recentTransactions.unshift(data);
  dispatch({
    type: actionTypes.SAVE_USER_RECENT_TRANSACTIONS,
    payload: { recentTransactions },
  });
};

export const removeTokenList = (data) => async (dispatch, getState) => {
  let {
    persist: { tokenList },
  } = getState();
  const findIndex = tokenList.findIndex(
    (a) => a.address.toLowerCase() === data.address.toLowerCase()
  );
  const tkList = tokenList.splice(findIndex, 1);
  // console.log(tkList);
};

export const loginConfirmationScreen = (data) => {
  return {
    type: actionTypes.LOGIN_CONFIRMATION_SREEN,
  };
};

export const logoutConfirmationScreen = (data) => {
  return {
    type: actionTypes.LOGOUT_CONFIRMATION_SREEN,
  };
};

export const saveFotterValues = (data) => async (dispatch, getState) => {
  dispatch({
    type: actionTypes.SAVE_FOOTER_DATA,
    payload: data,
  });
};
