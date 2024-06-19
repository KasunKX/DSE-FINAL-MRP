const employee = (app, db) => {

    app.get('/employeeNames', (req, res) =>{
        
        const qry = "SELECT firstName, lastName FROM employee"

        db.query(qry, (err, data) => {
            if(err) return res.json(err)
            return res.send(data)
        })

    })
    
    app.get('/employee', (req, res) =>{
        const qry = "SELECT * FROM employee"

        db.query(qry, (err, response) => {
            if(err) return res.send({data: err})
            return res.send({data: response})
        })
    })
    
    app.post("/newEmployee", (req, res) => {
        const { firstName, lastName, userName, email, empRole, secret } = req.body;

        let empid = generateRandomId(6);
        empid = "EMP" + empid;
        
    
        const sql = 'INSERT INTO employee (firstName, lastName, userName, email, empRole, secret, empid) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [firstName, lastName, userName, email, empRole, secret, empid];
    
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ code: 0, message: "Database error" });
            }
    
            res.send({ code: 1, message: "Employee created successfully", employeeId: result.insertId });
        });
    });

    app.post("/updateEmployee", (req, res) => {
        
        const {user, temp, password, passwordRepeat} = req.body

        const query = "SELECT secret FROM employee WHERE userName = ?"
      
        db.query(query, [user], (err, data) => {
            if(err){
                console.log(err) 
                return res.send({code : 0, message: "Database error"})
            }
            else if(data.length === 0) {
                return res.send({code : 0, message: "User does not exist"})
            }
            else if(data[0].secret !== temp) {
                return res.send({code : 0, message: "Incorrect password"})
            }
            else if(password != passwordRepeat) {
                return res.send({code : 0, message: "Passwords do not match"})
            }
            else if (password.length < 8) {
                return res.send({code : 0, message: "Password must be at least 8 characters long"})
            }
            else {
                const query = "UPDATE employee SET pass = ? WHERE userName = ?"
                const values = [password, user]

                db.query(query, values, (err, data) => {
                    if (err){
                        res.send({code : 0, message: "Database error"})
                    }
                    else {
                        res.send({code : 1, message: "Password updated successfully"})
                    }
                })

            
            }
            }) 
            
        })

    app.post("/login", (req, res) => {
        const {user, password} = req.body

        const query = "SELECT * FROM employee WHERE userName = ?"

        const values = [user]

        db.query(query, values, (err, data) => {
            if (err){
                res.send({code: 0, message: "Database error"})
            }
            else if(data.length === 0) {
                res.send({code: 0, message: "User does not exist"})
            }
            else if(data[0].pass !== password) {
                res.send({code: 0, message: "Incorrect password"})
            }
            else {
                res.send({code: 1, message: "Login successful", data: data})
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


module.exports = employee;