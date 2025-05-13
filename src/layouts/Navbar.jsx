import './navbar.css'
import { useState } from 'react'
import {
  Link,
  useMatch,
  useResolvedPath,
  useNavigate,
  useLocation
} from 'react-router-dom'
import axios from '../lib/axios.js'
import useAuth from '../hooks/useAuth'

function Navbar () {
  const { auth, setAuth } = useAuth()
  const [isAccountMenuExpanded, setAccountMenuExpansion] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = e => {
    e.preventDefault();

    axios
      .post('/logout')
      .then(response => {
        if (response.status === 200) {
          setAuth({})
          setErrMsg('')
          setAccountMenuExpansion(false)
          console.log('successful logout')
          navigate('/')
        } else {
          throw new Error('Failed to log out')
        }
      })
      .catch(err => {
        if (!err?.response) {
          setErrMsg('No Server Response')
        } else if (err.response?.status === 400) {
          setErrMsg('Missing Username or Password')
        } else if (err.response?.status === 401) {
          setErrMsg('Unauthorized')
        } else {
          setErrMsg('Logout Failed')
        }
      })
  }
  return (
    <div className='header-item-container'>
      <div className='header-items-left'>
        <Link to='/' className='header-title-link header-item'>
          <h1>Home</h1>
        </Link>
      </div>
      <ul className='header-items-right'>
        {auth.token ? (
          <div className='profile-div'>
            <button
              id='open-user-menu'
              className='profile-btn'
              onClick={() => {
                setAccountMenuExpansion(prev => !prev)
              }}
            >
              <img
                src='/src/assets/user.png'
                alt=''
                className='profile-icon'
              ></img>
              {/* <span className='text-base text-gray-300'>
              <i
                className='fa fa-chevron-down ml-2 thin-icon'
                aria-hidden='true'
              ></i>
            </span> */}
            </button>
            <div className='menu-container'>
              {isAccountMenuExpanded && (
                <div className='acct-menu'>
                  <p className='acct-username'>{auth.user}</p>
                  <form onSubmit={handleLogout}>
                    <button className='logout-btn'>Log Out</button>
                  </form>
                  {errMsg && 
                    <p>{errMsg}</p>
                  }
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="header-links-container">
            <CustomLink to='/login' state={{ from: location.pathname }}>
              Login
            </CustomLink>
            <button className="signup-btn">
              <CustomLink  to='/signup' state={{ from: location.pathname }}>
                Register
              </CustomLink>
            </button>
          </div>
        )}
      </ul>
    </div>
  )
}

export function CustomLink ({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? 'active header-item' : 'header-item'}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}

export default Navbar
