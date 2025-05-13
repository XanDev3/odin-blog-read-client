import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './layouts/Layout.jsx'
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Post from './components/Post.jsx'

function App () {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          {/* public routes */}
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
{/*           <Route path='unauthorized' element={<Unauthorized />} /> */}
          {/*  protected routes */}
{/*           <Route element={<RequireAuth />}> */}
            <Route path='/' element={<Home />} />
            <Route path='/posts/:id' element={<Post />} />
            <Route path='logout' element={<Layout />} />
          
{/*           </Route> */}
          {/* catch all */}
{/*           <Route path='*' element={<Missing />} /> */}
        </Route>
      </Routes>
    </>
  )
}

export default App
