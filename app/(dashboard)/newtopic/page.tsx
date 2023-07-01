'use client'
import React, {FormEvent, useState, ChangeEvent, useRef} from 'react';
import { useUserStore } from '@/hooks/store';
import api from '@/api/api';
import { TbAsteriskSimple } from 'react-icons/tb'
import { RxCross1 } from 'react-icons/rx'
import { useRouter } from 'next/navigation';
import WordCount from '@/components/WordCount';

const initialData = {
  subject: '',
  starter: '',
  beat: '',
  createdBy: '',
  user_account_id: '',
  isPrivate: false,
  email: [''],
}

const wordLimit = {
  subject: 150,
  starter: 1024,
  beat: 100,
}

export default function NewTopic(){
  const [topic, setTopic] = useState(initialData)
  const [emailInput, setEmailInput] = useState('');
  const [buttonValue, setButtonValue] = useState('Post')
  const [category, setCategory] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileTypeWarning, setFileTypeWarning] = useState(false)
  const [fileSizeWarning, setFileSizeWarning] =  useState(false);
  const userStore = useUserStore();
  
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  
  const user = userStore.user;
  const userProfile = userStore.userProfile;

  const router = useRouter();

  if(topic.user_account_id !== user?.$id) {
    setTopic({...topic, createdBy: user?.name!, user_account_id: user?.$id!})
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log(e);
    try{
      let parsedEmailInput: string[] = [];
      if(emailInput.length > 0) {
        parsedEmailInput = emailInput.split(",")
        parsedEmailInput.push(user?.email!)
      } else {
        parsedEmailInput.push(user?.email!)
      }
      e.preventDefault()
      e.currentTarget.disabled
      if(topic.subject.length > wordLimit.subject){
      alert("You are over the character limit, please edit your title.")
      return;
      }
      if(topic.starter.length > wordLimit.starter){
      alert("You are over the character limit, please edit your text content.")
      return;
      }
      if(topic.beat.length > wordLimit.beat){
      alert("You are over the character limit, please edit your beat link.")
      return;
      }
      if(userProfile) {
        setButtonValue("Posting")
        if(file) {
          const audioUpload = await api.uploadAudioFile(file);
          const createdTopic = await api.createTopic(topic.subject, topic.starter, topic.user_account_id, topic.createdBy, category, topic.beat, topic.isPrivate, parsedEmailInput, undefined, userProfile[0].avatarId, userProfile[0].avatarHref, audioUpload.$id)
          setTopic(initialData);
          const createdCountDoc = await api.createCommentCount(createdTopic.$id, 0);
          await api.addCountDocIdToNewTopic(createdTopic.$id, createdCountDoc.$id)
          router.push('/dashboard')

        } else {
          // Create a new topic in the topic database, topic will not contain
          // an entry for coundDocId yet
          const createdTopic = await api.createTopic(topic.subject, topic.starter, topic.user_account_id, topic.createdBy, category, topic.beat, topic.isPrivate, parsedEmailInput, undefined, userProfile[0].avatarId, userProfile[0].avatarHref)
          // reset initial data values
          setTopic(initialData);
          // create a new entry in the convoCount database using the $id from the newly created topic
          // as a foreing key
          const createdCountDoc = await api.createCommentCount(createdTopic.$id, 0);
          // Now that the convoCount entry has been created, add that doc id entry back into
          // the newly created topic in order to reference the convoCount db entry
          await api.addCountDocIdToNewTopic(createdTopic.$id, createdCountDoc.$id)
          router.push('/dashboard')
        }
      }

    }catch (err) {
      console.log("error starting the thread", err)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files) {
      return;
    }
    if(!e.target.files[0].type.includes('audio/mpeg')) {
      setFileTypeWarning(true)
      return;
    }
    console.log("file size", e.target.files[0].size/1024/1024)
    if(e.target.files[0].size/1024/1024 > 25) {
      setFileSizeWarning(true)
      return;
    }
    console.log(e.target.files[0])
    setFile(e.target.files[0]);
  }

  const handleClickUpload = () => {
    // setFileSizeWarning(false)
    // setFileTypeWarning(false)
    fileInputRef?.current?.click();
  }

  return (
    <div className='mt-20 lg:flex lg:flex-col items-center'>
      <header className='pt-2 px-2 lg:max-w-2xl lg:w-full lg:flex flex-col items-center'>
        <h1 className='text-2xl text-slate-800 dark:text-slate-200 text-center mb-3'>Create a Post</h1>
        <div className="required-info flex flex-row justify-center items-center gap-3 text-[10px]">
          <div className='text-xs'>
            <TbAsteriskSimple size={10} className='text-red-500'/>
          </div>
          <div className=' text-slate-400'>
            Indicates required field
          </div>
        </div>
        <div 
          className="cancel lg:self-start text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer"
          onClick={handleCancel}
        >
          <RxCross1 size={22} />
        </div>
      </header>
      <div className='new-topic-group p-2 lg:w-full lg:max-w-2xl'>
        <div className="form-wrapper p-4 outline outline-1 outline-slate-400 rounded-sm">
          <div className="community-select py-4">
            <header className='flex flex-row justify-normal items-center gap-2'>
              <h1 className='text-slate-800 dark:text-slate-300'>Add a Category</h1>
              <TbAsteriskSimple 
                size={10} 
                className='text-red-500 -left-0 top-0'
              />
            </header>
            <select required value={category} onChange={(e) => setCategory(e.target.value)} name="categories" id="category-select" className='bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-300 py-2 px-3 rounded-sm'>
              <option value="music-collab">Music Collab</option>
              <option value="short-stories">Short Stories</option>
              <option value="long-stories">Long Stories</option>
              <option value="journal">Journal</option>
              <option value="showcase">Showcase</option>
              <option value="music-share">Music Share</option>
              <option value="feedback">Feedback</option>
              <option value="looking-for-writers">Looking For Writers</option>
              <option value="looking-for-beats">Looking For Beats</option>
              <option value="creative-writing">Creative Writing</option>
              <option value="incubator">Incubator</option>
              <option value="suggestion-box">Suggestion Box</option>
              <option value="help">Help</option>
              <option value="music-discussion">Music Discussion</option>
              <option value="random">Random</option>
              <option value="personal">Personal</option>
              <option hidden value="testing">Testing</option>
            </select>
          </div>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='flex flex-col relative'>
              <div className="label-wrap flex flex-row gap-2">
                <label htmlFor="subject" className='text-slate-800 dark:text-slate-300'>
                  Title
                </label>
                <TbAsteriskSimple 
                  size={10} 
                  className='text-red-500'
                />
              </div>
              <div className="subject-input-wrap w-full">
                <input 
                  className='w-full rounded-sm p-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                  required={true}
                  type="text" 
                  id='subject'
                  placeholder='Some descriptive title...'
                  value={topic.subject}
                  onChange={(e) => setTopic({...topic, subject: e.target.value})}
                />
                <WordCount words={topic.subject.length} count={wordLimit.subject} color='text-slate-700 dark:text-slate-300' />
              </div>
            </div>
            <div className='flex flex-col'>
              <label htmlFor="starter" className='text-slate-800 dark:text-slate-300'>
                Text
              </label>
              <textarea 
                className='rounded-sm p-2 h-[30vh] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                required={false}
                id='starter'
                placeholder='Get the convo started (Optional)'
                value={topic.starter}
                onChange={(e) => setTopic({...topic, starter: e.target.value})}
              ></textarea>
              <WordCount words={topic.starter.length} count={wordLimit.starter} color='text-slate-200' />
            </div>
            <div className="audio-header text-lg text-center text-slate-800 dark:text-slate-300 border-t-2 border-t-slate-800/50 dark:border-t-slate-300/80">
              <header>
                <h1>Audio Options</h1>
              </header>
            </div>
            <div className="upload-audio-file flex flex-col justify-center items-start text-slate-800 dark:text-slate-300">
              <span>Upload MP3</span>
              <div onClick={handleClickUpload}>
                {file? <div className='bg-slate-200 dark:bg-slate-700 rounded-sm p-2 cursor-pointer'>File: {file.name} <br /><span className={`${(file.size/1024/1024) > 25 ? 'text-red-700' : ''}`}>Size: {(file.size/1024/1024).toFixed(2)}mb</span></div> : <div className='bg-slate-200 dark:bg-slate-700 hover:bg-slate-400 hover:text-slate-800 text-slate-400 rounded-sm p-2 cursor-pointer'>Click to Upload (Optional)</div>}
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className='hidden'
              />
              <small className={`audio-format-warning text-red-700 ${fileTypeWarning ? 'block': 'hidden'}`}>File format not supported</small>
              <small className={`audio-size-warning text-red-700 ${fileSizeWarning ? 'block': 'hidden'}`}>File exceeds 25mb limit</small>
              <small className='text-center text-slate-500'>MP3 format, under 25mb</small>
            </div>

            <div className='flex flex-col'>
              <label htmlFor="beat" className='text-slate-800 dark:text-slate-300'>
                Beat Link
              </label>
              <input 
                className='rounded-sm p-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                required={false}
                type="text" 
                id='beat'
                placeholder='Ex: https://youtu.be/1wiR9TP6tvs (Optional)'
                value={topic.beat}
                onChange={(e) => setTopic({...topic, beat: e.target.value})}
              />
              <WordCount words={topic.beat.length} count={wordLimit.beat} color='text-slate-700 dark:text-slate-200' />
              <small className='text-center text-slate-500'>Currently supports YouTube and SoundCloud</small>
            </div>
            <div className='flex flex-col items-center justify-start gap-4 border-y border-y-slate-500 py-4'>
              <header className='flex flex-row justify-center items-center gap-3'>
                <span className='text-slate-800 dark:text-slate-200'>Choose who can see your post</span>
                <TbAsteriskSimple 
                  size={10} 
                  className='text-red-500 -left-0 top-0'
                />
              </header>
              <div className="flex flex-row justify-evenly items-center w-full">
                <div className="radio-group flex flex-row gap-1 text-slate-800 dark:text-slate-200">
                  <label htmlFor="isPrivate">
                    Private
                  </label>
                  <input required type="radio" name="privacyGroup" id="isPrivate" onChange={() =>setTopic({...topic, isPrivate: true})}/>
                </div>
                <div className="radio-group flex flex-row gap-1 text-slate-800 dark:text-slate-200">
                  <label htmlFor="isPublic">
                    Public
                  </label>
                  <input type="radio" name="privacyGroup" id="isPublic" checked={topic.isPrivate == false ? true : false} onChange={() => setTopic({...topic, isPrivate: false})} />
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
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                multiple={true}
              />
            </div>
            {/* Submit button  */}
            <div className='text-slate-800 dark:text-slate-200'>
              <button 
                type='submit' 
                className='outline outline-1 outline-red-500 px-2 py-1 rounded-md hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-200 disabled:outline-none' 
                disabled={buttonValue === 'Posting' ? true : false}
              >{buttonValue}</button>
            </div>
          </form>
          {/* <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className='hidden'
          /> */}
        </div>
      </div>
    </div>
  )
}
