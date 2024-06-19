const manufactureOrder = (app, db) => {

    app.get("/manufactureOrder", (req, res) => {

        const qry = "SELECT * FROM manufactureOrder";

        db.query(qry, (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        })

    })

    app.post('/newManufactureOrder', (req, res) => {
        const { ProductName, AssignedEmp, Quantity, Deadline } = req.body;
      
        const ORDERID = generateRandomId(10);
        
        const OrderDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        console.log(OrderDate);


        const query = 'INSERT INTO manufactureOrder (ORDERID, ProductName, AssignedEmp, Quantity, Deadline, OrderDate, orderStatus) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [ORDERID, ProductName, AssignedEmp, Quantity, Deadline, OrderDate, 0], (err, result) => {
          if (err) {
            console.error('Error inserting new order:', err);
            return res.status(500).json({ error: 'Database error', code : 0 });
          }
          res.status(201).json({ message: 'Order created successfully', code: 1});
        });
      });

      app.get("/updateManufactureOrder/:orderid/:status", (req, res) => {

        const {orderid, status} = req.params
        
        const query = "UPDATE manufactureOrder SET orderStatus = ? WHERE ORDERID = ?";
        
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

module.exports = manufactureOrder;