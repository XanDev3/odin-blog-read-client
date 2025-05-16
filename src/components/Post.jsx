import { useState, useEffect } from 'react'
import axios from '../lib/axios'
import htmlParse from 'html-react-parser'
import { Link, useParams } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useComments from '../hooks/useComments'
import Comments from './Comments'
import { CustomLink } from '../layouts/Navbar'

const Post = () => {
  const [post, setPost] = useState({})
  const {comments, setComments} = useComments()
  const [newComment, setNewComment] = useState('')
  const [updateComments, setUpdateComments] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  const { auth } = useAuth()

  const date = new Date(post.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  useEffect(() => {
    axios
      .get(`posts/${id}`)
      .then(response => {
        setPost(response.data.post)
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
  
  const handleCommentChange = e => {
    setNewComment(e.target.value)
  }
  const handleCommentSubmit = e => {
    e.preventDefault()
    if (!auth.token) return

    axios.post(
      `posts/${id}/comments`,
      {
        content: newComment,
      },
      {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    .then(response => {
      if (response.status === 200) {
        console.log('successful create comment')
        setNewComment('')
        setUpdateComments((prev)=>!prev)
      }
      else{
        throw new Error('Failed to create comment')
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
        setErrMsg('Comment Create Failed')
      }
    })
  }
  
  if (isLoading) {
    return <p>Loading...</p>
  } else if (post.isPublished) {
    return (
      <>
        <div className='home-header'>
          <div className='header-title'>
            <div className='header-title-wrap'>
              <h1>{post?.title}</h1>
              <h4 className='post-date'>{date}</h4>
            </div>
          </div>
        </div>
        <div className='single-post-container'>
          <article key={post._id} className='post-page'>
            <div className='post-content'>{htmlParse(post.content)}</div>
            <div className='post-author'>By {post?.author[0].username}</div>
          </article>
        </div>
        <div className='comments-container m-8 w-xl mx-auto'>
          <h3 className='comments-title text-3xl mb-4'>Comments</h3>
          {auth?.token ? (
            <section id='new-comment' className='new-comment border-b-2 border-gray-800'>
              <p className='new-comment-title text-left my-2'>
                Comment on the post '{post?.title}'
              </p>
              <form className='new-comment-form' onSubmit={handleCommentSubmit}>
                <textarea
                  name='comment'
                  id='comment-input'
                  placeholder='Enter your comment here'
                  onChange={handleCommentChange}
                  value={newComment}
                  minLength='2'
                  required=''
                  className='new-comment-input block w-xl h-16 p-2 mb-8 opacity-54 text-md placeholder:bg-[rgb(217, 220, 231)] border-2 rounded border-gray-800' 
                ></textarea>
                <div className='new-comment-btn-container flex gap-2'>
                  <button
                    className='new-comment-btn submit mb-2 disabled:cursor-not-allowed hover:outline-2 hover:outline-btn-outline-blue'
                    disabled={newComment.length < 2}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </section>
          ) : (
            <p className='new-comment-no-user w-xl pb-4 text-left block no-underline border-b-2 border-gray-800'>
              Please{" "}
              <Link to='/login' state={{from: location.pathname}} className="new-comment-login-link text-sky-blue hover:text-my-blue">
              login
              </Link>{" "}
              to add a comment.
            </p>
          )}
          <Comments postId={post._id} updateComments={updateComments} ></Comments>
        </div>
      </>
    )
  } else {
    return <></>
  }
}

export default Post
