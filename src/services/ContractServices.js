import Web3 from "web3";
import TOKEN_ABI from "../assets/ABI/tokenContract.ABI.json";
import { toast } from "../components/Toast/Toast";
import {
  ERRORS,
  LS_KEYS,
  NETWORK_CHAIN_ID,
  NETWORK_CHAIN_NAME,
  NETWORK_LINK,
  NETWORK_NATIVE_CURRENCY_DECIMALS,
  NETWORK_NATIVE_CURRENCY_NAME,
  NETWORK_NATIVE_CURRENCY_SYMBOL,
  NETWORK_RPC_URL,
  WALLET_TYPE,
  NETWORK_CHAIN_ID_NUMBER,
} from "../constant";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { BigNumber } from "bignumber.js";
// import { WalletLinkConnector } from "@web3-react/walletlink-connector";

let web3Object;
let contractOjbect;
let currentContractAddress;
let tokenContractObject;
let currentTokenAddress;
const selWalletType = localStorage.getItem(LS_KEYS.WALLET_TYPE);
let walletTypeObject = selWalletType || WALLET_TYPE.NONE;
let walletConnectProvider;

// const callWeb3ForCoinBase = async (provider) {

// }

const callWeb3ForWalletConnect = async (provider) => {
  const chainIdNumber = Number(NETWORK_CHAIN_ID_NUMBER);
  const configured_rpc = { 1: NETWORK_RPC_URL };

  provider = new WalletConnectProvider({
    rpc: configured_rpc,
    // rpc: {
    //   chainIdNumber: NETWORK_RPC_URL
    //   // 97: "https://data-seed-prebsc-2-s3.binance.org:8545/",
    //   // 56: "https://bsc-dataseed.binance.org/",
    //   // 4: "https://rinkeby.infura.io/v3/1eef3e361aac42f79167464a2e0d6564",
    // },

    infuraId: "c4dceb1e503f41d0b2afab2b23447bc7",
    chainId: Number(NETWORK_CHAIN_ID_NUMBER),
    network: NETWORK_CHAIN_NAME,
  });
  // debugger;
  provider.on("accountsChanged", (accounts) => {});

  provider.on("chainChanged", (chainId) => {});

  provider.on("disconnect", (code, reason) => {});

  const results = await provider.enable();
  web3Object = new Web3(provider);
  // const contract = new web3Object.eth.Contract(
  //   TOKEN_ABI,
  //   "0xaC0DBd7a6f4D50B51aca4e8D363875922CBBE29C"
  // );
  // const txHash = await contract.methods
  //   .approve(provider.accounts[0], "1000000000000000000000")
  //   .send({
  //     from: provider.accounts[0],
  //   });
  // const txHash = await web3Object.eth.sendTransaction({
  //   from: provider.accounts[0],
  //   data: web3Object.eth.abi.encodeFunctionCall(
  //     TOKEN_ABI.filter((o) => o.type === "function" && o.name === "approve")[0],
  //     [provider.accounts[0], "1000000000000000000000"]
  //   ),
  // });
  // console.log("got an web3 instance and called approve:", txHash);
  return { provider, web3: web3Object };
};

