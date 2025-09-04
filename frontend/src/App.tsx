import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
// import Property from './pages/Property'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path='/' element={<Dashboard />} />
        {/* <Route path="/property/:id" element={<Property />} /> */}
      </Routes>
    </Router>
  )
}

export default App


