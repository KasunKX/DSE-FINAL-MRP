import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function App() {
  
  const [localStorage, setLocalStorage] = useState([])


    setTimeout(() => {
      useNavigate("/login")
    }, 1000)



  return (
    <>
      Please Wait
    </>
  )
}

export default App
