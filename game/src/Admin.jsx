import { useState } from 'react'
import { NumberContext } from './Contexts.jsx'
import './App.css'

function Admin() {
  const [number, setNumber] = useState(1)

  return (
    <NumberContext.Provider value={number}>
      <h1>Admin Page</h1>
      <div className="card">
        <button >
          Number is {number}
        </button>
      </div>
    </NumberContext.Provider>
  )
}

export default Admin
