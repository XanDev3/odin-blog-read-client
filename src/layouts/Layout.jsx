import { Outlet } from 'react-router-dom'
import React from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'



const Layout = () => {
  return (
    <div className='layout min-h-screen flex flex-col bg-gray-700 dark:text-white light:text-black font-work'>
      <Navbar className="static" />
      <main className="/* flex-grow */">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
