import { useEffect, useState, useRef, useMemo, useCallback } from "react"
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2'

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import reportHead from '../assets/reportHead.png'
// import reportBottm from '../assets/reportBottm.png'

const CustomerOrders = () => {

    const fetchAddress = "http://localhost:7777"
    
    const [showNewOrderForm, setShowNewOrderForm] = useState(false)
    const [data, setData] = useState([])
    const [wait, setWait] = useState(1)

    const toggleNewOrderForm = () => {
        console.log(showNewOrderForm)
        setShowNewOrderForm(!showNewOrderForm)
    }

    const getItems = useMemo(() => {
    
        fetch(fetchAddress+"/customerOrders")
        .then(res => res.json())
        .then(data => {
            data = data.sort((a, b) => {
                const dateA = new Date(a.orderdate);
                const dateB = new Date(b.orderdate);
                return dateA - dateB; // For ascending order, use dateB - dateA for descending order
              });

              data = data.sort((a, b) => {
                const dateA = new Date(a.orderdate);
                const dateB = new Date(b.orderdate);
                return dateA - dateB; // For ascending order, use dateB - dateA for descending order
              });
      
              setData(data);
              console.log("Data Updated")
              setData(data.reverse());
        })
        .catch(err => console.log(err))
    console.log("Hello")

    }, [wait])

    const NewOrderForm = () => {

        const [products, setProducts] = useState([])
        const [item, setItem] = useState("Select Product")


        const [employees, setEmployees] = useState([])
        const [employee, setEmployee] = useState("Select Employee")
   
        const quantityRef = useRef(null)
        const dateRef = useRef(null)
        const deadlineRef = useRef(null)
        const [fist, setFist] = useState(true)

        const [quantity, setQuantity] = useState("")
        const [date, setDate] = useState("")
        const [deadline, setDeadline] = useState("")
        const [email, setEmail] = useState("")



        const getItems = useMemo(() => {
            fetch(fetchAddress+"/products")
                .then(res => res.json())
                .then(data => {
                    // console.log(data)
                    setProducts(data)
                })
                .catch(err => console.log(err))

            fetch(fetchAddress+"/employee")
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setEmployees(data.data)
                })
                .catch(err => console.log(err))

        }, [])

        

        useEffect(() => {
            
            const interval = setInterval(() => {
                getItems()
                console.log("Updated")
            }, 100000);

            return () => clearInterval(interval);

        }, [])

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
            if (item === "Select Product") {
                alert("Please select a product");
                return;
            }
            if (employee === "Select Employee") {
                alert("Please select an employee");
                return;
            }
            if (quantity === "") {
                alert("Please enter a quantity");
                return;
            }
            if (date === "") {
                alert("Please enter a date");
                return;
            }
            if (deadline === "") {
                alert("Please enter a deadline");
                return;
            }

            


        
            const data = {
                ProductName: item,
                Quantity: quantity,
                EmployeeName: employee,
                Date: date,
                Deadline: deadline,
                CustomerEmail: email
            };
            console.log(data)
            fetch(fetchAddress + "/newCustomerOrder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.code == 1){
                    alert("Order Created Successfully")
                }
                else{
                    alert("Order Creation Failed")
                }
                setShowNewOrderForm(false)
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
                                                console.log()
                                                return <MenuItem value={e.productName}>{e.productName}</MenuItem>
                                            })

                                        }

                                    </Select>
                            </FormControl>
                        </div>

                        <div className="input quantity">
                            <h3 className="name">Quantity</h3>
                            <TextField ref={quantityRef} id="outlined-basic" onChange={(e) => {setQuantity(e.target.value)} } size="small" label="Quantity" variant="outlined" type="number" />
                        </div>

                        <div className="orderdate input">
                            <h3 className="name">Order Date</h3>
                            <TextField ref={dateRef} id="outlined-basic" onChange={(e) => {setDate(e.target.value)}} size="small" variant="outlined" type="date" />

                        </div>

                        <div className="deadline input">
                            <h3 className="name">Deadline</h3>
                            <TextField ref={deadlineRef} id="outlined-basic" size="small" onChange={(e) => {setDeadline(e.target.value)}}  variant="outlined" type="date" />
                        </div>

                        <div className="deadline input">
                            <h3 className="name">Customer E-Mail</h3>
                            <TextField id="outlined-basic" size="small" onChange={(e) => {setEmail(e.target.value)}}  variant="outlined"/>
                        </div>




                        <div className="assign input">
                        <h3 className="name">Assign Task to</h3>
                            <FormControl size="small" sx={{ m: 1, minWidth: 198 }}>

                                <InputLabel id="demo-simple-select-label">Employee</InputLabel>
                                <Select

                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={employee}
                                    label="Product Names"
                                
                                    onChange={handleChangeEmp}
                                    >
                                        {
                                            employees.map(e => {
                                                
                                                return <MenuItem value={e.userName}>{e.userName}</MenuItem>
                                            })

                                        }

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

    const updateOrder = (id, status) => {

        fetch(fetchAddress+`/updateCustomerOrder/${id}/${status}`)
            .then(res => res.json())
            .then(data => {
                if (data.code == 1){
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Order updated successfully',
                    showConfirmButton: false,
                    timer: 1500
                  })

                  setTimeout(() => {
                    window.location.reload();
                  }, 1500);

                 
                }
            })
    
    }
    const OrdersContainer = () => {
        
        return <>
        
        <div className="ordersContainer" style={showNewOrderForm ? {filter: "blur(5px)"} : {filter: "blur(0px)"}}>

            <div className="headers">
                <h3>Order No</h3>
                <h3>Ord. ID</h3>
                <h3>Customer</h3>
                <h3>Product</h3>
                <h3>Date</h3>
                <h3>Status</h3>
                <h3>Quantity</h3>
                <h3>Actions</h3>
            </div>

            <div className="orderList">
                {
                      data.map(e => {
                        return <>
                            <div className={`dataRow ${e.orderStatus == 1 ? "completed" : e.orderStatus == 2 ? "cancelled" : "pending"}`}>
                                <h3>#</h3>
                                <h3>{e.orderid}</h3>
                                <h3>{e.customerId}</h3>
                                <h3>{e.productname}</h3>
                                <h3>{e.orderdate}</h3>
                                <h3>{e.orderStatus == 1 ? "Completed" : e.orderStatus == 2 ? "Cancelled" : "Pending"}</h3>
                                
                                <h3>{e.quantity}</h3>
                                <div className="actions">
                                    {
                                        e.orderStatus == 0 ? 
                                            <><button onClick={() => {updateOrder(e.orderid, 1)}}> Set as Complete</button></> 
                                        :
                                            <><button onClick={() => {updateOrder(e.orderid, 0)}}> Set as Pending</button></>
                                    }
                                </div>  
                            </div>
                        </>
                    })
                }
            </div>


        </div>
        
        </>
    }

    const generatePDF = () => {
        Swal.fire({

        })
        const input = document.querySelector('.report');
        html2canvas(input)
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG',1, 1);
            pdf.save('download.pdf');
          })
          .catch((err) => {
            console.error('Error generating PDF', err);
          });
    }

    const Report = () => {
        return (
          <div className="report">
            <img src={reportHead} className="reportHead" alt="" />
            <h1>Customer Orders</h1>
            <table>
              <thead>
                <tr>
                  <th>Order No</th>
                  <th>Ord. ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Quantity</th>
                  <th>Total LKR</th>
                </tr>
              </thead>
              <tbody>
                {data.map((e, index) => (
                  <tr key={index} className={e.orderStatus == 1 ? "completed" : e.orderStatus == 2 ? "cancelled" : "pending"}>
                    <td>{index + 1}</td>
                    <td>{e.orderid}</td>
                    <td>{e.customerId}</td>
                    <td>{e.productname}</td>
                    <td>{e.orderdate}</td>
                    <td>{e.orderStatus == 1 ? "Completed" : e.orderStatus == 2 ? "Cancelled" : "Pending"}</td>
                    <td>{e.quantity}</td>
                    <td>{e.total}</td>
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
           
            <OrdersContainer/>

            <NewOrderForm/>

        </>
    )
}

export default CustomerOrders