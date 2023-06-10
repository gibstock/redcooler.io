'use client'
import React, { FormEvent } from 'react'
import { useUserStore } from '@/hooks/store'
import { useRouter } from 'next/navigation'
import api from '@/api/api'

const EditPost = () => {
  const docId = useUserStore(state => state.currentDoc)
  const contentToEdit = useUserStore(state => state.contentToEdit)
  const setContentToEdit = useUserStore(state => state.setContentToEdit)

  console.log(docId)
  console.log(contentToEdit)
  const router = useRouter();

  const handleSubmitEdit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
        await api.editTopic(docId!, contentToEdit!)
        console.log("success")
        router.push(`/${docId}/conversation/`)
    }catch (err) {
      console.log("error", err)
    }
  }

  return (
    <div className='w-full h-screen flex justify-center items-center p-4'>
      <div className="form-wrapper w-full p-3 relative">
        <form className='mt-[8vh]' onSubmit={handleSubmitEdit}>
          <div className="save-group mt-[4vh] bg-[#272b30] absolute top-0 left-0 w-full flex flex-row justify-between items-center py-3 px-2">
            <div className='text-slate-200'>Edit Post</div>
            <button type="submit" className='text-red-500 hover:text-red-400'>Save</button>
          </div>
          <div className="edit-group">
            <label htmlFor="editcontent" hidden={true}>
              Edit Post
            </label>
            <textarea 
              name="topic-reply" 
              id="topic-reply" 
              value={contentToEdit!}
              className='w-full px-2 text-slate-900 h-[80vh] focus-within:outline-none'
              onChange={(e) => setContentToEdit(e.target.value)}
            >
            </textarea>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPost
