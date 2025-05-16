import { useRef, useState, useEffect, useContext } from 'react'
import useAuth from '../hooks/useAuth.jsx'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from '../lib/axios.js'

const Signup = () => {
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
    axios
      .post('/signup', JSON.stringify({ username, password: pwd }), {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
        if (response.status === 200) {
          console.log('successful create')
          console.log(JSON.stringify(response?.data))
          console.log('full response')
          console.log(JSON.stringify(response))
          const token = response?.data?.token
          const isAdmin = response?.data?.admin
          const user = response?.data?.user
          setAuth({ isAdmin, user, token })
          setUsername('')
          setPwd('')
          navigate(from, { replace: true })
        } else {
          throw new Error('Failed to Signup')
        }
      })
      .catch(err => {
        if (!err?.response) {
          setErrMsg('No Server Response')
        } else if (err.response?.status === 400) {
          setErrMsg('Missing Username or Password')
        } else if (err.response?.status === 401) {
          setErrMsg('Unauthorized')
        } else if (err.response?.status === 403) {
            console.log(err.response)
          setErrMsg(err.response?.data.errors[0])
        } else {
          setErrMsg('Sign Up Failed')
        }
      })
  }
  return (
    <>
      <section className='signup-section text-center p-4 mt-8 gap-4 h-max-screen flex flex-col justify-center items-center'>
        <p
          ref={errRef}
          className={errMsg ? 'errmsg' : 'offscreen'}
          aria-live='assertive'
        >
          {errMsg}
        </p>
        <h1 className="text-2xl">Sign Up</h1>
        <form onSubmit={handleSubmit} className='signup-form login-form flex flex-col items-center gap-4'>
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
          <button className='signup-button !mt-8 gap-4 hover:outline-2 hover:outline-btn-outline-blue'>Sign Up</button>
        </form>
      </section>
    </>
  )
}

export default Signup
