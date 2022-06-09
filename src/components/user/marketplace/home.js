import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import Itemcard from "./itemcard";

import data from "./data";
import "./viewstyle.css";
const axios = require("axios");
const Home = () => {
  let history = useHistory();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState([]);
  const [category, setCategory] = useState([]);
  const username = window.localStorage.getItem("username");
  // async function getProducts() {
  //   let response = await axios.get("https://vetcarebackend.herokuapp.com/getuserproducts");
  //   if (response.status === 200) {
  //     setProducts(response.data.products);
  //   }
  // }
  async function getCategory() {
    let response = await axios.get(
      "https://vetcarebackend.herokuapp.com/getcategory"
    );
    if (response.status === 200) {
      setCategory(response.data.categories);
    }
  }
  async function sortbycategory(cat) {
    let catName = cat;
    const data = {
      catName: catName,
    };
    let response = await axios.post(
      "https://vetcarebackend.herokuapp.com/sortcategory",
      data
    );
    if (response.status === 200) {
      setProducts(response.data.products);
    }
  }
  async function getProducts() {
    const data = {
      search: search,
    };
    if (search.length != 0) {
      let response = await axios.post(
        "https://vetcarebackend.herokuapp.com/searchproducts",
        data
      );
      if (response.status === 200) {
        setProducts(response.data.products);
      }
    } else {
      let response = await axios.get(
        "https://vetcarebackend.herokuapp.com/getuserproducts"
      );
      if (response.status === 200) {
        setProducts(response.data.products);
      }
    }
  }

  useEffect(() => {
    getProducts();
    getCategory();
    if (username == null) {
      history.push("/login");
    }
  }, []);
  return (
    <div>
      <div class="topnav">
        <a href="/userhome">Home</a>
        <a href="/myorders">My Orders</a>
        <input
          type="text"
          placeholder="Search.."
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="button"
          onClick={() => {
            getProducts();
          }}
        >
          <i className="fa fa-search"></i>
        </button>

        <a href="/cart" className="cart">
          <i className="fa fa-opencart"></i>
        </a>
      </div>

      <h1 className="text-center mt-3">
        All Items
        <div class="dropdown">
          <button class="dropbtn">Sort By Category</button>

          <div class="dropdown-content">
            <a
              onClick={() => {
                getProducts();
              }}
            >
              All Items
            </a>
            {category &&
              category.length > 0 &&
              category.map((p) => {
                return (
                  <a
                    onClick={() => {
                      sortbycategory(p.catName);
                    }}
                  >
                    {p.catName}
                  </a>
                );
              })}
          </div>
        </div>
      </h1>

      <section className="cardss">
        {products &&
          products.length > 0 &&
          products.map((a) => {
            if (a.status == "instock") {
              return (
                <Itemcard
                  // img={a.img}
                  title={a.productName}
                  desc={a.productDescription}
                  price={a.productPrice}
                  item={a._id}
                  quantity={a.productQuantity}
                />
              );
            }
          })}
      </section>
    </div>
  );
};

export default Home;
