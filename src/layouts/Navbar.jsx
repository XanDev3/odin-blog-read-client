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
    <div className='header-item-container top-0 left-0 sticky z-10 bg-dark-navy flex justify-between items-center p-4 m-0'>
      <div className='header-items-left flex items-center gap-4'>
        <Link to='/' className='header-title-link header-item'>
          <h1 className='hover:text-blue-700 transition-colors duration-200 font-work text-xl font-semibold'>Home</h1>
        </Link>
      </div>
      <ul className='header-items-right flex items-center gap-4'>
        {auth.token ? (
          <div className='profile-div !bg-color-dark-navy !border-none !outline-none '>
            <button
              id='open-user-menu'
              className='profile-btn !bg-dark-navy mr-8'
              onClick={() => {
                setAccountMenuExpansion(prev => !prev)
              }}
            >
              <img
                src='/src/assets/user.png'
                alt=''
                className='profile-icon w-8 h-8 rounded-full !bg-none !bg-dark-navy !p-0'
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
                <div className='acct-menu absolute flex flex-col right-0 mr-4 mt-2 w-34 bg-gray-400 rounded-md shadow-lg py-2 z-10 border-rounded-md items-center-safe'>
                  <p className='acct-username p-2'>{auth.user}</p>
                  <form onSubmit={handleLogout}>
                    <button className='logout-btn hover:outline-2 hover:outline-btn-outline-blue '>Log Out</button>
                  </form>
                  {errMsg && 
                    <p>{errMsg}</p>
                  }
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="header-links-container flex items-center gap-4">
            <CustomLink className="hover:text-blue-700 transition-colors duration-200 font-work text-lg" to='/login' state={{ from: location.pathname }}>
              Login
            </CustomLink>
            <button className="signup-btn button !p-1.5 bg-btn-blue hover:outline-2 hover:outline-btn-outline-blue has-[.active]:outline-2 has-[.active]:outline-btn-outline-blue">
              <CustomLink  className="text-lg " to='/signup' state={{ from: location.pathname }}>
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
    <li className={isActive && to !== '/signup' ? 'header-item border-b-2 border-btn-outline-blue' : 'header-item'}>
      <Link id={to} to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}

export default Navbar
