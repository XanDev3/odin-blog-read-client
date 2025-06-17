import { useState, useEffect } from 'react'
import axios from '../lib/axios'
import parse from 'html-react-parser'
import { decode } from 'html-entities';
import { Link, useParams } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useComments from '../hooks/useComments'
import Comments from './Comments'
import Prism from 'prismjs'
import '../prism.css'

const Post = () => {
  const [post, setPost] = useState({})
  // const {comments, setComments} = useComments()
  const [newComment, setNewComment] = useState('')
  const [updateComments, setUpdateComments] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  const { auth } = useAuth()
  const decodedContent = decode(post?.content || '');
  

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

  useEffect(() => {
    Prism.highlightAll();
  }, [decodedContent]);
  
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
        <div className='home-header bg-dark-navy min-h-[16rem] w-100% flex flex-col items-center justify-center mb-12'>
          <div className='header-title text-center'>
            <div className='header-title-wrap max-w-6xl my-0 mx-auto p-4'>
              <h1 className='text-6xl text-[#fff] mb-2'>{post?.title}</h1>
              <h4 className='post-date text-xl m-0'>{date}</h4>
            </div>
          </div>
        </div>
        <div className='single-post-container font-work max-w-4xl my-1 mx-auto py-0 px-6'>
          <article key={post._id} className='post-page bg-white-background shadow-3xl rounded-[3px] text-font-black py-4 px-8 mb-16 '>
            <div className='post-content mb-4'>{parse(decodedContent)}</div>
            <div className='post-author mt-4 font-gray-500'>By {post?.author[0].username}</div>
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
