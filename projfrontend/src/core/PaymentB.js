import React, { useState, useEffect } from "react";
import { cartEmpty, loadCart } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import { getMyToken, processPayment } from "./helper/paymentBHelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth/helper";

import DropIn from "braintree-web-drop-in-react";

const PaymentB = ({ products, setReload = (f) => f, reload = undefined }) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getMyToken(userId, token).then((data) => {
      console.log("INFORMATION", data);
      if (data.error) {
        setInfo({ ...info, error: data.error });
      } else {
        const clientToken = data.clientToken;
        setInfo({ clientToken });
        //equ. to setInfo({clientToken: clientToken})
      }
    });
  };

  const showBTDropIn = () => {
    return isAuthenticated() ? (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
            />
            <button
              className="btn btn-block btn-outline-light"
              onClick={onPurchase}
            >
              Purchase
            </button>
          </div>
        ) : (
          <h3>Please login or add something to cart</h3>
        )}
      </div>
    ) : (
      <Link to="/signin">
        <button className="btn rounded btn-warning">Please Sign in first</button>
      </Link>
    )
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const onPurchase = () => {
    setInfo({ loading: true });
    let nonce;
    let getNonce = info.instance.requestPaymentMethod().then((data) => {
      nonce = data.nonce;
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getAmount(),
      };
      processPayment(userId, token, paymentData)
        .then((response) => {
          setInfo({ ...info, loading: false, success: response.success });
          console.log("PAYMENT SUCCESS");
          const orderData = {
              products: products,
              transaction_id: response.transaction.id,
              amount: response.transaction.amount
          }
          createOrder(userId,token,orderData)
          cartEmpty(() => {
            console.log("Cart emptied")  
          })
          setReload(!reload)
        })
        .catch((err) => {
          setInfo({ ...info, loading: false, success: false, error: err });
          console.log("PAYMENT FAILED");
        });
    });
  };

  const getAmount = () => {
    let amount = 0;
    products.map((prod) => {
      amount = amount + prod.price;
    });
    return amount;
  };

  const successMessage = () => {
    return (
      <div className="row">
        <div className="col-md-8 mt-3 offset-sm-2 text-center">
          <div
            className="alert alert-success"
            style={{ display: info.success ? "" : "none" }}
          >
            Payment Successful
          </div>
        </div>
      </div>
    );
  };
  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-8 mt-3 offset-sm-2 text-center">
          <div
            className="alert alert-danger"
            style={{ display: info.error ? "" : "none" }}
          >
            {info.error}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h3>Total Amount: Rs {getAmount()}</h3>
      {showBTDropIn()}
      {successMessage()}
      {errorMessage()}
    </div>
  );
};

export default PaymentB;