const callWeb3ForWalletConnectMobile = async (provider) => {
  const chainIdNumber = Number(NETWORK_CHAIN_ID_NUMBER);
  // const configured_rpc =  { 97: "https://data-seed-prebsc-2-s3.binance.org:8545/"}
  const configured_rpc = { chainIdNumber: NETWORK_RPC_URL };

  provider = new WalletConnectProvider({
    // rpc: configured_rpc,
    rpc: {
      // chainIdNumber: NETWORK_RPC_URL
      97: "https://data-seed-prebsc-2-s3.binance.org:8545/",
      56: "https://bsc-dataseed.binance.org/",
      4: "https://rinkeby.infura.io/v3/afd8f36f409e4486a5b4671bc7c68b87",
      1: "https://mainnet.infura.io/v3/2abfddaf829b4c15adaa9c8070535d5f",
      200201: "https://rpc-devnet-cardano-evm.c1.milkomeda.com/",
    },
    // chainId: Number(NETWORK_CHAIN_ID_NUMBER),
    // network: NETWORK_CHAIN_NAME,
  });
  // debugger;
  provider.on("accountsChanged", (accounts) => {});

  provider.on("chainChanged", (chainId) => {});

  provider.on("disconnect", (code, reason) => {});

  const results = await provider.enable();
  web3Object = new Web3(provider);
  // const contract = new web3Object.eth.Contract(
  //   TOKEN_ABI,
  //   "0xaC0DBd7a6f4D50B51aca4e8D363875922CBBE29C"
  // );
  // const txHash = await contract.methods
  //   .approve(provider.accounts[0], "1000000000000000000000")
  //   .send({
  //     from: provider.accounts[0],
  //   });
  // const txHash = await web3Object.eth.sendTransaction({
  //   from: provider.accounts[0],
  //   data: web3Object.eth.abi.encodeFunctionCall(
  //     TOKEN_ABI.filter((o) => o.type === "function" && o.name === "approve")[0],
  //     [provider.accounts[0], "1000000000000000000000"]
  //   ),
  // });
  // console.log("got an web3 instance and called approve:", txHash);
  return { provider, web3: web3Object };
};

//only for lp tokens
const convertToDecimals = async (value) => {
  const decimals = 18;
  return Number(value) / 10 ** decimals;
};

const isMetamaskInstalled = async (type) => {
  //Have to check the ethereum binding on the window object to see if it's installed
  const { ethereum, web3 } = window;
  // alert("in metamask");
  const result = Boolean(ethereum && ethereum.isMetaMask);
  walletTypeObject = WALLET_TYPE.META_MASK;
  if (result) {
    //metamask
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  } else if (ethereum) {
    //trust wallet
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  } else if (web3) {
    //trustwallet
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  } else {
    if (type) {
      toast.error(`Install ${type} extension first!`);
    }
    return false;
  }
};

const isBinanceChainInstalled = async () => {
  //Have to check the ethereum binding on the window object to see if it's installed
  const { BinanceChain } = window;
  if (BinanceChain) {
    walletTypeObject = WALLET_TYPE.BSC;
    try {
      const accounts = await BinanceChain.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  } else {
    toast.error("Install BinanceChain extension first!");
    return false;
  }
};

const walletWindowListener = async () => {
  const { BinanceChain, ethereum } = window;
  console.log("CCCCCCCCCCC", window.ethereum);

  if (walletTypeObject === WALLET_TYPE.META_MASK) {
    const result = Boolean(ethereum && ethereum.isMetaMask);
    if (result) {
      if (ethereum.chainId !== NETWORK_CHAIN_ID) {
        try {
          const chain = await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: NETWORK_CHAIN_ID }],
          });
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
        } catch (error) {
          console.log("metamask error", error);
          if (error?.code === 4902) {
            try {
              const addChain = await ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: NETWORK_CHAIN_ID,
                    chainName: NETWORK_CHAIN_NAME,
                    nativeCurrency: {
                      name: NETWORK_NATIVE_CURRENCY_NAME,
                      symbol: NETWORK_NATIVE_CURRENCY_SYMBOL,
                      decimals: Number(NETWORK_NATIVE_CURRENCY_DECIMALS),
                    },
                    rpcUrls: [NETWORK_RPC_URL],
                    blockExplorerUrls: [NETWORK_LINK],
                  },
                ],
              });
              window.location.reload();
            } catch (error) {}
          }
        }
      }

      ethereum.on("chainChanged", async (chainId) => {
        if (chainId !== NETWORK_CHAIN_ID) {
          // toast.error('Select Binance Smart Chain Mainnet Network in wallet!')
          try {
            const chain = await ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: NETWORK_CHAIN_ID }],
            });
          } catch (error) {
            console.log("metamask error", error);
            if (error?.code === 4902) {
              try {
                const addChain = await ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: await window.ethereum.chainId,
                      chainName: NETWORK_CHAIN_NAME,
                      nativeCurrency: {
                        name: NETWORK_NATIVE_CURRENCY_NAME,
                        symbol: NETWORK_NATIVE_CURRENCY_SYMBOL,
                        decimals: Number(NETWORK_NATIVE_CURRENCY_DECIMALS),
                      },
                      rpcUrls: [NETWORK_RPC_URL],
                      blockExplorerUrls: [NETWORK_LINK],
                    },
                  ],
                });
              } catch (error) {}
            }
          }
        }
      });
    }
  }
  if (walletTypeObject === "BinanceChain") {
    if (BinanceChain) {
      BinanceChain.on("chainChanged", async (chainId) => {
        if (chainId !== NETWORK_CHAIN_ID) {
          // toast.error('Select Binance Smart Chain Mainnet Network in wallet!')
          try {
            const chain = await BinanceChain.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: NETWORK_CHAIN_ID }],
            });
          } catch (error) {
            console.log("binance error", error);
          }
        }
      });
    }
  }
};

