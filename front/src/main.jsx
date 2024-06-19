import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Manager from './Manager/manager.jsx'
import Fabricator from './Fabricator/fabricator.jsx'
import Member from './Member/member.jsx'
import Supplier from './Supplier/supplier.jsx'
import Login from './Auth/login.jsx'
import CreateAccount from './Auth/signup.jsx'

import './main.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <Router> 
    <Routes >
      <Route path='/' element={<Login />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<CreateAccount />} />
      
      <Route path='/manager' element={<Manager/>}/>
      <Route path='/fabricator' element={<Fabricator/>} />
      <Route path='/member' element={<Member/>} />
      <Route path='/supplier' element={<Supplier/>} />

    </Routes>
  </Router>

)
