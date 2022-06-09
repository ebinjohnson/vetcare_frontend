import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../vetcarelogo.png";

import "./myorderstyle.css";
const axios = require("axios");
const Myorders = () => {
  const doc = new jsPDF();
  let history = useHistory();
  let userId = window.localStorage.getItem("id");
  let userName = window.localStorage.getItem("username");
  const [orderitems, setOrderitems] = useState([]);
  async function getOrderitems() {
    const data = {
      userId: userId,
    };
    let response = await axios.post(
      "https://vetcarebackend.herokuapp.com/getcartitems",
      data
    );
    if (response.status === 200) {
      setOrderitems(response.data.cart);
    }
  }
  async function cancelOrder(id) {
    const data = {
      cartId: id,
    };
    console.log(data);
    try {
      const response = await axios.post(
        "https://vetcarebackend.herokuapp.com/cancelorder",
        data
      );
      if (response.status === 200) {
        alert("Order Cancelled");
        window.location.reload(false);
      } else {
        console.log("Failed");
      }
    } catch (e) {
      console.log("Error");
    }
  }
  async function downloadInvoice(
    productName,
    productPrice,
    quantity,
    orderDate
  ) {
    let unitprice = Number(productPrice);
    let noofunits = Number(quantity);
    var amount = unitprice * noofunits;
    var doc = new jsPDF("landscape", "px", "a4", "false");
    doc.addImage(logo, "PNG", 40, 40, 80, 80);
    doc.text(150, 125, "Invoice");
    doc.text(120, 145, "Name : " + userName);
    doc.text(120, 165, "Product Name : " + productName);
    doc.text(120, 185, "Product Quantity : " + quantity);
    doc.text(120, 205, "Product Price : " + productPrice);
    doc.text(120, 225, "Amount : " + String(amount));
    doc.text(120, 245, "Date : " + orderDate);
    doc.text(120, 265, "Payment Done");
    doc.save("invoice.pdf");
    history.push("/myorders");
  }
  useEffect(() => {
    getOrderitems();
    if (userId == null) {
      history.push("/login");
    }
  }, []);
  return (
    <div>
      <div class="topnav">
        <a href="/userhome">Home</a>
        <a href="/viewproducts">View Products</a>
        <a href="/myorders">My Orders</a>

        <a href="/cart" className="cart">
          <i className="fa fa-opencart"></i>
        </a>
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>SI NO</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Order Date</th>
            <th>Address</th>
            <th>Order Status</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {orderitems &&
            orderitems.length > 0 &&
            orderitems.map((a) => {
              if (a.status == "ordered" || a.status == "cancelled") {
                return (
                  <tr>
                    <td></td>
                    <td>{a.productId.productName}</td>
                    <td>{a.productId.productPrice}</td>
                    <td>{a.quantity}</td>
                    <td>{a.orderDate}</td>
                    <td></td>
                    <td>{a.status}</td>

                    {a.status == "cancelled" ? (
                      <></>
                    ) : (
                      <>
                        <td>
                          <button
                            className="invoice download"
                            onClick={() => {
                              downloadInvoice(
                                a.productId.productName,
                                a.productId.productPrice,
                                a.quantity,
                                a.orderDate
                              );
                            }}
                          >
                            Download Invoice
                          </button>
                        </td>
                        <td>
                          <button
                            className="cancel-btn"
                            onClick={() => {
                              cancelOrder(a._id);
                            }}
                          >
                            Cancel Order
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              }
            })}
        </tbody>
      </table>
    </div>
  );
};
export default Myorders;
