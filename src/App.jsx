import { useState } from 'react'

import Home from '../src/Components/Home/Home'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className='heading'>Sri Balaji Gold and Silver Pvt ltd</h1>
      <Home />
    </>
  )
}

export default App