const walletWindowListenerMobile = async () => {
  const { BinanceChain, ethereum } = window;
  if (walletTypeObject === "Metamask") {
    const result = Boolean(ethereum && ethereum.isMetaMask);
    if (result) {
      if (ethereum.chainId !== NETWORK_CHAIN_ID) {
        try {
          const chain = await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: NETWORK_CHAIN_ID }],
          });
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
        } catch (error) {
          console.log("metamask error", error);
          if (error?.code === 4902) {
            try {
              const addChain = await ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: NETWORK_CHAIN_ID,
                    chainName: NETWORK_CHAIN_NAME,
                    nativeCurrency: {
                      name: NETWORK_NATIVE_CURRENCY_NAME,
                      symbol: NETWORK_NATIVE_CURRENCY_SYMBOL,
                      decimals: Number(NETWORK_NATIVE_CURRENCY_DECIMALS),
                    },
                    rpcUrls: [NETWORK_RPC_URL],
                    blockExplorerUrls: [NETWORK_LINK],
                  },
                ],
              });
              window.location.reload();
            } catch (error) {}
          }
        }
      }

      ethereum.on("chainChanged", async (chainId) => {
        if (chainId !== NETWORK_CHAIN_ID) {
          // toast.error('Select Binance Smart Chain Mainnet Network in wallet!')
          try {
            const chain = await ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: NETWORK_CHAIN_ID }],
            });
          } catch (error) {
            console.log("metamask error", error);
            if (error?.code === 4902) {
              try {
                const addChain = await ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: await window.ethereum.chainId,
                      chainName: NETWORK_CHAIN_NAME,
                      nativeCurrency: {
                        name: NETWORK_NATIVE_CURRENCY_NAME,
                        symbol: NETWORK_NATIVE_CURRENCY_SYMBOL,
                        decimals: Number(NETWORK_NATIVE_CURRENCY_DECIMALS),
                      },
                      rpcUrls: [NETWORK_RPC_URL],
                      blockExplorerUrls: [NETWORK_LINK],
                    },
                  ],
                });
              } catch (error) {}
            }
          }
        }
      });
    }
  }
  if (walletTypeObject === WALLET_TYPE.BSC) {
    if (BinanceChain) {
      BinanceChain.on("chainChanged", async (chainId) => {
        if (chainId !== NETWORK_CHAIN_ID) {
          // toast.error('Select Binance Smart Chain Mainnet Network in wallet!')
          try {
            const chain = await BinanceChain.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: NETWORK_CHAIN_ID }],
            });
          } catch (error) {
            console.log("binance error", error);
          }
        }
      });
    }
  }
};

// this function sets global provider

