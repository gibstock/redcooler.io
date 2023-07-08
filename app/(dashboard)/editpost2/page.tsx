'use client'
import React, { FormEvent, useState } from 'react'
import { useUserStore } from '@/hooks/store'
import { useRouter } from 'next/navigation'
import api from '@/api/api'


const EditPost2 = () => {
  const [modal, setModal] = useState(false);

  const userStore = useUserStore()
  const docId = userStore.currentDoc
  const topicId = userStore.topicId
  const contentToEdit = userStore.contentToEdit
  const setContentToEdit = userStore.setContentToEdit
  const titleToEdit = userStore.titleToEdit
  const emailsToEdit = userStore.emailsForEdit
  const setEmailsForEdit = userStore.setEmailsForEdit
  const beatToEdit = userStore.beatToEdit
  const setBeatToEdit = userStore.setBeatToEdit
  const isPrivateForEdit = userStore.isPrivateToEdit
  const setIsPrivateForEdit = userStore.setIsPrivateToEdit

  const router = useRouter();

  const handleSubmitEdit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
        await api.editTopic(topicId!, contentToEdit!, isPrivateForEdit!, beatToEdit!, emailsToEdit)
        console.log("success")
        router.push(`/${topicId}/conversation/`)
    }catch (err) {
      console.log("error", err)
    }
  }

  const handleCancel = () => {
    router.back()

  }
  return (
    <div className='mt-20'>
      <header className='pt-8'>
        <h1 className='text-2xl text-slate-800 dark:text-slate-200 text-center mb-3'>Edit your Post</h1>
        <div className="required-info flex flex-row justify-center items-center gap-3 text-[10px]">
        </div>
      </header>
      <div className='new-topic-group p-2'>
        <div className="form-wrapper p-4 outline outline-1 outline-slate-400 rounded-sm">
          <form onSubmit={handleSubmitEdit} className='flex flex-col gap-4'>
            <div className="save-group mt-[8vh] bg-white dark:bg-[#272b30] absolute top-0 left-0 w-full flex flex-row justify-between items-center py-3 px-2">
              <div className='text-slate-800 dark:text-slate-200'>Edit Post</div>
              <div className="button-group flex flex-row gap-x-2">
                <input type="button" value="Cancel" className='text-slate-400 hover:text-slate-300 cursor-pointer' onClick={() => setModal(true)} />
                <button type="submit" className='text-red-500 hover:text-red-400'>Save</button>
              </div>
            </div>
            <div className='flex flex-col relative'>
              <label htmlFor="subject" hidden>
                Subject
              </label>
              <input 
                className='rounded-sm p-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 cursor-not-allowed'
                required={true}
                type="text" 
                id='subject'
                placeholder='Title'
                value={titleToEdit? titleToEdit : ""}
                disabled={true}
              />
            </div>
            <div className='flex flex-col'>
              <label htmlFor="starter" hidden>
                Starter
              </label>
              <textarea 
                className='rounded-sm p-2 h-[30vh] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                required={false}
                id='starter'
                placeholder='Text (Optional)'
                value={contentToEdit? contentToEdit : ""}
                onChange={(e) => setContentToEdit(e.target.value)}
              ></textarea>
            </div>
            <div className='flex flex-col'>
              <label htmlFor="beat" hidden>
                Beat Link
              </label>
              <input 
                className='rounded-sm p-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                required={false}
                type="text" 
                id='beat'
                placeholder='Beat Link (Optional)'
                value={beatToEdit? beatToEdit : ""}
                onChange={(e) => setBeatToEdit(e.target.value)}
              />
              <small className='text-center text-slate-500'>Currently supports YouTube and SoundCloud</small>
            </div>
            <div className='flex flex-col items-center justify-start gap-4 border-y border-y-slate-500 py-4'>
              <span className='text-slate-800 dark:text-slate-200'>Choose who can see your post</span>
              <div className="flex flex-row justify-evenly items-center w-full">
                <div className="radio-group flex flex-row gap-1 text-slate-800 dark:text-slate-200">
                  <label htmlFor="isPrivate">
                    Private
                  </label>
                  <input required type="radio" name="privacyGroup" id="isPrivate" checked={isPrivateForEdit == true ? true : false} onChange={() => setIsPrivateForEdit(true) }/>
                </div>
                <div className="radio-group flex flex-row gap-1 text-slate-800 dark:text-slate-200">
                  <label htmlFor="isPublic">
                    Public
                  </label>
                  <input type="radio" name="privacyGroup" id="isPublic" checked={isPrivateForEdit == false ? true : false} onChange={() => setIsPrivateForEdit(false)} />
                </div>
              </div>
            </div>
            <div className='flex flex-col border-b border-b-slate-500 pb-4'>
              <label htmlFor="email-list" className='text-center text-slate-800 dark:text-slate-200'>
                Add Members to a Private Topic 
              </label>
              <small className='text-center text-slate-500'>Separate emails with a comma</small>
              <input 
                className='rounded-sm p-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                required={false}
                type="email" 
                id='email-list'
                placeholder='(Optional) a@mail.com, b@mail.com'
                value={emailsToEdit}
                onChange={(e) => setEmailsForEdit([...emailsToEdit, e.target.value])}
                multiple={true}
              />
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
    </div>
  )
}

export default EditPost2