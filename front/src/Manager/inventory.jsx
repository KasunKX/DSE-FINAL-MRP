import './styles/inventory.css'
import Swal from 'sweetalert2'
import { useEffect, useState, useRef } from "react"
import TextField from '@mui/material/TextField';

const fetchAddress = "http://localhost:7777"

const Inventory = () => {

    const [Inventory, setInventory] = useState(<RawInventory/>)

    return <>
        <div className="inventNav">
            <button className="raw" onClick={() => setInventory(<RawInventory/>)}>Raw Materials</button>
            <button className="products" onClick={() => setInventory(<Products/>)}>Products</button>
        </div>
        <div className="inventoryView">
            {Inventory}
        </div>
    </>
}

const Products = () => {

    const [items, setItems] = useState([])

    useEffect(() => {
        fetch(fetchAddress+"/products").then(res => res.json())
        .then(data => {
            setItems(data)
            console.log(data)
        })
    }, [])

    return <>
        <div className="inventoryContainer products">
        <button className="report">Material Report</button>
            <div className="topButtons">
                <button className="newItem">+</button>
                
            </div>
            <div className="itemContainer">
                {
                    items.map((e) => {
                        console.log(e.available)
                        return <>
                            <div className="item" onClick={() =>{
                                Swal.fire({
                                    title: `Update Quantity of ${e.productName}`,
                                    input: "text",
                                    inputAttributes: {
                                        autocapitalize: "off"
                                    },
                                    showCancelButton: true,
                                    confirmButtonText: "Update",
                                    showLoaderOnConfirm: true,
                                    preConfirm: async (login) => {
                                        try {
                                            const url = "http://localhost:7777/updateProductQuantity"
                                            const response = await fetch(url, {
                                                method: "POST",
                                                body: JSON.stringify({
                                                    productName: e.productName,
                                                    quantity: login
                                                }),
                                                headers: {
                                                    "Content-Type": "application/json"
                                                }
                                            }).then(res => res.json())
                                            .then(e => {
                                                console.log(e)
                                                if (e.code == 0){
                                                    Swal.showValidationMessage(`${e.message}`);
                                                    return
                                                }else if (e.code == 1){
                                                    Swal.close()
                                                    Swal.fire({
                                                        icon: 'success',
                                                        title: 'Updated Successfully',
                                                        showConfirmButton: false,
                                                        timer: 2500
                                                    })
                                                }
                                                return e.json()
                                            })
                                            console.log(response)
                                            return response
                                        } catch (error) {
                                            Swal.showValidationMessage(`Request failed: ${error}`);
                                        }
                                    },
                                    allowOutsideClick: () => !Swal.isLoading()
                                }).then((result) => {
                                    console.log(result)
                                });
                            }}>
                                <h2>{e.productName}</h2>
                                <img src={e.image} alt="" />
                                <div className="values">
                                    <div className="quantity dataVal">
                                        <h4>Available</h4>
                                        <p>{e.available == null ? "0" : e.available}</p>
                                    </div>
                                    <div className="cost dataVal"> 
                                        <h4>Price</h4>
                                        <p>{e.price} LKR</p>
                                    </div>
                                    <div className="pending dataVal">
                                        <h4>Pending Orders</h4>
                                        <p>..</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    })
                }
            </div>
        </div>
    </>
}

