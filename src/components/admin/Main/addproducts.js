import React, { useEffect, useState } from "react";

import { Table } from "react-bootstrap";
import { Link, Route, useLocation } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

const axios = require("axios");
const token = window.localStorage.getItem("token");

const tokenVal = window.localStorage.getItem("token");

function ManageProducts() {
  const [productdetails, setProductDetails] = useState([]);
  const [category, setCategory] = useState([]);

  const [show, setShow] = useState(false);
  const [newshow, setNewShow] = useState(false);

  const [catname, setCatName] = useState(null);
  const [ctname, setCtName] = useState(null);
  const [name, setName] = useState(null);
  const [price, setPrice] = useState(null);
  const [desc, setDesc] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [imagelink, setImageLink] = useState(null);

  const handleClose = () => setShow(false);
  const handleNewClose = () => setNewShow(false);
  const handleShow = () => setShow(true);
  const handleNewShow = () => setNewShow(true);

  const [file, setfile] = useState();
  const [filename, setFileName] = useState("");
  const handleAddCategory = async () => {
    const name = {
      catname: catname,
    };
    console.log(name);
    try {
      const response = await axios.post(
        "https://vetcarebackend.herokuapp.com/addcategory",
        name
      );
      if (response.status === 200) {
        alert("Success");
        handleNewClose();
      } else {
        alert("Failed!! Category Already Exists");
      }
    } catch (e) {
      console.log("Error");
    }
  };
  async function getCategory() {
    let response = await axios.get(
      "https://vetcarebackend.herokuapp.com/getcategory"
    );
    if (response.status === 200) {
      setCategory(response.data.categories);
    }
  }
  async function getProducts() {
    let response = await axios.get(
      "https://vetcarebackend.herokuapp.com/getproducts"
    );
    if (response.status === 200) {
      setProductDetails(response.data.products);
    }
  }
  const handleCreateProduct = async (e) => {
    const data = {
      name: name,
      ctname: ctname,
      price: price,
      desc: desc,
      quantity: quantity,
    };

    const response = await axios.post(
      "https://vetcarebackend.herokuapp.com/addproduct",
      data
    );
    if (response.status === 200) {
      console.log("Sucessfull");
      handleClose();
      handleNewClose();
      getProducts();
    } else {
      console.log("Failed");
    }
  };
  // handleClose();
  // handleNewClose();
  // getProducts();

  async function deleteProduct(id) {
    const data = {
      productId: id,
    };
    try {
      const response = await axios.post(
        "https://vetcarebackend.herokuapp.com/removeproducts",
        data
      );
      if (response.status === 200) {
        alert("Item Removed");
      } else {
        console.log("Failed");
      }
    } catch (e) {
      console.log("Error");
    }
  }

  useEffect(() => {
    getProducts();
    getCategory();
  }, []);

  const data = {};
  return (
    <div>
      <div>
        <Link to="/dashboard">
          <button
            className="btn btn-warning"
            type="button"
            style={{
              marginTop: "2rem",
              marginLeft: "2rem",
              marginRight: "5rem",
            }}
          >
            <span
              className="spinner-grow spinner-grow-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Back To Main Menu
          </button>
        </Link>
        <div
          className="modal fade"
          id="editHospitalModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        ></div>
        <div
          className="main__container"
          style={{
            marginLeft: "10rem",
            margintop: "2.5rem",
            marginRight: "10rem",
          }}
        >
          <Button
            variant="primary"
            onClick={handleShow}
            style={{ width: "10rem", margin: "1rem" }}
          >
            Add Product
          </Button>
          <Button
            variant="primary"
            onClick={handleNewShow}
            style={{ width: "10rem", margin: "1rem", marginLeft: "48rem" }}
          >
            Add Category
          </Button>
          {/* add Category */}
          <Modal show={newshow} onHide={handleNewClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <Form.Control
                  type="text"
                  placeholder="Product Category"
                  onChange={(e) => setCatName(e.target.value)}
                />
                <br />
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleAddCategory}>
                Add Category
              </Button>
            </Modal.Footer>
          </Modal>

          {/* ADD PRODUCT  */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Select
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => setCtName(e.target.value)}
                required
              >
                <option defaultChecked>Select Category</option>
                {category &&
                  category.length > 0 &&
                  category.map((p) => {
                    return <option value={p.catName}>{p.catName}</option>;
                  })}
              </Form.Select>
              <br />
              <Form.Control
                type="text"
                placeholder="Product Name"
                onChange={(e) => setName(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="number"
                placeholder=" Product Price"
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="text"
                placeholder="Description"
                onChange={(e) => setDesc(e.target.value)}
                required
              />
              <br />
              <Form.Control
                type="number"
                placeholder="Quantity"
                min="1"
                max="20"
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
              <br />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleCreateProduct}>
                Add Product
              </Button>
            </Modal.Footer>
          </Modal>

          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Category</th>
                <th>Price</th>
                <th>Description</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {productdetails &&
                productdetails.length > 0 &&
                productdetails.map((p) => {
                  if (p.status == "instock") {
                    return (
                      <tr>
                        <td>{p.productName}</td>
                        <td>{p.productCategory}</td>
                        <td>{p.productPrice}</td>
                        <td>{p.productDescription}</td>
                        <td>{p.productQuantity}</td>
                        <td colSpan="2">
                          <button
                            className="btn btn-success"
                            data-toggle="modal"
                            data-target="#exampleModal"
                          >
                            Edit <i className="fa fa-edit"></i>
                          </button>

                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              deleteProduct(p._id);
                            }}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  }
                })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
export default ManageProducts;
