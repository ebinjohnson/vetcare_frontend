import React, { useEffect, useState } from "react";
import GooglePayButton from "@google-pay/button-react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useCart } from "react-use-cart";
import "./cartstyle.css";

const axios = require("axios");
const Cart = () => {
  let history = useHistory();
  var carttotal = 0;
  let cartArray = [];
  let stock = [];
  let productArray = [];
  let oldquantity = [];
  let userId = window.localStorage.getItem("id");
  const [cartitems, setCartitems] = useState([]);
  async function getcartitems() {
    const data = {
      userId: userId,
    };
    let response = await axios.post("https://vetcarebackend.herokuapp.com/getcartitems", data);
    if (response.status === 200) {
      setCartitems(response.data.cart);
    }
  }
  async function addquantity(id, cquantity) {
    const data = {
      cartId: id,
      quantity: cquantity,
    };
    console.log(data);
    try {
      const response = await axios.post(
        "https://vetcarebackend.herokuapp.com/addquantity",
        data
      );
      if (response.status === 200) {
        window.location.reload(false);
      } else {
        console.log("Failed");
      }
    } catch (e) {
      console.log("Error");
    }
  }
  async function removequantity(id, cquantity) {
    const data = {
      cartId: id,
      quantity: cquantity,
    };
    console.log(data);
    try {
      const response = await axios.post(
        "https://vetcarebackend.herokuapp.com/removequantity",
        data
      );
      if (response.status === 200) {
        window.location.reload(false);
      } else {
        console.log("Failed");
      }
    } catch (e) {
      console.log("Error");
    }
  }
  async function removefromcart(id) {
    const data = {
      cartId: id,
    };
    console.log(data);
    try {
      const response = await axios.post(
        "https://vetcarebackend.herokuapp.com/removefromcart",
        data
      );
      if (response.status === 200) {
        alert("Item Removed");
        window.location.reload(false);
      } else {
        console.log("Failed");
      }
    } catch (e) {
      console.log("Error");
    }
  }
  async function emptycart(cartArray, productArray, stock, oldquantity) {
    for (let i = 0; i < cartArray.length; i++) {
      const data = {
        cartId: cartArray[i],
      };
      let response = await axios.post("https://vetcarebackend.herokuapp.com/emptycart", data);
      if (response.status === 200) {
        for (let i = 0; i < productArray.length; i++) {
          const newdata = {
            productId: productArray[i],
            oldquantity: oldquantity[i],
            stock: stock[i],
          };
          let stockm = await axios.post(
            "https://vetcarebackend.herokuapp.com/updatestock",
            newdata
          );
          if (stockm.status == 200) {
            alert("Order Placed");
            history.push("/viewproducts");
          }
        }
      }
    }
  }
  console.log(cartArray);
  useEffect(() => {
    getcartitems();
  }, []);
  return (
    <div>
      <div class="topnav">
        <a href="/userhome">Home</a>
        <a href="/viewproducts">View Products</a>
        <a href="/myorders">My Orders</a>
      </div>
      <div className="cart-body1">
        <div className="Cart-Container1">
          <div className="Header1">
            <h3 className="Heading1">Shopping Cart</h3>
            <h5 className="Action1">Remove all</h5>
          </div>
          {cartitems &&
            cartitems.length > 0 &&
            cartitems.map((a) => {
              if (a.status == "pending") {
                return (
                  <div className="Cart-Items1">
                    <div className="image-box1">
                      <img
                        src="https://cdn.pixabay.com/photo/2020/02/12/05/13/dog-cartoon-4841702__480.jpg"
                        style={{ height: "100px" }}
                      />
                    </div>
                    <div className="about1">
                      <h1 className="title1" onLoad={cartArray.push(a._id)}>
                        {a.productId.productName}
                      </h1>
                      <h3
                        className="subtitle2"
                        onLoad={productArray.push(a.productId)}
                      >
                        Price: INR {a.productId.productPrice}
                      </h3>
                      <h3
                        className="subtitle1"
                        onLoad={oldquantity.push(a.productId.productQuantity)}
                      >
                        {a.productId.productDescription}
                      </h3>
                    </div>
                    <div className="counter1">
                      <div
                        className="btn1"
                        onClick={() => {
                          if (a.quantity == a.productId.productQuantity) {
                            alert("Maximum Quantity Reached");
                          } else {
                            addquantity(a._id, a.quantity);
                          }
                        }}
                      >
                        +
                      </div>
                      <div className="count1" onLoad={stock.push(a.quantity)}>
                        {a.quantity}
                      </div>
                      <div
                        className="btn1"
                        onClick={() => {
                          if (a.quantity == 1) {
                            removefromcart(a._id);
                          } else {
                            removequantity(a._id, a.quantity);
                          }
                        }}
                      >
                        -
                      </div>
                    </div>
                    <div className="prices1">
                      <div
                        className="amount1"
                        onLoad={
                          (carttotal =
                            carttotal + a.quantity * a.productId.productPrice)
                        }
                      >
                        {a.productId.productPrice * a.quantity}
                      </div>

                      <div className="remove1">
                        <u
                          onClick={() => {
                            removefromcart(a._id);
                          }}
                        >
                          Remove
                        </u>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          <hr />
          <div className="checkout1">
            <div className="total1">
              <div>
                <div className="Subtotal1">Sub-Total</div>
                <div className="items1"></div>
              </div>
              <div className="total-amount1">{carttotal}</div>
            </div>
            <GooglePayButton
              environment="TEST"
              buttonType="pay"
              paymentRequest={{
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: [
                  {
                    type: "CARD",
                    parameters: {
                      allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                      allowedCardNetworks: ["MASTERCARD", "VISA"],
                    },
                    tokenizationSpecification: {
                      type: "PAYMENT_GATEWAY",
                      parameters: {
                        gateway: "example",
                        gatewayMerchantId: "exampleGatewayMerchantId",
                      },
                    },
                  },
                ],
                merchantInfo: {
                  merchantId: "12345678901234567890",
                  merchantName: "Demo Merchant",
                },
                transactionInfo: {
                  totalPriceStatus: "FINAL",
                  totalPriceLabel: "Total",
                  totalPrice: String(carttotal),
                  currencyCode: "INR",
                  countryCode: "IN",
                },
                shippingAddressRequired: true,

                callbackIntents: ["SHIPPING_ADDRESS"],
              }}
              onPaymentDataChanged={(paymentData) => {}}
              onLoadPaymentData={(paymentRequest) => {
                console.log("load payment data", paymentRequest);
                emptycart(cartArray, productArray, stock, oldquantity);
              }}
              onLoadAuthorized={(paymentData) => {
                console.log("Payment Authorized Success", paymentData);
                return { transactionState: "Success" };
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
