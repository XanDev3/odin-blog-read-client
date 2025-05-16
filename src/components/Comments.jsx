import { useState, useEffect } from 'react'
import axios from '../lib/axios'
import useAuth from '../hooks/useAuth'
import useComments from '../hooks/useComments'

const Comments = ({postId, updateComments} ) => {
  const {comments, setComments} = useComments()
  const [errMsg, setErrMsg] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { auth } = useAuth()
  const [parentPostId, setParentPostId] = useState(postId)

  useEffect(() => {
    axios
      .get(`posts/${parentPostId}/comments`)
      .then(response => {

        setComments(response.data.allComments)
        setIsLoading(false)
      })
      .catch(err => {
        if (!err?.response) {
          setErrMsg('No Server Response')
        } else if (err.response?.status === 400) {
          setErrMsg('Missing Username or Password')
        } else if (err.response?.status === 401) {
          setErrMsg('Unauthorized')
        } else if (err.response?.status === 500) {
          setErrMsg('Could not retrieve comments')
        } else {
          setErrMsg('Get allComments Failed')
        }
      })
  }, [updateComments])

  if (isLoading) {
    return <p>Loading...</p>
  } else if (comments.length < 1) {
    return <p className='comments-section-empty mt-4'>This post has no comments yet...</p>
  } else {
    return (
      <section className='comments-section w-xl'>
        {comments.map(comment => {
          const date = new Date(comment.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })

          const capFirst = (str) => str.charAt(0).toUpperCase()+ str.slice(1)
          return (
            <article key={comment._id} className='comment-card w-xl mx-auto border-2 border-see-through-green shadow-3xl rounded-lg my-4 p-4 text-background-white'>
              <h5 className='comment-author text-2xl font-bold'>{capFirst(comment?.author.username)} <span className='text-xl font-normal'>said:</span></h5>
              <div className="comment-card-content text-center text-xl p-4">{comment.content}</div>
              <div className='comment-card-date text-right text-feint-green text-[.8rem] font-montserrat font-extrabold '><span className='px-1 py-0.5 rounded-2xl bg-see-through-green'>{date}</span></div>
              
            </article>
          )
        })}
      </section>
    )
  }
}

export default Comments
