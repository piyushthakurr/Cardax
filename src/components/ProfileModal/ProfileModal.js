import React from "react";
import { Col, Row, Modal, Form } from "react-bootstrap";
import CopyIcon from "../../assets/images/copy_Icon.png";
import "./ProfileModal.scss";
import { useSelector } from "react-redux";
import { NETWORK_SCAN, NETWORK_SCAN_NAME } from "../../constant";
import { toast } from "../Toast/Toast";
import { CopyToClipboard } from "react-copy-to-clipboard";
import TolerenceIcon from "../../assets/images/tolerence_Icon.png";
import Button from "../Button/Button";

const ProfileModal = ({ show, handleClose, logout }) => {
  const isUserConnected = useSelector((state) => state.persist.isUserConnected);

  return (
    <Modal
      centered
      scrollable={true}
      className="connect_wallet"
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Your Wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col className="baseToken_style">
            <div className="profileModal_sec">
              <p>{isUserConnected}</p>
              <div className="copySec">
                <a
                  href={`${NETWORK_SCAN}address/${isUserConnected}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on {NETWORK_SCAN_NAME}
                  <img src={TolerenceIcon} />
                </a>
                <div className="ms-3">
                  <a>
                    Copy
                    <CopyToClipboard
                      text={`${NETWORK_SCAN}/address/${isUserConnected}`}
                      onCopy={() => toast.success("Copied!")}
                    >
                      <img className="copy-icon" alt="copy" src={CopyIcon} />
                    </CopyToClipboard>
                  </a>
                </div>
              </div>
              <div className="text-center">
                <Button
                  className="logout_btn mx-auto"
                  onClick={logout}
                  title="Logout"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileModal;