const callWeb3 = async () => {
  if (web3Object) {
    // if provider is already set
    console.log("we already have web3Object", web3Object);
    return web3Object;
  }

  // if not, then set the provider as per wallet selected
  const { ethereum, web3, BinanceChain } = window;
  // if wallet type is metamask
  if (walletTypeObject === WALLET_TYPE.META_MASK) {
    console.log("[tur461] metamask");
    if (ethereum && ethereum.isMetaMask) {
      web3Object = new Web3(ethereum);
      return web3Object;
    } else if (ethereum) {
      web3Object = new Web3(ethereum);
      return web3Object;
    } else if (web3) {
      web3Object = new Web3(web3.currentProvider);
      return web3Object;
    } else {
      // toast.error("You have to install Wallet!");
    }
  } else if (walletTypeObject === WALLET_TYPE.BSC) {
    console.log("[tur461] bsc");
    if (BinanceChain) {
      web3Object = new Web3(BinanceChain);
      return web3Object;
    } else {
      toast.error("You have to install Wallet!");
      return null;
    }
  } else if (walletTypeObject === WALLET_TYPE.WALLET_CONNECT) {
    web3Object = (await callWeb3ForWalletConnect()).web3;
  } else {
    console.log("[tur461] callWeb3 unhandled wallet type: " + walletTypeObject);
    return null;
  }
};

// this function uses that global provider
// by calling above function
// this function is used to get contract instance
const callContract = async (contractAddress, contractABI) => {
  if (
    contractOjbect &&
    currentContractAddress &&
    currentContractAddress.toLowerCase() === contractAddress.toLowerCase()
  ) {
    return contractOjbect;
  }
  const web3Object = await callWeb3();
  if (!web3Object) return toast.error(ERRORS.SEL_WALLET);
  currentContractAddress = contractAddress;
  contractOjbect = new web3Object.eth.Contract(contractABI, contractAddress);
  return contractOjbect;
};

// this function does same as the above function
// but is for token contract instance
const callTokenContract = async (tokenAddress) => {
  if (
    tokenContractObject &&
    currentContractAddress &&
    currentTokenAddress?.toLowerCase() === tokenAddress?.toLowerCase()
  ) {
    return tokenContractObject;
  }
  const web3Object = await callWeb3();
  if (!web3Object) return toast.error(ERRORS.SEL_WALLET);
  currentTokenAddress = tokenAddress;
  tokenContractObject = new web3Object.eth.Contract(
    TOKEN_ABI,
    currentTokenAddress
  );
  return tokenContractObject;
};

const calculateGasPrice = async () => {
  const web3 = await callWeb3();
  if (!web3) return toast.error(ERRORS.SEL_WALLET);
  const safeGasPrice = 1.2 * (await web3.eth.getGasPrice());
  return safeGasPrice.toFixed();
};

const getDefaultAccount = async () => {
  const web3 = await callWeb3();
  if (!web3) return toast.error(ERRORS.SEL_WALLET);
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
};

const approveToken = async (
  address,
  value,
  mainContractAddress,
  tokenAddress
) => {
  try {
    const gasPrice = await calculateGasPrice();
    const contract = await callTokenContract(tokenAddress);
    //calculate estimate gas limit
    const gas = await contract.methods
      .approve(mainContractAddress, value)
      .estimateGas({ from: address });

    return await contract.methods
      .approve(mainContractAddress, value)
      .send({ from: address, gasPrice, gas });
  } catch (error) {
    return error;
  }
};

const allowanceToken = async (tokenAddress, mainContractAddress, address) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    return await contract.methods
      .allowance(address, mainContractAddress)
      .call();
  } catch (error) {
    return error;
  }
};

const getTokenBalanceForMax = async (tokenAddress, address) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    if (!contract) return toast.error(ERRORS.SEL_WALLET);
    console.log("### addr:", tokenAddress, address);
    const decimals = await contract.methods.decimals().call();
    let result = await contract.methods.balanceOf(address).call();

    result = Number(result) / 10 ** decimals;
    return Number(result);
  } catch (error) {
    console.log("Error:", error);
    return 0;
  }
};

