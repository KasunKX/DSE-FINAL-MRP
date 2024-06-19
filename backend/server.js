const express = require('express')
const app = express()
const cors = require('cors')
const mysql = require('mysql2')

const customerOrders = require("./Endpoints/customer_orders")
const products = require("./Endpoints/product")
const employee = require("./Endpoints/employee")
const manufactureOrder = require("./Endpoints/manufactureOrder")
const supply = require("./Endpoints/supply")




app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
  host: '20.197.16.101',
  user: 'analyticsdb',
  password: 'Wknlhna@1',
  database: 'mrp',
})

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err)
  } else {
    console.log('Connected to MySQL database')
  }
})

// Keep the connection alive by periodically pinging the server
setInterval(() => {
  db.ping((err) => {
      if (err) {
          console.error('Error pinging MySQL database:', err);
      } else {
          console.log('Pinged MySQL database successfully');
      }
  });
}, 60000); //

db.on('error', (err) => {
  console.error('Unexpected MySQL error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      
      db.connect((err) => {
          if (err) {
              console.error('Error reconnecting to MySQL database:', err);
          } else {
              console.log('Reconnected to MySQL database');
          }
      });
  } else {
      throw err;
  }
})

customerOrders(app, db)

products(app, db)

employee(app, db)

manufactureOrder(app, db)

supply(app, db)




const port = 7777

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
