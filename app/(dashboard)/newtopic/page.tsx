'use client'
import React, {FormEvent, useState} from 'react';
import { useUserStore } from '@/hooks/store';
import api from '@/api/api';
import { TbAsteriskSimple } from 'react-icons/tb'
import { RxCross1 } from 'react-icons/rx'
import { useRouter } from 'next/navigation';

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
  const [buttonValue, setButtonValue] = useState('Post')
  
  const user = useUserStore(state => state.user);

  const router = useRouter();

  if(topic.user_account_id !== user?.$id) {
    setTopic({...topic, createdBy: user?.name!, user_account_id: user?.$id!})
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setButtonValue("Posting")
    try{
      let parsedEmailInput: string[] = [];
      if(emailInput.length > 0) {
        parsedEmailInput = emailInput.split(",")
        parsedEmailInput.push(user?.email!)
      } else {
        parsedEmailInput.push(user?.email!)
      }
      e.preventDefault()
      e.currentTarget.disab
      // Create a new topic in the topic database, topic will not contain
      // an entry for coundDocId yet
      const createdTopic = await api.createTopic(topic.subject, topic.starter, topic.user_account_id, topic.createdBy, topic.beat, topic.isPrivate, parsedEmailInput)
      // reset initial data values
      setTopic(initialData);
      // create a new entry in the convoCount database using the $id from the newly created topic
      // as a foreing key
      const createdCountDoc = await api.createCommentCount(createdTopic.$id, 0);
      // Now that the convoCount entry has been created, add that doc id entry back into
      // the newly created topic in order to reference the convoCount db entry
      await api.addCountDocIdToNewTopic(createdTopic.$id, createdCountDoc.$id)
      router.push('/dashboard')

    }catch (err) {
      console.log("error starting the thread", err)
    }
  }

  const handleCancel = () => {
    router.back()
  }


  return (
    <div className='mt-20 lg:flex lg:flex-col items-center'>
      <header className='pt-2 lg:max-w-2xl lg:w-full lg:flex flex-col items-center'>
        <h1 className='text-2xl text-slate-200 text-center mb-3'>Create a Topic</h1>
        <div className="required-info flex flex-row justify-center items-center gap-3 text-[10px]">
          <div className='text-xs'>
            <TbAsteriskSimple size={10} className='text-red-500'/>
          </div>
          <div className=' text-slate-400'>
            Indicates required field
          </div>
        </div>
        <div 
          className="cancel lg:self-start text-slate-400 hover:text-slate-300 cursor-pointer"
          onClick={handleCancel}
        >
          <RxCross1 size={22} />
        </div>
      </header>
      <div className='new-topic-group p-2 lg:w-full lg:max-w-2xl'>
        <div className="form-wrapper p-4 outline outline-1 outline-slate-400 rounded-sm">
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='flex flex-col relative'>
              <label htmlFor="subject" hidden>
                Subject
              </label>
              <TbAsteriskSimple 
                size={10} 
                className='text-red-500 absolute -left-0 top-0'
              />
              <input 
                className='rounded-sm p-2 bg-slate-700 text-slate-200 md:text-slate-700  md:bg-slate-200'
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
                className='rounded-sm p-2 h-[30vh] bg-slate-700 text-slate-200 md:text-slate-700  md:bg-slate-200'
                required={false}
                id='starter'
                placeholder='Text (Optional)'
                value={topic.starter}
                onChange={(e) => setTopic({...topic, starter: e.target.value})}
              ></textarea>
            </div>
            <div className='flex flex-col'>
              <label htmlFor="beat" hidden>
                Beat Link
              </label>
              <input 
                className='rounded-sm p-2 bg-slate-700 text-slate-200 md:text-slate-700  md:bg-slate-200'
                required={false}
                type="text" 
                id='beat'
                placeholder='Beat Link (Optional)'
                value={topic.beat}
                onChange={(e) => setTopic({...topic, beat: e.target.value})}
              />
              <small className='text-center text-slate-500'>Currently supports YouTube and SoundCloud</small>
            </div>
            <div className='flex flex-col items-center justify-start gap-4 border-y border-y-slate-500 py-4'>
              <span className='text-slate-200'>Choose who can see your post</span>
              <div className="flex flex-row justify-evenly items-center w-full">
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
                  <input type="radio" name="privacyGroup" id="isPublic" checked={topic.isPrivate == false ? true : false} onChange={() => setTopic({...topic, isPrivate: false})} />
                </div>
              </div>
            </div>
            <div className='flex flex-col border-b border-b-slate-500 pb-4'>
              <label htmlFor="email-list" className='text-center text-slate-200'>
                Add Members to a Private Topic 
              </label>
              <small className='text-center text-slate-500'>Separate emails with a comma</small>
              <input 
                className='rounded-sm p-2 bg-slate-700 text-slate-200 md:text-slate-700  md:bg-slate-200'
                required={false}
                type="email" 
                id='email-list'
                placeholder='(Optional) a@mail.com, b@mail.com'
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                multiple={true}
              />
            </div>
            {/* Submit button  */}
            <div className='text-slate-200'>
              <button 
                type='submit' 
                className='outline outline-1 outline-red-500 px-2 py-1 rounded-md hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-200 disabled:outline-none' 
                disabled={buttonValue === 'Posting' ? true : false}
              >{buttonValue}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
