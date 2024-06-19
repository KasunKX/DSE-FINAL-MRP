import { useState, useEffect, useRef, useMemo } from "react"
import React from 'react'
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import reportHead from '../assets/reportHead.png'
// import reportBottm from '../assets/reportBottm.png'

const ManufactureOrders = () => {

    // const [fetchAddress, setFetchAddress] = useState("http://localhost:7777")
    const fetchAddress= "http://localhost:7777"

    const [showNewOrderForm, setShowNewOrderForm] = useState(false)
    const [data, setData] = useState([])
    const [fis, setFis] = useState([])
    const [products, setProducts] = useState([])

    const toggleNewOrderForm = () => {
        console.log(showNewOrderForm)
        setShowNewOrderForm(!showNewOrderForm)
    }
    const fetchOrders = useMemo(() => {

        fetch(fetchAddress+"/manufactureOrder")
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setData(data)
            })
            .catch(err => console.log(err))
        console.log("Hello")
        
       
    }, [fis])

    const OrderList = () => {
       

        // useEffect(() => {
        //     fetchOrders()
        // }, [])

        

        return <>
        {
            data.map(e => {
                console.log(e)
                return <>
                    <div style={showNewOrderForm ? {filter: "blur(5px)"} : {filter: "blur(0px)"}} className={`dataRow ${e.orderStatus == 1 ? "completed" : e.orderStatus == 2 ? "cancelled" : "pending"}`}>
                        <h3>#</h3>
                        <h3>{e.ORDERID}</h3>
                        <h3>{e.ProductName}</h3>
                        <h3>{e.Quantity}</h3>
                        <h3>{e.OrderDate}</h3>
                        <h3>{e.Deadline}</h3>
                        <h3>{e.orderStatus == 1 ? "Completed" : e.orderStatus == 2 ? "Cancelled" : "Pending"}</h3>
                        <h3>{e.AssignedEmp}</h3>
                    
                    </div>
                </>
            })
        }

    </>
    }
    const getitems = useMemo(() => {
        console.log("Hello")

        // Products
        fetch(fetchAddress+"/products")
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setProducts(data)
            })
            .catch(err => console.log(err))

        // Employees
        fetch(fetchAddress+"/employees")
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setEmployees(data)
            })
            .catch(err => console.log(err))

    }, [fis])


    const NewOrderForm = () => {

        
        const [item, setItem] = useState("Select Product")


        const [employees, setEmployees] = useState([])
        const [employee, setEmployee] = useState("Select Employee")

        const [status, setStatus] = useState("Pending")
        const [date, setDate] = useState("")
        const [deadline, setDeadline] = useState("")
        const [quantity, setQuantity] = useState("")
        const [total, setTotal] = useState("")

   
        const quantityRef = useRef(null)
        const dateRef = useRef(null)
        const deadlineRef = useRef(null)

       
        // useEffect(() => {
        //     getitems()
        // }, [])

        // useEffect(() => {
        //     console.log(products)
        // }, [products])

        const handleChange = (event) => {
            setItem(event.target.value);
        };

        const handleChangeEmp = (event) => {
            setEmployee(event.target.value);
        };

        const submitOrder = () => {
            // if (item === "Select Product" || employee === "Select Employee" || !quantityRef.current.value || !dateRef.current.value || !deadlineRef.current.value) {
            //     alert("Please fill out all fields");
            //     return;
            // }
        
            const data = {
                ProductName: item,
                Quantity: quantity,
                AssignedEmp: employee,
                OrderDate: date,
                Deadline: deadline,
                Status: status,
            };
            console.log(dateRef.current.value)
            console.log(data)
        
            fetch(fetchAddress + "/newManufactureOrder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.code == 1) {
                    alert("Order Created Successfully");
                    setShowNewOrderForm(false)
                } else {
                    alert("Order Creation Failed");
                }
            })
            .catch(err => console.log(err));
        };
        

        return <>
        
            <div className="newOrderFormBack" style={{display: showNewOrderForm ? "block" : "none"}}>
                
                <div className="orderForm">
                    <h2 className="title">Create a New Manufaturing Task</h2>

                    <div className="inputs">
                    
                        <div className="input product">
                            <h3 className="name">Product</h3>
                            <FormControl size="small" sx={{ m: 1, minWidth: 198 }}>

                                <InputLabel id="demo-simple-select-label">Product Name</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={item}
                                    label="Product Names"

                                    onChange={handleChange}
                                    >
                                        {
                                            products.map(e => {
                                        
                                                return <MenuItem value={e.productName}>{e.productName}</MenuItem>
                                            })

                                        }

                                    </Select>
                            </FormControl>
                        </div>

                        <div className="input quantity">
                            <h3 className="name">Quantity</h3>
                            <TextField ref={quantityRef} id="outlined-basic" value={quantity} onChange={(e) => setQuantity(e.target.value)} size="small" label="Quantity" variant="outlined" type="number" />
                        </div>

                        <div className="orderdate input">
                            <h3 className="name">Order Date</h3>
                            <TextField ref={dateRef} id="outlined-basic" value={date} onChange={(e) => setDate(e.target.value)} size="small" variant="outlined" type="date" />

                        </div>

                        <div className="deadline input">
                            <h3 className="name">Deadline</h3>
                            <TextField ref={deadlineRef} id="outlined-basic" value={deadline} onChange={(e) => setDeadline(e.target.value)} size="small"  variant="outlined" type="date" />
                        </div>

                        <div className="assign input">
                        <h3 className="name">Assign Task to</h3>
                            <FormControl size="small" sx={{ m: 1, minWidth: 198 }}>

                                <InputLabel id="demo-simple-select-label-employee">Employee</InputLabel>
                                <Select

                                    labelId="demo-simple-select-label-employee"
                                    id="demo-simple-select-employee"
                                    value={employee}
                                    label="Product Names"
                                
                                    onChange={handleChangeEmp}
                                    >
                                        <MenuItem value={"Any"}>Any</MenuItem>
                                        {
                                            employees.map(e => {
                                        
                                                return <MenuItem value={e.userName}>{e.userName}</MenuItem>
                                            })

                                        }

                                    </Select>
                            </FormControl>
                        </div>

                        <div className="status input">

                            <h3 className="name">Status</h3>
                            <FormControl size="small" sx={{ m: 1, minWidth: 198 }}>
                            
                            <InputLabel id="demo-simple-select-label">Order Stauts</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={status}
                                    label="Product Names"

                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                    }}
                                    >
           
                                     <MenuItem value="Pending">Pending</MenuItem>
                                     <MenuItem value="Completed">Completed</MenuItem>
                                     <MenuItem value="Cancelled">Cancelled</MenuItem>

                                    </Select>

                            </FormControl>
                        </div>

                        <div className="buttons">
                            <button className="cancel" onClick={toggleNewOrderForm}>Cancel</button>
                            <button className="submit" onClick={submitOrder}>Submit</button>
                        </div>


                    </div>    
                </div>


            </div>

        </>
    }

    const generatePDF = () => {
        const input = document.querySelector('.report');
        html2canvas(input)
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG',1, 1);
            pdf.save('manufacture.pdf');
          })
          .catch((err) => {
            console.error('Error generating PDF', err);
          });
    }

    const Report = () => {
        return (
          <div className="report">
            <img src={reportHead} className="reportHead" alt="" />
            <h1>Manufacture Orders</h1>
            <table>
              <thead>
                <tr>
                    <th>Order No</th>
                    <th>Ord. ID</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Date</th>
                    <th>Task Deadline</th>
                    <th>Order Status</th>
                    <th>Assigned Employee</th>
                </tr>
              </thead>
              <tbody>
                {data.map((e, index) => (
                  <tr key={index} className={e.orderStatus == 1 ? "completed" : e.orderStatus == 2 ? "cancelled" : "pending"}>
                    <td>{index + 1}</td>
                    <th>{e.ORDERID}</th>
                    <th>{e.ProductName}</th>
                    <th>{e.Quantity}</th>
                    <th>{e.OrderDate}</th>
                    <th>{e.Deadline}</th>
                    <th>{e.orderStatus == 1 ? "Completed" : e.orderStatus == 2 ? "Cancelled" : "Pending"}</th>
                    <th>{e.AssignedEmp}</th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      };

    return <>
        
            <Report/>

            <div className="topButtons">
                <button className="newOrder" onClick={toggleNewOrderForm}>New Order</button>
                <button className="generateOrder" onClick={generatePDF}>Order Report</button>
            </div>

            <div className="searchFilters">
                {/* <input type="text" name="" className="search" /> */}
                
            </div>

            <div className="ordersContainer" style={showNewOrderForm ? {filter: "blur(5px)"} : {filter: "blur(0px)"}}>

                <div className="headers">
                    <h3>Order No</h3>
                    <h3>Ord. ID</h3>
                    <h3>Product</h3>
                    <h3>Quantity</h3>
                    <h3>Date</h3>
                    <h3>Task Deadline</h3>
                    <h3>Quantity</h3>
                    <h3>Assigned Employee</h3>
                </div>

                <div className="orderList">
                    <OrderList/>
                </div>


            </div>

            <NewOrderForm/>


        </>
    
}

export default ManufactureOrders