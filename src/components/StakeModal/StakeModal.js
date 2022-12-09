import "./StakeModal.scss";
import { Link } from "react-router-dom";
import Card from "../Card/Card";
import closeBtn from "../../assets/images/ionic-md-close.svg";
import { Col, Row, Modal, Button } from "react-bootstrap";

const StakeModal = ({
  closeModal,
  rewards,
  stakePeriod,
  stakeAmount,
  tokenBalance,
  handleStake,
  show,
}) => {
  return (
    <>
      <Modal
        centered
        scrollable={true}
        className="connect_wallet supply_mode"
        show={show}
        onHide={closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>You are Staking Saitama</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <ul className="swap_confirmation">
              <li>
                <p>
                  <span>Token Balance:</span>
                  <span> {tokenBalance}</span>
                  <span>SAITAMA</span>
                </p>
              </li>
              <li>
                <p>
                  <span>Amount to be Staked:</span>
                  <span> {stakeAmount}</span>
                  <span>SAITAMA</span>
                </p>
              </li>
              <li>
                <p>
                  <span>Total rewards:</span>
                  <span> {rewards}</span>
                  <span>SAITAMA</span>
                </p>
              </li>
              <li>
                <p>
                  <span>Stake Period:</span>
                  <span> {stakePeriod}</span>
                  <span>Days</span>
                </p>
              </li>
            </ul>
            <div className="col modal_headerStyle__rowC_colRight Confirm_btn">
              <button
                className="btn buttonStyle full"
                onClick={() => handleStake()}
              >
                Confirm Stake
              </button>
            </div>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default StakeModal;
