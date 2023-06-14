'use client'
import React, { FormEvent, useState } from 'react'
import { useUserStore } from '@/hooks/store'
import { useRouter } from 'next/navigation'
import api from '@/api/api'

const EditPost = () => {
  const [modal, setModal] = useState(false);
  const docId = useUserStore(state => state.currentDoc)
  const contentToEdit = useUserStore(state => state.contentToEdit)
  const setContentToEdit = useUserStore(state => state.setContentToEdit)

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
  const handleCancel = () => {
    router.back()

  }

  return (
    <div className='w-full h-screen flex justify-center items-center p-4'>
      <div className="form-wrapper w-full p-3 relative">
        <form className='mt-[8vh]' onSubmit={handleSubmitEdit}>
          <div className="save-group mt-[4vh] bg-[#272b30] absolute top-0 left-0 w-full flex flex-row justify-between items-center py-3 px-2">
            <div className='text-slate-200'>Edit Post</div>
            <div className="button-group flex flex-row gap-x-2">
              <input type="button" value="Cancel" className='text-slate-400 hover:text-slate-300 cursor-pointer' onClick={() => setModal(true)} />
              <button type="submit" className='text-red-500 hover:text-red-400'>Save</button>
            </div>
          </div>
          <div className="edit-group">
            <label htmlFor="editcontent" hidden={true}>
              Edit Post
            </label>
            <textarea 
              name="topic-reply" 
              id="topic-reply" 
              value={contentToEdit!}
              className='w-full px-2 py-3 text-slate-900 h-[80vh] focus-within:outline-none'
              onChange={(e) => setContentToEdit(e.target.value)}
            >
            </textarea>
          </div>
        </form>
        {modal && (
          <div className='modal-wrapper absolute top-0 left-0 w-full h-full'>
            <div className="overlay absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
            <div className="modal absolute top-[30%] left-0 w-full bg-black p-4 flex flex-col gap-1">
              <header>
                <h1 className='text-slate-200 text-xl font-bold'>Cancel Changes</h1>
              </header>
              <div className="body text-slate-300">
                <p>Are you sure you want to cancel these changes?</p>
              </div>
              <div className="responses flex flex-row justify-around items-center">
                <button className='text-slate-400' onClick={() => setModal(false)}>Keep Editing</button>
                <button className='text-slate-100 font-bold bg-blue-500 hover:bg-blue-400 py-1 px-5 rounded-full' onClick={handleCancel}>Discard Edit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditPost
