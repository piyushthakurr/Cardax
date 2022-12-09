import React from 'react';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { NETWORK_SCAN, NETWORK_SCAN_NAME } from '../../constant';
import checkicon from '../../assets/images/check_icon.svg';
import '../ConnectWallet/ConnectWallet.scss';

const TransactionalModal = ({
  show,
  handleClose,
  txHash,

  oneCurrency,
  TwoCurrency,
  tokenOne,
  tokenTwo,
  decimal,
  oneIcon,
  twoIcon,
}) => {
  const recentTransactions = useSelector(
    (state) => state.persist.recentTransactions
  );

  //   console.log(
  // "hoooo",
  //   //     handleClose,
  //   // txHash,
  //   // oneCurrency,
  //   // TwoCurrency,
  //   // tokenOne,
  //   tokenTwo,
  //   // decimal,
  //   // oneIcon,
  //   // twoIcon
  //   );

  const importToken = async () => {
    window.ethereum
      .request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          // options: {
          //   address: tokenAddress,
          //   symbol: tokenCurrency,
          //   decimals: decimals,
          //   image: oneIcon,
          // },
          options: {
            address: tokenTwo.address,
            symbol: TwoCurrency,
            decimals: decimal,
            image: 'https://foo.io/token-image.svg',
          },
        },
      })
      .then((success) => {
        console.log('token present!');

        if (success) {
          console.log('token present!');
        } else {
          console.log('token missing.. 1');
          throw new Error('Something went wrong.');
        }
      })
      .catch((error) => console.log('token missing.. 2', error));
  };
        console.log("token",tokenTwo?.symbol)

  return (
    <Modal
      centered
      scrollable={true}
      className='connect_wallet'
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Transaction Submitted</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col className='baseToken_style'>
            <div className='text-center mb-3'>
              <img
                src={checkicon}
                alt='icon'
                width='50'
                className='icon_color'
              />
            </div>
            <a
              href={`${NETWORK_SCAN}/tx/${txHash}`}
              target='_blank'
              rel='noreferrer'
              className='d-block text-center mb-4 ClrText'
            >
              View on {NETWORK_SCAN_NAME}
            </a>
            <div className='no_record BtnAdd mb-3'>
              <button
                type='button'
                className='btn buttonStyle full'
                onClick={importToken}
              >
                Add {tokenTwo?.symbol} to Metamask
              </button>
            </div>
            <div className='no_record BtnClose'>
              <button
                type='button'
                className='btn buttonStyle full'
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default TransactionalModal;
