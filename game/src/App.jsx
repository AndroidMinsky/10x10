import { useState } from 'react'
import { NumberContext } from './Contexts.jsx'
import './App.css'

function App() {
  const [number, setNumber] = useState(1)
  
  return (
    <NumberContext.Provider value={number}>
      <h1>Home Page</h1>
      <div className="card">
        {number}
      </div>
    </NumberContext.Provider>
  )
}

export default App