const RawInventory = () => {

    const [items, setItems] = useState([])
    const [showNewOrderForm, setShowNewOrderForm] = useState(false)

    const NewOrderForm = () => {
        const [name, setName] = useState("")
        const [price, setPrice] = useState("")
        const [imageURL, setImageURL] = useState("")
        const [desc, setDesc] = useState("")
        const [available, setAvailable] = useState("")

        const quantityRef = useRef(null)
        const dateRef = useRef(null)
        const deadlineRef = useRef(null)

        const submitOrder = () => {
            const data = {
                name: name,
                price: price,
                imageURL: imageURL,
                desc: desc,
                available: available
            };
            console.log(data)
            fetch(fetchAddress + "/newRawItem", {
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
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: data.message
                    });
                    setShowNewOrderForm(false)
                } else {
                    Swal.fire({
                        icon: "error",
                        title: e.message,
                        text: data.message
                    })
                }
            })
            .catch(err => console.log(err));
        };

        return <>
            <div className="newOrderFormBack" style={{display: showNewOrderForm ? "block" : "none"}}>
                <div className="orderForm">
                    <h2 className="title">Add new Raw Item</h2>
                    <div className="inputs">
                        <div className="input product">
                            <h3 className="name">Product Name</h3>
                            <TextField ref={quantityRef} id="outlined-basic" value={name} onChange={(e) => setName(e.target.value)} size="small" label="Name of Product" variant="outlined" type="text" />
                        </div>
                        <div className="input quantity">
                            <h3 className="name">Price Per Unit</h3>
                            <TextField ref={quantityRef} id="outlined-basic" value={price} onChange={(e) => setPrice(e.target.value)} size="small" label="Price Per Unit" variant="outlined" type="number" />
                        </div>
                        <div className="orderdate input">
                            <h3 className="name">imageUrl</h3>
                            <TextField ref={dateRef} id="outlined-basic" value={imageURL} onChange={(e) => setImageURL(e.target.value)} size="small" label="imageUrl" variant="outlined" type="text" />
                        </div>
                        <div className="orderdate input">
                            <h3 className="name">Available Quantity</h3>
                            <TextField ref={dateRef} id="outlined-basic" value={available} onChange={(e) => setAvailable(e.target.value)} size="small" label="Available Quantity" variant="outlined" type="text" />
                        </div>
                        <div className="assign input">
                            <h3 className="name">Description</h3>
                            <TextField ref={deadlineRef} id="outlined-basic" value={desc} onChange={(e) => setDesc(e.target.value)} size="small" label="Description" variant="outlined" type="text" />
                        </div>
                        <div className="buttons">
                            <button className="cancel" onClick={() => {setShowNewOrderForm(false)}}>Cancel</button>
                            <button className="submit" onClick={submitOrder}>Submit</button>
                        </div>
                    </div>    
                </div>
            </div>
        </>
    }

    useEffect(() => {
        fetch(fetchAddress+"/rawItems").then(res => res.json())
        .then(data => {
            setItems(data.data)
            console.log(data)
        })
    }, [])

    const generatePDF = () => {
        const input = document.querySelector('.report');
        html2canvas(input)
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 1, 1);
            pdf.save('download.pdf');
          })
          .catch((err) => {
            console.error('Error generating PDF', err);
          });
    }

    const Report = () => {
        return (
            <div className="report">
                <h1>Raw Materials</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Available</th>
                            <th>Cost Per Unit</th>
                            <th>Pending Supply</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((e, index) => (
                            <tr key={index}>
                                <td>{e.productName}</td>
                                <td>{e.available}</td>
                                <td>{e.costPerUnit} LKR</td>
                                <td>{e.pending}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return <>
        <Report />
        <div className="inventoryContainer">
            <div className="topButtons">
               
                <button className="newItem" onClick={() => {setShowNewOrderForm(true)}}>+</button>
                <button className="report" onClick={() => {generatePDF()}}>Material Report</button>
            </div>
            <div className="itemContainer">
                {
                    items.map((e) => {
                        console.log(e)
                        return <>
                            <div className="item" onClick={() => {
                                Swal.fire({
                                    title: `Update Quantity of ${e.productName}`,
                                    input: "text",
                                    inputAttributes: {
                                        autocapitalize: "off"
                                    },
                                    showCancelButton: true,
                                    confirmButtonText: "Update",
                                    showLoaderOnConfirm: true,
                                    preConfirm: async (value) => {
                                        try {
                                            const url = "http://localhost:7777/updateRawQuantity"
                                            const response = await fetch(url, {
                                                method: "POST",
                                                body: JSON.stringify({
                                                    productName: e.productName,
                                                    quantity: value
                                                }),
                                                headers: {
                                                    "Content-Type": "application/json"
                                                }
                                            }).then(res => res.json())
                                            .then(e => {
                                                console.log(e)
                                                if (e.code == 0){
                                                    Swal.showValidationMessage(`${e.message}`);
                                                    return
                                                }else if (e.code == 1){
                                                    Swal.close()
                                                    Swal.fire({
                                                        icon: 'success',
                                                        title: 'Updated Successfully',
                                                        showConfirmButton: false,
                                                        timer: 2500
                                                    })
                                                    setTimeout(() => {
                                                        window.location.reload()
                                                    }, 2500)
                                                    return
                                                }
                                                return e.json()
                                            })
                                            console.log(response)
                                            return response
                                        } catch (error) {
                                            Swal.showValidationMessage(`Request failed: ${error}`);
                                        }
                                    },
                                    allowOutsideClick: () => !Swal.isLoading()
                                }).then((result) => {
                                    console.log(result)
                                });
                            }}>
                                <h2>{e.productName}</h2>
                                <img src={e.image} alt="" />
                                <div className="values">
                                    <div className="quantity dataVal">
                                        <h4>Available</h4>
                                        <p>{e.available}</p>
                                    </div>
                                    <div className="cost dataVal"> 
                                        <h4>Cost Per Unit</h4>
                                        <p>{e.costPerUnit} LKR</p>
                                    </div>
                                    <div className="pending dataVal">
                                        <h4>Pending Supply</h4>
                                        <p>{e.pending}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    })
                }
            </div>
        </div>
        <NewOrderForm/>
    </>
}

export default Inventory
