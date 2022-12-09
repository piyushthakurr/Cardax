import React, { useEffect, useState } from "react";
import { Col, Row, Modal } from "react-bootstrap";
import "./ModalCurrencyStyle.scss";
import CoinItem from "../../coinItem/CoinItem";
import { useDispatch } from "react-redux";
import { tokenListAdd, tokenListDel } from "../../../redux/actions";

const ModalCurrency = ({
  show,
  handleClose,
  tokenList,
  searchByName,
  searchToken,
  selectCurrency,
  tokenType,
  currencyName,
}) => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({ tokenSearch: "" });

  // Set Token Search Input Value and Pass to Parent Component (Add Liquidity)
  const handleChange = (e, name) => {
    searchByName(e.target.value);
    setValues({ ...values, [name]: e.target.value });
  };

  const [isAdded, setTokenAdd] = useState(true);
  const handleTokenList = (data) => {
    data.isAdd = false;
    data.isDel = true;
    dispatch(tokenListAdd(data));
    setTokenAdd(false);
  };
  const handleRemoveTokenList = async (data) => {
    dispatch(tokenListDel(data));
    searchByName("");
    window.location.reload();
  };

  useEffect(() => {
    if (!show) {
      setValues({ tokenSearch: "" });
    }
    return () => {
      // cleanup function here
    };
  }, [show, searchByName]);
  return (
    <Modal
      scrollable={true}
      className="selectCurrency_modal"
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Select a Token</Modal.Title>
      </Modal.Header>
      <Row>
        <Col>
          <div className="gradiantWrap">
            <input
              className="searchInput_Style"
              placeholder="Search name or paste address"
              name="tokenSearch"
              onChange={(e) => searchToken(e.target.value)}
              onPaste={(e) => searchToken(e.target.value)}
            />
          </div>
          <div className="tokenName">{/* <h4>Token Name</h4> */}</div>
        </Col>
      </Row>

      <Modal.Body>
        <Row className="coinListBlockStyle">
          {tokenList && tokenList?.length ? (
            tokenList.map((token, index) => (
              <Col key={index}>
                {currencyName === token?.symbol ? (
                  <CoinItem
                    className={`active token-symbol`}
                    disabled={token?.isDel}
                    iconImage="?"
                    title={token.name}
                    tokenDetails={token}
                    onClick={token?.isDel ? (_) => _ : (_) => _}
                  />
                ) : (
                  <CoinItem
                    className="token-symbol"
                    disabled={token?.isDel}
                    onClick={
                      token?.isDel
                        ? (_) => _
                        : () => selectCurrency(token, tokenType)
                    }
                    iconImage={token?.icon}
                    title={token?.name}
                    tokenDetails={token}
                  />
                )}
              </Col>
            ))
          ) : (
            <div className="text-center">No results found.</div>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCurrency;
