import './styles/inventory.css'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
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

            <div className="topButtons">
                <button className="newItem">+</button>
                <button className="report">Material Report</button>
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
                                    let data = {}
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
                                            Swal.showValidationMessage(`
                                            ${e.message}
                                            `);
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
                                    
                                    
                                    return response;
                                } catch (error) {
                                    Swal.showValidationMessage(`
                                    Request failed: ${error}
                                    `);
                                }
                                },
                                allowOutsideClick: () => !Swal.isLoading()
                            }).then((result) => {
                                console.log(result)
                            });


                            }}>
                                <h2>{e.productName}</h2>
                                <img src={e.image} alt="" />

                                <div className="values" >
                                    <div className="quantity dataVal">
                                        <h4>Avaialable</h4>
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

    useEffect(() => {
        fetch(fetchAddress+"/rawItems").then(res => res.json())
        .then(data => {
            setItems(data.data)
            console.log(data)
        })
    }, [])

    return <>
    
        <div className="inventoryContainer">

            <div className="topButtons">
                <button className="newItem">+</button>
                <button className="report">Material Report</button>
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
                                            let data = {}
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
                                                    Swal.showValidationMessage(`
                                                    ${e.message}
                                                    `);
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
                                            
                                            
                                            return response;
                                        } catch (error) {
                                            Swal.showValidationMessage(`
                                            Request failed: ${error}
                                            `);
                                        }
                                        },
                                        allowOutsideClick: () => !Swal.isLoading()
                                    }).then((result) => {
                                        console.log(result)
                                    });
        
                            }}
                            
                            
                            >
                                <h2>{e.productName}</h2>
                                <img src={e.image} alt="" />

                                <div className="values">
                                    <div className="quantity dataVal">
                                        <h4>Avaialable</h4>
                                        <p>{e.availble}</p>
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

    </>
}

export default Inventory