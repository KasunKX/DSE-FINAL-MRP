import { useState, useEffect, useMemo } from "react";
import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';


import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import reportHead from '../assets/reportHead.png'
// import reportBottm from '../assets/reportBottm.png'

const SupplyOrders = () => {
    const fetchAddress = "http://localhost:7777";

    const [showNewOrderForm, setShowNewOrderForm] = useState(false);
    const [data, setData] = useState([]);

    
    const fetchOrders = useMemo(() => {
        fetch(fetchAddress + "/supplyorderAll")
            .then(res => res.json())
            .then(data => {
                setData(data.data);
            })
            .catch(err => console.log(err));
    }, [])

    const toggleNewOrderForm = () => {
        setShowNewOrderForm(!showNewOrderForm);
    };

    const OrderList = () => {



        return (
            <>
                {data.map(e => (
                    <div key={e.SupplyId} style={showNewOrderForm ? { filter: "blur(5px)" } : { filter: "blur(0px)" }} className="dataRow">
                        <h3>{e.SupplyId}</h3>
                        <h3>{e.OrderId}</h3>
                        <h3>{e.ProductName}</h3>
                        <h3>{e.Quantity}</h3>
                        <h3>{new Date(e.OrderedDate).toLocaleDateString()}</h3>
                        <h3>{new Date(e.Deadline).toLocaleDateString()}</h3>
                        <h3>{e.Total}</h3>
                    </div>
                ))}
            </>
        );
    };

    const NewOrderForm = () => {
        const [products, setProducts] = useState([]);
        const [product, setProduct] = useState("");

        const [orderedDate, setOrderedDate] = useState("");
        const [deadline, setDeadline] = useState("");
        const [quantity, setQuantity] = useState("");
        const [total, setTotal] = useState("");

        const getItems = () => {
            // Fetch products
            fetch(fetchAddress + "/rawItems")
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setProducts(data.data);
                })
                .catch(err => console.log(err));
        };

        useEffect(() => {
            getItems();
        }, []);

        const handleChangeProduct = (event) => {
            setProduct(event.target.value);
        };

        const submitOrder = () => {
            const data = {
                SupplyId: `S${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, // Generate a random SupplyId
                ProductName: product,
                OrderedDate: orderedDate,
                Deadline: deadline,
                Quantity: parseInt(quantity),
                Total: parseFloat(total)
            };

            fetch(fetchAddress + "/supplyorder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.message === 'Supply order inserted successfully') {
                        alert("Order Created Successfully");
                        setShowNewOrderForm(false);
                    } else {
                        alert("Order Creation Failed");
                    }
                })
                .catch(err => console.log(err));
        };

        return (
            <>
                <div className="newOrderFormBack" style={{ display: showNewOrderForm ? "block" : "none" }}>
                    <div className="orderForm">
                        <h2 className="title">Create a New Supply Order</h2>
                        <div className="inputs">
                            <div className="input product">
                                <h3 className="name">Product</h3>
                                <FormControl size="small" sx={{ m: 1, minWidth: 198 }}>
                                    <InputLabel id="product-select-label">Product Name</InputLabel>
                                    <Select
                                        labelId="product-select-label"
                                        id="product-select"
                                        value={product}
                                        label="Product Name"
                                        onChange={handleChangeProduct}
                                    >
                                        {products.map(e => (
                                            <MenuItem key={e.productId} value={e.productName}>{e.productName}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>

                            <div className="input quantity">
                                <h3 className="name">Quantity</h3>
                                <TextField id="outlined-basic" value={quantity} onChange={(e) => setQuantity(e.target.value)} size="small" label="Quantity" variant="outlined" type="number" />
                            </div>

                            <div className="orderdate input">
                                <h3 className="name">Order Date</h3>
                                <TextField id="outlined-basic" value={orderedDate} onChange={(e) => setOrderedDate(e.target.value)} size="small" variant="outlined" type="date" />
                            </div>

                            <div className="deadline input">
                                <h3 className="name">Deadline</h3>
                                <TextField id="outlined-basic" value={deadline} onChange={(e) => setDeadline(e.target.value)} size="small" variant="outlined" type="date" />
                            </div>

                       
                            <div className="buttons">
                                <button className="cancel" onClick={toggleNewOrderForm}>Cancel</button>
                                <button className="submit" onClick={submitOrder}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const generatePDF = () => {
        const input = document.querySelector('.report');
        html2canvas(input)
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG',1, 1);
            pdf.save('supply.pdf');
          })
          .catch((err) => {
            console.error('Error generating PDF', err);
          });
    }

    const Report = () => {
        return (
          <div className="report">
            <img src={reportHead} className="reportHead" alt="" />
            <h1>Supply Orders</h1>
            <table>
              <thead>
                <tr>
                <th>Supply ID</th>
                <th>Order ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Order Date</th>
                <th>Deadline</th>
                <th>Total</th>
                </tr>
              </thead>
              <tbody>
              {data.map(e => (
                <tr key={e.SupplyId} style={showNewOrderForm ? { filter: "blur(5px)" } : { filter: "blur(0px)" }}>
                    <td>{e.SupplyId}</td>
                    <td>{e.OrderId}</td>
                    <td>{e.ProductName}</td>
                    <td>{e.Quantity}</td>
                    <td>{new Date(e.OrderedDate).toLocaleDateString()}</td>
                    <td>{new Date(e.Deadline).toLocaleDateString()}</td>
                    <td>{e.Total}</td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      };

    return (
        <>
        <Report/>
            <div className="topButtons">
                <button className="newOrder" onClick={toggleNewOrderForm}>New Order</button>
                <button className="generateOrder" onClick={generatePDF}>Order Report</button>
            </div>

            <div className="searchFilters">
                {/* <input type="text" name="" className="search" /> */}
            </div>

            <div className="ordersContainer" style={showNewOrderForm ? { filter: "blur(5px)" } : { filter: "blur(0px)" }}>
                <div className="headers">
                    <h3>Supply ID</h3>
                    <h3>Order ID</h3>
                    <h3>Product</h3>
                    <h3>Quantity</h3>
                    <h3>Order Date</h3>
                    <h3>Deadline</h3>
                    <h3>Total</h3>
                </div>

                <div className="orderList">
                    <OrderList />
                </div>
            </div>

            <NewOrderForm />
        </>
    );
};

export default SupplyOrders;
