import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Swal from 'sweetalert2'

import { useNavigate } from 'react-router-dom';

import './styles/styles.css'

const Login = () => {
    const [user, setUser] = useState()
    const [password, setPass] = useState()

    const navigate = useNavigate()

    const fetchAddress = "http://localhost:7777"

    const createAcc = () => {

        const data = {
            user : user, 
    
            password: password,

        }

        console.log(data)

        fetch(fetchAddress+"/login", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            
            if (data.code == 1){
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Login Successful",
                    showConfirmButton: false,
                    timer: 1500
                  });

                  const role = data.data[0].empRole
                  console.log(role)

                  

                  setTimeout(function(){
                    switch (role){
                        case 0:
                            navigate("/manager", {state : {data : data.data[0]}})
                            break;
                        case 1:
                            navigate("/fabricator", {state : {data : data.data[0]}})
                            break;
                        case 2:
                            navigate("/member", {state : {data : data.data[0]}})
                            break;
                        case 3:
                            navigate("/supplier", {state : {data : data.data[0]}})
                            break;
                        case 4:
                            navigate("/customerCare", {state : {data : data.data[0]}})
                            break;
                        default:
                            break;
                      }
                  }, 2500)
            }else{
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: data.message,
                    showConfirmButton: true,
                   
                  });
            }
        })

    }

    return <>

        <div className="login authCommon">
            <div className="createAccountForm">
                <h2 className="title">Welcome Back ! </h2>

                <div className="userName field">
                    <h3>User Name</h3>
                    <TextField id="outlined-basic" onChange={(e) => {setUser(e.target.value)} } size="small" variant="outlined" type="text" />
                </div>

                <div className="tempPass field">
                    <h3>Password</h3>
                    <TextField  id="outlined-basic" onChange={(e) => {setPass(e.target.value)} } size="small" variant="outlined" type="password" />
                </div>
     
                <div className="submit field">
                   
                    <Button variant="contained" color="success" onClick={createAcc}>
                        Log In
                    </Button>
                </div>

                <div className="toLog">
                    <h3>New Employee? . Finalze you account setup</h3>
                    <Button color="secondary" onClick={() => {navigate("/register")}}>Log In</Button>
                </div>

            </div>
        </div>

    </>
}

export default Login 