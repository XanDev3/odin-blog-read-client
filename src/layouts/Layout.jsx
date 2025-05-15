import { Outlet } from 'react-router-dom'
import React from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import styled from 'styled-components'

const MainContainer = styled.div`
  font-family: "Work Sans", sans-serif;
  text-align: center;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
`

const Layout = () => {
  return (
    <div className='layout min-h-screen flex flex-col bg-gray-700 dark:text-white light:text-black font-work'>
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
