import { useState, useEffect, useRef, useMemo } from "react";
import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';


import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import './styles/report.css'
import reportHead from '../assets/reportHead.png'
// import reportBottm from '../assets/reportBottm.png'

const EmployeeManagement = () => {
  const fetchAddress = "http://localhost:7777";

  const [showNewEmployeeForm, setShowNewEmployeeForm] = useState(false);
  const [data, setData] = useState([]);
  
  const fetchEmployees = useMemo(() => {
    fetch(fetchAddress + "/employee")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setData(data.data);
      })
      .catch(err => console.log(err));
  }, [])
  

  const toggleNewEmployeeForm = () => {
    setShowNewEmployeeForm(!showNewEmployeeForm);
  };

  const EmployeeList = () => {

   

    return (
      <>
        {data.map(e => (
          <div
            key={e.empid}
            style={showNewEmployeeForm ? { filter: "blur(5px)" } : { filter: "blur(0px)" }}
            className="dataRow"
          >
            <h3>{e.empid}</h3>
            <h3>{e.firstName}</h3>
            <h3>{e.lastName}</h3>
            <h3>{e.userName}</h3>
            <h3>{e.email}</h3>
            <h3>{e.empRole == 0 ? "Manager" : e.empRole == 1 ? "Fabricator" : e.empRole == 2 ? "Team Member" : e.empRole == 3 ? "Supplier" : "Customer Care Agent"}</h3>
          </div>
        ))}
      </>
    );
  };

  const NewEmployeeForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [empRole, setEmpRole] = useState("");
    const [secret, setSecret] = useState("");

    const submitEmployee = () => {
        const data = {
            firstName,
            lastName,
            userName,
            email,
            empRole,
            secret
        };
        
        console.log(data)
        console.log(!empRole == 0)
      
    
        if (!firstName){
            alert("Please enter a first name");
            return
        }
        else if (!lastName){
            alert("Please enter a last name");
            return
        }
        else if (!userName){
            alert("Please enter a username");
            return
        }
        else if (!email){
            alert("Please enter an email");
            return
        }
        else if (!empRole === 0 || !empRole === 1 || !empRole === 2 || !empRole === 3){
            alert("Please select a role");
            return
        }
        else if (!secret){
            alert("Please enter a secret");
            return
        }
    

        // Basic email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address");
            return;
        }
    
    
        fetch(fetchAddress + "/newEmployee", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.code === 1) {
                alert("Employee Created Successfully");
                setShowNewEmployeeForm(false);
            } else {
                alert("Employee Creation Failed");
            }
        })
        .catch(err => console.log(err));
    };
    

    return (
      <>
        <div className="newEmployeeFormBack newOrderFormBack" style={{ display: showNewEmployeeForm ? "block" : "none" }}>
          <div className="employeeForm orderForm">
            <h2 className="title">Create a New Employee</h2>

            <div className="inputs">
              <div className="input">
                <h3 className="name">First Name</h3>
                <TextField
                  id="outlined-basic"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  size="small"
                  label="First Name"
                  variant="outlined"
                />
              </div>

              <div className="input">
                <h3 className="name">Last Name</h3>
                <TextField
                  id="outlined-basic"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  size="small"
                  label="Last Name"
                  variant="outlined"
                />
              </div>

              <div className="input">
                <h3 className="name">Username</h3>
                <TextField
                  id="outlined-basic"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  size="small"
                  label="Username"
                  variant="outlined"
                />
              </div>

              <div className="input">
                <h3 className="name">Email</h3>
                <TextField
                  id="outlined-basic"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="small"
                  label="Email"
                  variant="outlined"
                />
              </div>

              <div className="input">
                <h3 className="name">Role</h3>
                <FormControl size="small" sx={{ m: 1, minWidth: 198 }}>
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    value={empRole}
                    label="Role"
                    onChange={(e) => setEmpRole(e.target.value)}
                  >
                    <MenuItem value={0}>Manager</MenuItem>
                    <MenuItem value={1}>Fabricator</MenuItem>
                    <MenuItem value={2}>Team Member</MenuItem>
                    <MenuItem value={3}>Supplier</MenuItem>
                    <MenuItem value={4}>Customer Care Agent</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="input">
                <h3 className="name">One Time Password</h3>
                <TextField
                  id="outlined-basic"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  size="small"
                  label="Secret"
                  variant="outlined"
                  type="password"
                />
              </div>

              <div className="buttons">
                <button className="cancel" onClick={toggleNewEmployeeForm}>
                  Cancel
                </button>
                <button className="submit" onClick={submitEmployee}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  const generatePDF = () => {
    const input = document.querySelector('.report');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG',1, 1);
        pdf.save('supply.pdf');
      })
      .catch((err) => {
        console.error('Error generating PDF', err);
      });
  }

  const Report = () => {
      return (
        <div className="report">
          <img src={reportHead} className="reportHead" alt="" />
          <h1>Employee Infomations</h1>
          <table>
            <thead>
              <tr>
              <th>Emp ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              </tr>
            </thead>
            <tbody>
            {data.map(e => (
              <tr key={e.SupplyId} style={showNewEmployeeForm ? { filter: "blur(5px)" } : { filter: "blur(0px)" }}>
                   <td>{e.empid}</td>
                  <td>{e.firstName}</td>
                  <td>{e.lastName}</td>
                  <td>{e.userName}</td>
                  <td>{e.email}</td>
                  <td>
                    {e.empRole === 0 ? "Manager" : 
                    e.empRole === 1 ? "Fabricator" : 
                    e.empRole === 2 ? "Team Member" : 
                    e.empRole === 3 ? "Supplier" : 
                    "Customer Care Agent"}
                  </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  };


  return (
    <>
    <Report />
      <div className="topButtons">
        <button className="newEmployee" onClick={toggleNewEmployeeForm}>
          New Employee
        </button>
        <button className="generateEmployeeReport" onClick={generatePDF}>Employee Report</button>
      </div>

      <div className="searchFilters">
        {/* <input type="text" name="" className="search" /> */}
      </div>

      <div className="employeesContainer ordersContainer" style={showNewEmployeeForm ? { filter: "blur(5px)" } : { filter: "blur(0px)" }}>
        <div className="headers">
          <h3>Emp ID</h3>
          <h3>First Name</h3>
          <h3>Last Name</h3>
          <h3>Username</h3>
          <h3>Email</h3>
          <h3>Role</h3>
        </div>

        <div className="employeeList orderList">
          <EmployeeList />
        </div>
      </div>

      <NewEmployeeForm />
    </>
  );
};

export default EmployeeManagement;
