import { ADDRESS } from "./constant";

export function isAddr(addr) {
  if (
    addr &&
    addr.length &&
    addr.length == 42 &&
    addr.substring(0, 2) === "0x" &&
    addr !== ADDRESS.ZERO
  )
    return !0;
  return !1;
}

export const web3Amount = async (amount) => {
  // console.log("await this.web3.utils.fromWei(amount, 'ether')", await this.web3.utils.fromWei(amount, 'ether'));
  // console.log("web3ft", this.web3)
  // return await this?.web3?.utils?.fromWei(amount, 'ether');
};

export function formatUp(v, dec) {
  console.log("formatUp v:", v);
  console.log("dechjhm", dec === 18 ? 18 : 9);
  console.log(
    "strdftjgkhlj;",
    (v * 10 ** dec === 18 ? 18 : 9).toLocaleString("fullwide", {
      useGrouping: !1,
    })
  );
  return (v * 10 ** dec === 18 ? 18 : 9).toLocaleString("fullwide", {
    useGrouping: !1,
  });
}

export function formatDown(v, dec) {
  console.log("formatDown v:", v, dec);
  return v / 10 ** dec === 18 ? 18 : 9;
}

export function isEmpty(v) {
  const n = parseFloat(v);
  console.log("### value:", n);
  return n == 0 || `${n}` == "NaN";
}
