import React from "react";
import { Col, Row } from "react-bootstrap";
import "./CoinItemStyle.scss";
import Question_mark from "../../assets/images/Question_mark.png"

const CoinItem = (props) => {
  return (
    <>
      <Col
        {...props}
        className={`coinItem_style ${props.className} ${props.disabled ? "disabled" : ""
          }`}
        disabled={props.disabled}
      >
        {/* <img src={Question_mark} /> */}
        <img src={props.iconImage} />

        <p className="titleStyle">{props.title}</p>
      </Col>
    </>
  );
};
export default CoinItem;
