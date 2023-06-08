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

const NewTopic = () => {
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
      
      console.log("parsedemail", parsedEmailInput)
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
      <h1>New Topic</h1>
      <p>User: {user ? user.name : "No name"}</p>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="subject">
              Subject
            </label>
            <input 
              required={true}
              type="text" 
              id='subject'
              placeholder='Enter your Subject'
              value={topic.subject}
              onChange={(e) => setTopic({...topic, subject: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="starter">
              Starter
            </label>
            <textarea 
              required={true}
              id='starter'
              placeholder='Enter your Starter text'
              value={topic.starter}
              onChange={(e) => setTopic({...topic, starter: e.target.value})}
            ></textarea>
          </div>
          <div>
            <label htmlFor="beat">
              Beat Link
            </label>
            <input 
              required={true}
              type="text" 
              id='beat'
              placeholder='http://www.example.com/'
              value={topic.beat}
              onChange={(e) => setTopic({...topic, beat: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="isPrivate">
              Private
            </label>
            <input required type="radio" name="privacyGroup" id="isPrivate" onChange={() =>setTopic({...topic, isPrivate: true})}/>
            <label htmlFor="isPublic">
              Public
            </label>
            <input type="radio" name="privacyGroup" id="isPublic" onChange={() => setTopic({...topic, isPrivate: false})} />
          </div>
          <div>
            <label htmlFor="email-list">
              Add Members to a Private Topic
            </label>
            <input 
              required={false}
              type="email" 
              id='email-list'
              placeholder='me@example.com, him@email.com, her@email.com'
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              multiple={true}
            />
          </div>
          {/* Submit button  */}
          <div>
            <button type='submit'>Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewTopic