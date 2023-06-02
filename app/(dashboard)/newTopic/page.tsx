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
  user_account_id: '',
  isPrivate: false
}

const NewTopic = () => {
  const [topic, setTopic] = useState(initialData)
  
  const user = useUserStore(state => state.user);

  if(topic.user_account_id !== user?.$id) {
    setTopic({...topic, user_account_id: user?.$id!})
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try{
      e.preventDefault()
      console.log({topic})
      await api.createTopic(topic.subject, topic.starter, topic.user_account_id, topic.beat, topic.isPrivate)
      setTopic(initialData);

    }catch (err) {
      console.log("error starting the thread", err)
    }
  }


  return (
    <div>
      <h1>New Topic</h1>
      <p>User: {user ? user.name : "No name"}</p>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="subject">
              Subject
            </label>
            <input 
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
            <input 
              type="text" 
              id='starter'
              placeholder='Enter your Starter text'
              value={topic.starter}
              onChange={(e) => setTopic({...topic, starter: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="beat">
              Beat Link
            </label>
            <input 
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
            <input type="radio" name="privacyGroup" id="isPrivate" onChange={() =>setTopic({...topic, isPrivate: true})}/>
            <label htmlFor="isPublic">
              Public
            </label>
            <input type="radio" name="privacyGroup" id="isPublic" onChange={() => setTopic({...topic, isPrivate: false})} />
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