const mysql = require('mysql2')

const products = (app, db) => {

    app.post("/newProduct", (req, res) => {

        const {productName, image, description, price} = req.body.productDetails
        const ingrediants = req.body.ingrediants
        const steps = req.body.steps
        const productid = generateRandomId(12)

        // productid varchar(12) primary key,
        // productName varchar(20),
        // ingrediants varchar(100),
        // steps varchar(5000),
        // image varchar(1000),
        // description varchar(10000),
        // price float,
        // addedBy varchar(50)

        let qry =`INSERT INTO products (productid, productName, ingrediants,steps, image, description, price) VALUES ('${productid}', '${productName}', '${ingrediants}', '${steps}', '${image}', '${description}', '${price}')`

        db.query(qry, (err, result) => {
            if (err) {
                console.log(err)
                res.send({ message: "Product Not Added", code: 0, error: err})
            } else {
                res.send({ message: "Product Added", code: 1, error: ''})
            }
        })

    })

    app.get("/recipes", (req,res) => {
        
        let qry = `SELECT image, ingrediants, steps, productName, productid FROM products;`
        
        db.query(qry, (err, result) => {
            if (err){
                console.log(err)
                res.send(err)
            } else {
                res.send(result)
            }
        })

    })

    app.get("/products", (req, res) => {

        let qry = `SELECT * FROM products`

        db.query(qry, (err, response) => {
            if (err) {
                console.log(err)
                res.send(err)
            } else {
                res.send(response)
            }
        })


    })

    app.post("/newRawItem", (req, res) => {
        //     productid varchar(12) primary key,
        // productName varchar(20) UNIQUE,
        // costPerUnit float, 
        // availble int,
        // pending int,
        // image longtext,
        // description longtext

        const {name, price, imageURL, desc, available} = req.body
       
        let id = generateRandomId(12)

        
        let qry = `INSERT INTO rawitems(productid, productName, costPerUnit, availble, description, image, pending) VALUES('${id}', '${name}', ${price}, ${available}, '${desc}', '${imageURL}', 0)`

 

        // let qry = `INSERT INTO rawitems(productid, productName, costPerUnit, available, description, image, pending) VALUES(${id}, ${name}, ${price}, ${available}, ${desc}, ${iamgeURL}, 0)`

        db.query(qry, (err, result) => {
            if (err){
                console.log(err)
                res.send({message: "Failed to add item", code: 0, error: err.message})
            } else {
                res.send({message: "Item Added Successfully", code: 1, error: ''})
            }
        })
    })

    app.get("/rawItems", (req, res) => {
    
        let qry = `SELECT * FROM rawitems`

        db.query(qry, (err, result) => {
            if (err) {
                console.log(err)
                res.send(err)
            } else {
                res.send({message: "Items Fetched", code: 1, error: '', data: result})
            }
        })

    })

    app.post("/manufactureOrder", (req, res) => {
    
        const {product, emp, quantity, date, description, orderid} = req.body

        const qry = "INSERT INTO manufacturingOrder(orderid, productName, empid, quantity, deadline, description) VALUES (?, ?, ?, ?, ?, ?)"

        db.query(qry,  [orderid, product, emp, quantity, date, description], (err, result) => {
            if (err) {
                console.log(err)
                res.send({message: "Order Not Placed", code: 0, error: err.message})
            } else {
                res.send({message: "Order Placed Successfully", code: 1, error: ''})
            }
        })

      


    })

    app.post("/updateProductQuantity", (req, res) => {
        const {productName, quantity} = req.body

        let qry = "UPDATE products SET available =? WHERE productName = ?"

        db.query(qry, [quantity,productName], (err, result) => {
            if (err) {
                console.log(err)
                res.send({message: "Quantity Not Updated", code: 0, error: err.message})
            } else {
                res.send({message: "Quantity Updated", code: 1, error: ''})
            }

        })


    })

    app.post("/updateRawQuantity", (req, res) => {
        const {productName, quantity} = req.body

        let qry = "UPDATE rawitems SET availble =? WHERE productName = ?"

        db.query(qry, [quantity,productName], (err, result) => {
            if (err) {
                console.log(err)
                res.send({message: "Quantity Not Updated", code: 0, error: err.message})
            } else {
                res.send({message: "Quantity Updated", code: 1, error: ''})
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

module.exports = products;