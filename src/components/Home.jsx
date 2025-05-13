import { useState, useEffect } from 'react'
import axios from '../lib/axios'
import htmlParse from 'html-react-parser'
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
      <div className='home-header'>
        <div className='header-title'>
          <div className='header-title-wrap'>
            <h1>Welcome to My Blog</h1>
            <h4>Read my blog posts. Share your thoughts.  Join the community.</h4>
          </div>
        </div>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className='posts-container'>
          {allPosts.map(post => {
            const date = new Date(post.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
            if(post.isPublished) {
              return (
                <article key={post._id} className='post-card'>
                  <Link to={`/posts/${post._id}`}>
                    <h1 className='post-card-title'>{post.title}</h1>
                    <div className='post-card-content'>
                      {htmlParse(post.content)}
                    </div>
                    <div className='post-card-date'>
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
