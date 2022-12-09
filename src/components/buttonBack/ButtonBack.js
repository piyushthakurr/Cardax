import React from "react";
import { Link, useHistory } from "react-router-dom";
import goBack from "../../assets/images/token_icons/saitamaIcons/arrowVertical.svg";
import "./ButtonBackStyle.scss";

const ButtonBack = (props) => {
  const history = useHistory();
  return (
    <Link
      className="goBackButtonStyle"
      to={{ javascript: void 0 }}
      onClick={() => {
        history.goBack();
      }}
    >
      <img src={goBack} />
    </Link>
  );
};

export default ButtonBack;
