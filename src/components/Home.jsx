import { useState, useEffect } from 'react'
import axios from '../lib/axios'
import htmlParse from 'html-react-parser'
import { decode } from 'html-entities'
import { Link } from 'react-router-dom'

const Home = () => {
  const [allPosts, setAllPosts] = useState([])
  const [errMsg, setErrMsg] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    axios
      .get('posts')
      .then(response => {
        setAllPosts(response.data.allPosts)
        setIsLoading(false)
      })
      .catch(err => {
        if (!err?.response) {
          setErrMsg('No Server Response')
        } else if (err.response?.status === 400) {
          setErrMsg('Missing Username or Password')
        } else if (err.response?.status === 401) {
          setErrMsg('Unauthorized')
        } else {
          setErrMsg('Get allPosts Failed')
        }
      })
  }, [])

  return (
    <>
      <div className='home-header bg-dark-navy min-h-[16rem] w-100% flex flex-col items-center justify-center mb-8'>
        <div className='header-title text-center'>
          <div className='header-title-wrap max-w-2xl my-0 mx-auto p-4'>
            <h1 className='text-6xl text-[#fff] mb-4'>Welcome to My Blog</h1>
            <h4 className='text-xl mt-0'>Read my blog posts. Share your thoughts.  Join the community.</h4>
          </div>
        </div>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className='posts-container font-work max-w-8xl mx-6 md:mx-16 sm:mx-12 my-0 px-6 md:px-4 sm:px-4 py-0 grid lg:max-2xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 md:gap-4 '>
          {allPosts.map(post => {
            const date = new Date(post.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
            if(post.isPublished) {
              return (
                <article key={post._id} className='post-card flex flex-col p-4 h-100% transition ease-in-out hover:-translate-y-2 bg-white-background shadow-3xl rounded-md text-font-black '>
                  <Link to={`/posts/${post._id}`}>
                    <h1 className='post-card-title line-clamp-3 lg:max-2xl:text-3xl md:text-xl text-lg font-bold mb-4'>{post.title}</h1>
                    <div className='post-card-content line-clamp-4 leading-1.6 flex-grow mb-4 text-md'>
                      {htmlParse(decode(post.content))}
                    </div>
                    <div className='post-card-date text-end text-gray-500 text-sm '>
                      {date} By {post.author[0].username}
                    </div>
                  </Link>
                </article>
              )}
          })}
        </div>
      )}
    </>
  )
}

export default Home
