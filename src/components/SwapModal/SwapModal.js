import "./SwapModal.scss";
import { Link } from "react-router-dom";
import Card from "../Card/Card";
import closeBtn from "../../assets/images/ionic-md-close.svg";
import { Col, Row, Modal, Button } from "react-bootstrap";
import { BigNumber } from "bignumber.js";

const SwapModal = ({
  closeModal,
  tokenOneCurrency,
  tokenTwoCurrency,
  tokenOneValue,
  tokenTwoValue,
  tokenOneIcon,
  tokenTwoIcon,
  sharePoolValue,
  handleSwap,
  priceImpact,
  minimumReceived,
  amountIn,
  liquidityProviderFee,
  slippagePercentage,
  show,
}) => {
  console.log(
    "wduavdk",
    tokenOneValue,
    tokenTwoValue,
    slippagePercentage,
    tokenOneCurrency
  );

  let amountToken1 =
    Number(tokenOneValue) + Number(tokenOneValue / 100) * slippagePercentage;

  console.log("atmostAmount", amountToken1);

  let amountToken2 = tokenTwoValue - (tokenTwoValue / 100) * slippagePercentage;

  console.log("gdeiewkd", amountIn);

  return (
    <>
      <Modal
        centered
        scrollable={true}
        className="connect_wallet supply_mode SpacingIn"
        show={show}
        onHide={closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Swap.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <ul className="swap_confirmation">
              <li>
                <p>
                  <img src={tokenOneIcon} alt="icon" className="me-2" />
                  {tokenOneValue}
                </p>{" "}
                <span> {tokenOneCurrency}</span>
              </li>
              <li>
                <p>
                  <img src={tokenTwoIcon} alt="icon" className="me-2" />
                  {tokenTwoValue}
                </p>{" "}
                <span> {tokenTwoCurrency}</span>
              </li>
              {amountIn === "TK1" ? (
                <li>
                  <h6>
                    Input is estimated. You will receive atleast{" "}
                    <strong>
                      {amountToken2} {tokenTwoCurrency}
                    </strong>{" "}
                    or the transaction will revert.
                  </h6>
                </li>
              ) : (
                <li>
                  <h6>
                    Input is estimated. You will sell at most{" "}
                    <strong>
                      {/* {Number(tokenOneValue) + Number(slippagePercentage)}{' '} */}
                      {Number(amountToken1.toFixed(7))}
                      {tokenOneCurrency}{" "}
                    </strong>{" "}
                    or the transaction will revert.
                  </h6>
                </li>
              )}
              <li>
                Price:{" "}
                <span>
                  {" "}
                  {sharePoolValue} {tokenOneCurrency}/ {tokenTwoCurrency}
                </span>
              </li>
              {amountIn == "TK1" ? (
                <li>
                  Minium Recieved {""}
                  <span>
                    {amountToken2} {tokenTwoCurrency}
                  </span>
                </li>
              ) : (
                <li>
                  Maximum Spent{""}{" "}
                  <span>
                    {amountToken1.toFixed(7)}
                    {tokenOneCurrency}
                  </span>
                </li>
              )}

              <li>
                Price Impact: <span>{priceImpact}%</span>
              </li>
              <li>
                Liquidity provider fee: <span>{liquidityProviderFee}</span>
              </li>
            </ul>
            <div className="col modal_headerStyle__rowC_colRight Confirm_btn">
              <button
                className="btn buttonStyle full"
                onClick={() => handleSwap()}
              >
                Confirm
              </button>
            </div>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SwapModal;
