import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import "./cardstyle.css";

const axios = require("axios");
const Itemcard = (props) => {
  let history = useHistory();
  let userId = window.localStorage.getItem("id");
  const addTocart = async (id) => {
    let productId = id;
    const data = {
      userId: userId,
      productId: productId,
      quantity: 1,
    };
    try {
      const response = await axios.post(
        "https://vetcarebackend.herokuapp.com/addtocart",
        data
      );
      if (response.status === 200) {
        //console.log("Sucessfull");
        alert("Added To cart");
        history.push("/cart");
      } else {
        console.log("Failed");
      }
    } catch (e) {
      console.log("Error");
    }
  };
  return (
    <div className="card">
      {/* <img src={props.img} /> */}

      <h3>{props.title}</h3>
      <p className="price">₹{props.price}</p>
      <p>{props.desc}</p>

      <p>
        {props.quantity == 0 ? (
          <button
            onClick={() => {
              alert("Item out od Stock");
            }}
          >
            Out Of Stock
          </button>
        ) : (
          <button
            onClick={() => {
              addTocart(props.item);
            }}
          >
            Add to Cart
          </button>
        )}
      </p>
    </div>
  );
};

export default Itemcard;
