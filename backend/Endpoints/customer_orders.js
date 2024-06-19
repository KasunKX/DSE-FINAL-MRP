const customerOrders = (app, db) => {

    
    app.get('/customerOrders', (req, res) => {
    
        let qry = `SELECT * FROM customerOrder order by orderid`

        db.query(qry, (err, result) => {
            if (err) {
                console.log(err)
                res.send(err)
            } else {
                res.send(result)
            }
        })

    })

    app.get("/unitPrice/:item", (req, res) => {
        const {item} = req.params

        let qry = `SELECT price FROM products WHERE productName = '${item}'`

        db.query(qry, (err, result) => {
            if (!err){
                res.send({price: result[0]})
            }else{
                res.send(err)
            }
        })
    })

    // Endpoint to create a new customer order
    app.post("/newCustomerOrder", (req, res) => {
        const { ProductName, Quantity, EmployeeName, Date, Deadline, CustomerEmail } = req.body;

        // Validate required fields
        if (!ProductName || !Quantity || !EmployeeName || !Date || !Deadline || !CustomerEmail) {
            return res.status(400).json({ code: 0, message: 'Please provide all required fields.' });
        }

        
            // Insert customer order into database
            const orderid = generateRandomId(10);
            const insertOrderQuery = `INSERT INTO customerOrder ( customerId, empName, productname, quantity, total, orderStatus, orderdate, enddate) 
                                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

           
            const empid = EmployeeName
            let customerId = 0

       
            let qry = `SELECT price FROM products WHERE productName = ?`;
        
            db.query(qry, [ProductName], (err, result) => {
                if (err) {
                    console.error("Error fetching product price:", err);
                    return reject(err);
                }else{
                    const price = result[0].price;
                    const total = price * Quantity;

                    qry = `SELECT * FROM customer WHERE email = ?`;

                    db.query(qry, [CustomerEmail], (err, respone) => {
                        if (err) {
                            console.error("Error fetching customer:", err);
                            res.send({ code: 0, message: "Error fetching customer" })
                        }else{

                            if (respone.length > 0) {
                                customerId = respone[0].customerId;
                            } else {
                                customerId = generateRandomId(10);
                                qry = `INSERT INTO customer (customerId, email) VALUES (?, ?)`;
                              

                            }

                            db.query(qry, [customerId, CustomerEmail], (err, response) => {
                                if (err) {
                                    console.error("Error inserting customer:", err);
                                    res.send({ code: 0, message: "Error inserting customer" })
                                }

                                db.query(insertOrderQuery, [customerId, empid, ProductName, Quantity, total, 0, Date, Deadline], (err, resp) => {
                                    if (err) {
                                        console.error("Error inserting customer order:", err);
                                        res.send({ code: 0, message: err.message })
                                    }
                                    else{
                                        res.send({ code: 1, message: "Customer order created successfully" })
                                    }

                                })

                                
                            });
                            console.log(customerId)
                        }
                    })
                    
                }
               
    
            });

            

           
        

       
        
    });

    app.get("/updateCustomerOrder/:orderid/:status", (req, res) => {

        const {orderid, status} = req.params
        
        const query = "UPDATE customerOrder SET orderStatus = ? WHERE orderid = ?";
        
        db.query(query, [status, orderid], (err, result) => {
            if (err) {
                console.error("Error updating customer order status:", err);
                res.send({ code: 0, message: "Error updating customer order status" })
            } else {
                res.send({ code: 1, message: "Customer order status updated successfully" })
            }

        })

    })




}



function generateRandomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  


module.exports = customerOrders;

  



module.exports = customerOrders;