'use client'
import React, {FormEvent, useState} from 'react';
import { useUserStore } from '@/hooks/store';
import api from '@/api/api';
import { Server } from '@/utils/appwriteConfig';
import { useRouter } from 'next/navigation';

// NEED
/*
* Topics database
* User from zustand
* API
* Server
* useRouter
*/
const initialData = {
  subject: '',
  starter: '',
  beat: '',
  createdBy: '',
  user_account_id: '',
  isPrivate: false,
  email: [''],
}

export default function NewTopic(){
  const [topic, setTopic] = useState(initialData)
  const [emailInput, setEmailInput] = useState('');
  
  const user = useUserStore(state => state.user);

  const router = useRouter();

  if(topic.user_account_id !== user?.$id) {
    setTopic({...topic, createdBy: user?.name!, user_account_id: user?.$id!})
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try{
      let parsedEmailInput: string[] = [];
      if(emailInput.length > 0) {
        parsedEmailInput = emailInput.split(",")
        parsedEmailInput.push(user?.email!)
      } else {
        parsedEmailInput.push(user?.email!)
      }
      e.preventDefault()
      await api.createTopic(topic.subject, topic.starter, topic.user_account_id, topic.createdBy, topic.beat, topic.isPrivate, parsedEmailInput)
      setTopic(initialData);
      router.push('/dashboard')

    }catch (err) {
      console.log("error starting the thread", err)
    }
  }


  return (
    <div className='mt-20'>
      <header className='p-2'>
        <h1 className='text-2xl text-slate-200'>Create a Topic</h1>
      </header>
      <div className='new-topic-group p-2'>
        <div className="form-wrapper p-4 outline outline-1 outline-slate-400 rounded-sm">
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='flex flex-col'>
              <label htmlFor="subject" hidden>
                Subject
              </label>
              <input 
                className='rounded-sm p-2'
                required={true}
                type="text" 
                id='subject'
                placeholder='Title'
                value={topic.subject}
                onChange={(e) => setTopic({...topic, subject: e.target.value})}
              />
            </div>
            <div className='flex flex-col'>
              <label htmlFor="starter" hidden>
                Starter
              </label>
              <textarea 
                className='rounded-sm p-2 h-[30vh]'
                required={true}
                id='starter'
                placeholder='Text'
                value={topic.starter}
                onChange={(e) => setTopic({...topic, starter: e.target.value})}
              ></textarea>
            </div>
            <div className='flex flex-col'>
              <label htmlFor="beat" hidden>
                Beat Link
              </label>
              <input 
                className='rounded-sm p-2'
                required={false}
                type="text" 
                id='beat'
                placeholder='Link to YouTube or Soundcloud beat'
                value={topic.beat}
                onChange={(e) => setTopic({...topic, beat: e.target.value})}
              />
            </div>
            <div className='flex flex-row items-center justify-start gap-4'>
              <div className="radio-group flex flex-row gap-1 text-slate-200">
                <label htmlFor="isPrivate">
                  Private
                </label>
                <input required type="radio" name="privacyGroup" id="isPrivate" onChange={() =>setTopic({...topic, isPrivate: true})}/>
              </div>
              <div className="radio-group flex flex-row gap-1 text-slate-200">
                <label htmlFor="isPublic">
                  Public
                </label>
                <input type="radio" name="privacyGroup" id="isPublic" onChange={() => setTopic({...topic, isPrivate: false})} />
              </div>
              <span className='text-slate-200'>Choose who can see your post</span>
            </div>
            <div className='flex flex-col'>
              <label htmlFor="email-list" className='text-slate-200'>
                Add Members to a Private Topic <span className='text-slate-400'>(Optional. Only added members can see private posts)</span>
              </label>
              <input 
                className='rounded-sm p-2'
                required={false}
                type="email" 
                id='email-list'
                placeholder='him@email.com, her@email.com'
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                multiple={true}
              />
            </div>
            {/* Submit button  */}
            <div className='text-slate-200'>
              <button type='submit' className='outline outline-1 outline-red-500 px-2 py-1 rounded-md hover:bg-red-500'>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}