import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';


import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CreateAccount = () => {

    const [user, setUser] = useState()
    const [temp, setTemp] = useState()
    const [newKey, setNew] = useState()
    const [newRepeat, setNewRepeat] = useState()

    const navigate = useNavigate()

    const fetchAddress = "http://localhost:7777"

    const createAcc = () => {

        const data = {
            user : user, 
            temp: temp,
            password: newKey,
            passwordRepeat: newRepeat
        }

        fetch(fetchAddress+"/updateEmployee", {
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
                    title: "Please Login With Your New Account",
                    showConfirmButton: true,
                    timer: 2500
                  }).then((result) => {
                    if (result.isConfirmed) {
                      navigate("/login")
                    }
                  })

            }

            setTimeout(() => {
                navigate("/login")
            }, 2500)
        
        })

    }


    return <>

        <div className="createAccount authCommon">
            <div className="createAccountForm">
                <h2 className="title">Create Your Account with Provided Account Details</h2>

                <div className="userName field">
                    <h3>User Name</h3>
                    <TextField className='inp' id="outlined-basic" onChange={(e) => {setUser(e.target.value)} } size="small" variant="outlined" type="text" />
                </div>

                <div className="tempPass field">
                    <h3>Temporary Password</h3>
                    <TextField className='inp'  id="outlined-basic" onChange={(e) => {setTemp(e.target.value)} } size="small" variant="outlined" type="password" />
                </div>

                <div className="newPass field">
                    <h3>New Password</h3>
                    <TextField className='inp' id="outlined-basic" onChange={(e) => {setNew(e.target.value)} } size="small" variant="outlined" type="password" />
                </div>

                <div className="newPassRepeat field">
                    <h3>Repeat Password</h3>
                    <TextField className='inp' id="outlined-basic" onChange={(e) => {setNewRepeat(e.target.value)} } size="small" variant="outlined" type="password" />
                </div>
                
                <div className="userName field">
                    <h3></h3>
                    <Button variant="contained" color="success" onClick={createAcc}>
                        Create Account
                    </Button>
                </div>

                <div className="toLog">
                    <h3>Already have an account ? </h3>
                    <Button color="secondary" onClick={() => {navigate("/login")}}>Log In</Button>
                </div>

            </div>
        </div>

    </>
}

export default CreateAccount