const getTokenBalance = async (tokenAddress, address) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    if (!contract) return toast.error(ERRORS.SEL_WALLET);
    console.log("### address:", tokenAddress, address);
    const decimals = await contract.methods.decimals().call();

    let result = await contract.methods.balanceOf(address).call();

    result = BigNumber(result / 10 ** decimals).toFixed();
    return result;
  } catch (error) {
    console.log("Error:", error);
    return 0;
  }
};
const getTokenBalanceFull = async (tokenAddress, address) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    const decimals = await contract.methods.decimals().call();

    let result = await contract.methods.balanceOf(address).call();
    result = result / 10 ** decimals;

    return result;
  } catch (error) {
    console.log("Error:", error);
    return 0;
  }
};

const getDecimals = async (tokenAddress) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    if (!contract) return toast.error(ERRORS.SEL_WALLET);
    return await contract.methods.decimals().call();
  } catch (error) {
    return error;
  }
};

const getTokenName = async (tokenAddress) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    if (!contract) return toast.error(ERRORS.SEL_WALLET);
    return await contract.methods.name().call();
  } catch (error) {
    return error;
  }
};

const getTokenSymbol = async (tokenAddress) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    if (!contract) return toast.error(ERRORS.SEL_WALLET);
    return await contract.methods.symbol().call();
  } catch (error) {
    return error;
  }
};

const getBNBBalanceForMax = async (address) => {
  try {
    const web3 = await callWeb3();
    if (!web3) return toast.error(ERRORS.SEL_WALLET);
    let result = await web3.eth.getBalance(address);
    //result = (Number(result) / 10 ** 18).toFixed(5);
    return Number(result);
  } catch (error) {
    return error;
  }
};

const getBNBBalance = async (address) => {
  try {
    const web3 = await callWeb3();
    if (web3) {
      let result = await web3.eth.getBalance(address);
      result = (Number(result) / 10 ** 18).toFixed(5);
      return Number(result);
    }
  } catch (error) {
    return error;
  }
};

const setWalletType = async (walletType) => {
  walletTypeObject = walletType;
};

const getTotalSupply = async (tokenAddress) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    if (!contract) return toast.error(ERRORS.SEL_WALLET);
    let result = await contract.methods.totalSupply().call();
    const decimals = await contract.methods.decimals().call();
    result = Number(result) / 10 ** Number(decimals);
    return result;
  } catch (error) {
    return error;
  }
};

const web3ErrorHandle = async (err) => {
  let message = "Transaction Reverted!";
  if (err.message.indexOf("Rejected") > -1) {
    message = "User denied the transaction!";
  } else if (err.message && err.message.indexOf("User denied") > -1) {
    message = "User denied the transaction!";
  } else if (err.message && err.message.indexOf("INSUFFICIENT_B") > -1) {
    message = "Insufficient value of second token!";
  } else if (err.message && err.message.indexOf("INSUFFICIENT_A") > -1) {
    message = "Insufficient value of first token!";
  } else {
    console.log(err, err.message);
  }
  return message;
};

const getLiquidity100Value = async (tokenAddress, address) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    if (!contract) return toast.error(ERRORS.SEL_WALLET);
    return await contract.methods.balanceOf(address).call();
  } catch (error) {
    console.log("Error:", error);
    return error;
  }
};

//exporting functions
export const ContractServices = {
  isMetamaskInstalled,
  isBinanceChainInstalled,
  callWeb3,
  web3Object,
  callContract,
  calculateGasPrice,
  approveToken,
  getTokenBalance,
  getBNBBalanceForMax,
  getTokenBalanceFull,
  getDecimals,
  getTokenName,
  getTokenSymbol,
  getBNBBalance,
  setWalletType,
  allowanceToken,
  getTotalSupply,
  convertToDecimals,
  getTokenBalanceForMax,
  web3ErrorHandle,
  getDefaultAccount,
  callTokenContract,
  walletWindowListener,
  walletTypeObject,
  getLiquidity100Value,
  callWeb3ForWalletConnect,
  callWeb3ForWalletConnectMobile,
};
