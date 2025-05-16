import { useRef, useState, useEffect, useContext } from 'react'
import useAuth from '../hooks/useAuth.jsx'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from '../lib/axios.js'
const LOGIN_URL = 'login'

const Login = () => {
  // Login design from Dave Gray's Youtube videos called React Persistent User Auth w/ JWT and React Protected Routes | Role-Based Auth| React Router v6
  const { setAuth } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const userRef = useRef()
  const errRef = useRef()

  const [username, setUsername] = useState('')
  const [pwd, setPwd] = useState('')
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [username, pwd])

  const handleSubmit = async e => {
    e.preventDefault()
     console.log(location.state.from)
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username, password: pwd }),
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )
/*       console.log(JSON.stringify(response?.data))
      console.log('full response')
      console.log(JSON.stringify(response)) */
      const token = response?.data?.token
      const isAdmin = response?.data?.admin
      const user = response?.data?.user
      setAuth({ isAdmin, user, token })
      setUsername('')
      setPwd('')
      navigate(from, { replace: true })
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password')
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized')
      } else if (err.response?.status === 403) {
        setErrMsg(err.response?.errors[0])
      } else {
        setErrMsg('Login Failed')
      }
      errRef.current.focus()
    }
  }
  return (
    <>
      <section className='login-section text-center p-4 mt-8 gap-4 h-max-screen flex flex-col justify-center items-center'>
        <p
          ref={errRef}
          className={errMsg ? 'errmsg' : 'offscreen'}  
          aria-live='assertive'
        >
          {errMsg}
        </p>
        <h1 className="text-2xl">Log In</h1>
        <form onSubmit={handleSubmit} className='login-form flex flex-col items-center gap-4'>
          <input
            type='text'
            id='username'
            className="mt-2 p-2 h-12 w-84 rounded-md border-2 border-gray-300 focus:outline-none focus:border-sky-blue"
            placeholder='Username'
            ref={userRef}
            autoComplete='off'
            onChange={e => setUsername(e.target.value)}
            value={username}
            required
          />
          <input
            type='password'
            id='password'
            className="mt-2 p-2 h-12 w-84 rounded-md border-2 border-gray-300 focus:outline-none focus:border-sky-blue"
            placeholder='Password'
            onChange={e => setPwd(e.target.value)}
            value={pwd}
            required
          />
          <button className='login-button !mt-8 gap-4 hover:outline-2 hover:outline-btn-outline-blue'>Log In</button>
        </form>
      </section>
      <p className='signup-p text-center'>
        Don't have an account yet?
        <Link to='/signup' className='signup-link ml-1 p-0.5 text-sky-blue hover:text-my-blue'>
          Sign Up Here
        </Link>
      </p>
    </>
  )
}

export default Login
