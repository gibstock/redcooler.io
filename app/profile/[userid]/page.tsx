'use client'
import React, {ChangeEvent ,useRef, useState, useEffect} from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { RiPencilFill } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import { useUserStore } from '@/hooks/store';

import api from '@/api/api';

const ProfilePage = () => {
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const flairInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File>();
  const [imgPreview, setImgPreview] = useState<string | null>(null)
  const userStore = useUserStore()
  const userProfile = userStore.userProfile;
  const userInitials = userStore.userInitials;
  const [name, setName] = useState("")
  const [flair, setFlair] = useState("")
  const [modal, setModal] = useState(false);
  const [buttonValue, setButtonValue] = useState('Save');


  const router = useRouter()
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  }

  useEffect(() => {
    userProfile && userProfile[0].name.length > 0 && setName(userProfile[0].name)
    userProfile && userProfile[0].name.length > 0 && setFlair(userProfile[0].flair)
  }, [userProfile])
  
  const handlefileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files) {
      return;
    }
    setImgPreview(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  }

  const handleSubmitDetails = async() => {
    // check if the user is adding an avatar
    // if exists delete old photo
    // upload new photo
    // get new avatarId
    // update profile name, flair, avatarId
    // update account name
    try{
      if(!userProfile) throw Error;
      setButtonValue("Saving...")
      if(file !== undefined) {
        if(userProfile[0].avatarId.length > 0) {
          await api.deleteProfilePhoto(userProfile[0].avatarId)
        }
        const res = await api.uploadPhoto(file!);
        const avatarUrl = await api.getAvatarById(res.$id);
        await api.updateProfile(userProfile[0].$id, name, flair, res.$id, avatarUrl.href);
      } else {
        await api.updateProfile(userProfile[0].$id, name, flair);
      }
      await api.updateName(name);
      await api.updateNameInConversationByUserId(userProfile[0].userId, name)
      await api.updateNameInTopicByUserId(userProfile[0].userId, name)
      setModal(false)
      window.location.reload()
    }catch(err) {
      console.error(err)
      alert("Something went wrong. Please contact admin: andre@agonzales.dev")
    }
  }

  return (
    <div className='h-screen w-full flex justify-center items-center text-white'>
      <div className="card-wrapper relative w-full md:w-3/4">
        <div className="profile-card p-4 md:p-8">
          <div className="top w-full flex flex-col justify-center items-center gap-3 shadow shadow-slate-300 rounded-md p-4">
            <div className="icons w-full flex flex-row justify-between items-center">
              <div className="close-icon cursor-pointer hover:opacity-70" onClick={() => router.push('/dashboard')}>
                <RxCross2 size={32} />
              </div>
              <div className="edit-icon cursor-pointer hover:opacity-70" onClick={() => setModal(!modal)}>
                <RiPencilFill />
              </div>
            </div>
            <div className="avatar">
              {userProfile && userProfile[0].avatarHref.length < 1 ? (
                userInitials &&
                  <Image 
                    src={userInitials.href}
                    alt='user initials'
                    width={200}
                    height={200}
                    className='rounded-full'
                  />
                ) : (
                userProfile && 
                  <Image 
                    src={userProfile[0].avatarHref}
                    alt='user avatar'
                    width={200}
                    height={200}
                    className='rounded-full'
                    priority
                  />
                )
              }
            </div>
            <div className="name">
              {userProfile && userProfile[0].name}
            </div>
            <div className="flair">
              {userProfile && userProfile[0].flair}
            </div>
            <div className="email">
              {userProfile && userProfile[0].email}
            </div>
          </div>
          <div className="bottom"></div>
        </div>
        {modal && 
        <div className="edit-profile-modal">
          <div className="modal-wrapper flex flex-col justify-center items-center gap-4 absolute top-0 left-0 bg-slate-800 w-full p-8 rounded-sm shadow-lg shadow-slate-900">
            <div className="icons self-stretch flex flex-row justify-between items-center">
              <div className="title text-sm">
                Edit Profile Details
              </div>
              <div className="close-icon  cursor-pointer hover:opacity-70"  onClick={() => setModal(false)}>
                <RxCross2 size={30} />
              </div>
            </div>
            <div className="avatar flex flex-col justify-center items-center">
              { imgPreview !== null ? (
                <Image 
                src={imgPreview}
                alt='user avatar'
                width={200}
                height={200}
                className='rounded-full cursor-pointer'
                onClick={handleUploadClick}

              />
              ) :
                userProfile && userProfile[0].avatarHref.length < 2 ? (
                  userInitials &&
                    <Image 
                      src={userInitials.href}
                      alt='user initials'
                      width={200}
                      height={200}
                      className='rounded-full cursor-pointer'
                      onClick={handleUploadClick}
                    />
                  ) : (
                  userProfile && 
                    <Image 
                      src={userProfile[0].avatarHref}
                      alt='user avatar'
                      width={200}
                      height={200}
                      className='rounded-full cursor-pointer'
                      onClick={handleUploadClick}
  
                    />
                  )
              }
              <button onClick={handleUploadClick}>
              {file? `${file.name}` : <div className='text-sm'>Click to select photo <br /> Accepted Filetypes: png, jpg, jpeg, svg <br />(must be less than 10mb, square ratio works best)</div>}
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                className='hidden'
                onChange={handlefileChange}
              />
            </div>
            <div className="username flex flex-col sm:flex-row sm:justify-start justify-between items-center w-3/4 gap-3">
              <label htmlFor="name" className='self-start'>Username</label>
              <input 
                required
                name='name'
                type="text" 
                ref={nameInputRef}
                value={name}
                className='text-slate-800 px-2 py-1 rounded-sm sm:w-full'
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flair flex flex-col sm:flex-row sm:justify-start justify-between items-center w-3/4 sm:gap-[3.75rem]">
              <label htmlFor="flair" className='self-start'>Flair</label>
              <input 
                required
                name='flair'
                type="text" 
                ref={flairInputRef}
                value={flair}
                className='text-slate-800 px-2 py-1 rounded-sm sm:w-full'
                onChange={(e) => setFlair(e.target.value)}
              />
            </div>
            <button 
              className='bg-blue-500 hover:bg-blue-400 px-4 py-1 hover:text-slate-700 disabled:cursor-wait rounded-lg' 
              onClick={handleSubmitDetails}
              disabled={buttonValue === 'Saving...' ? true : false}
            >
                {buttonValue}
              </button>
          </div>
        </div>}
      </div>
    </div>
  )
}

export default ProfilePage