const supply = (app, db) => {

    
    app.post('/supplyorder', (req, res) => {
        const { ProductName, OrderedDate, Deadline, Quantity } = req.body;
    
        // Fetch costPerUnit from rawitems table
        const query = `SELECT costPerUnit FROM rawitems WHERE productName = ?`;
        db.query(query, [ProductName], (error, results) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            return res.status(500).send({ message: 'Internal Server Error', code: 0 });
        }
    
        if (results.length === 0) {
            return res.status(400).send({ message: 'Product not found', code: 0 });
        }
    
        const costPerUnit = results[0].costPerUnit;
        const total = costPerUnit * Quantity;
    
        const supplyId = `S${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`; // Generate a random SupplyId
        const orderId = generateRandomId(4); // Generate a random OrderId
        const insertQuery = `
            INSERT INTO SupplyOrder (SupplyId, OrderId, ProductName, OrderedDate, Deadline, Quantity, Total)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(insertQuery, [supplyId, orderId, ProductName, OrderedDate, Deadline, Quantity, total], (err, result) => {
            if (err) {
            console.error('Error inserting data:', err.stack);
            return res.status(500).send({ message: 'Internal Server Error', code: 0 });
            }
    
            res.send({ message: 'Supply order inserted successfully', code : 1 });
        });
        });
    });

    app.get('/supplyorderAll', (req, res) => {
        const query = `SELECT * FROM SupplyOrder`;

        db.query(query, (err, resp) => {
            if (err) {
                console.log(err)
                res.send({message: 'Internal Server Error', code: 0})
            } else {
                res.send({message: 'Success', code: 1, data: resp})
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

module.exports = supply