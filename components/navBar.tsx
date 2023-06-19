'use client'
import React, { useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {RxPerson, RxChevronDown, RxCross1} from 'react-icons/rx' 
import {FaQuoteLeft, FaQuoteRight} from 'react-icons/fa' 
import Button from './button'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/hooks/store'
import api from '@/api/api'

const NavBar = () => {
  const [menuPos, setMenuPos] = useState('[40vw]')
  const [overlayZ, setOverlayZ] = useState('-z-40')
  const router = useRouter();
  const user = useUserStore(state => state.user);
  const userProfile = useUserStore(state => state.userProfile)
  const userAvatar = useUserStore(state => state.userAvatar);
  const userInitials = useUserStore(state => state.userInitials)
  const setUser = useUserStore(state => state.setUser);

  const handleLogin = () => {
    router.push('/signin')
  }
  const handleSignOut = async () => {
    api.signOut();
    setUser(null);
    router.push('/')
  }

  const handleProfileMenuClick = () => {
    setMenuPos('4')
    setOverlayZ('z-40')
  }

  const handleOverlayClick = () => {
    setMenuPos('[40vw]')
    setOverlayZ('-z-40')
  }

  const handleProfileClick = () => {
    setMenuPos('[40vw]')
    setOverlayZ('-z-40')
    router.push(`/profile/${user?.$id}`)
  }

  return (
    <nav className='relative z-50'>
      <div className="sticky-wrapper flex flex-row min-h-[8vh] w-full justify-between items-center px-4 shadow shadow-slate-300 mb-4 fixed top-0 left-0 right-0 bg-white">
        {user && (
          <>
            <div className={`profile-menu flex flex-col justify-evenly items-center absolute transition-all duration-500 top-0 -right-${menuPos} md:w-[40vw] w-[60vw] h-[100vh] bg-[hsl(0_0%_10%)] z-50`} style={ menuPos === '[40vw]' ? {right: '-60vw'} : {right: '0'}}>
              <div className="close-menu-icon absolute text-slate-300 hover:text-slate-200 top-4 right-4 pr-[2vw] cursor-pointer" onClick={handleOverlayClick}>
                <RxCross1  size={'5vw'} />
              </div>
              <div className="user flex flex-col justify-center items-center gap-4 text-slate-200">
                <div className="flair flex flex-row justify-center items-center gap-2">
                  <FaQuoteLeft />
                  {userProfile && userProfile[0].flair.length > 0 ? userProfile[0].flair : "noob"}
                  <FaQuoteRight />
                </div>
                <div className="avatar rounded-full relative cursor-pointer hover:opacity-80 active:opacity-50" onClick={handleProfileClick}>
                  {userAvatar?.length === undefined ? 
                    (
                      userInitials &&
                      <Image 
                        src={userInitials.href}
                        alt='user initials'
                        width={200}
                        height={200}
                        className='rounded-full'
                      />
                    ) : 
                    (
                      userAvatar && 
                      <Image 
                        src={userAvatar}
                        alt='user avatar'
                        width={200}
                        height={200}
                        className='rounded-full'
                      />
                    )
                  }
                </div>
                <div className="username">
                  {user.name}
                </div>
                <div className="joined-on text-slate-400 text-xs">
                  Joined {new Date(user?.registration!).toDateString()}
                </div>
              </div>
              <div className="options"></div>
              <div className="sign-out bg-red-500 hover:bg-red-400 cursor-pointer rounded-full flex justify-center items-center px-4 py-1">
                <Button 
                  label='Sign Out'
                  onClick={handleSignOut}
                />
              </div>
            </div>
            <div className={`overlay absolute transition-all duration-500 top-0 left-0 h-screen w-screen ${overlayZ === 'z-40' ? 'opacity-60' : 'opacity-0'} ${overlayZ === 'z-40' ? '' : 'hidden'} bg-[hsl(0_0%_10%)] ${overlayZ}`} onClick={handleOverlayClick}></div>
          </>

        )}
        <div className="logo rounded-full">
          <Image 
            src='/rc-logo-white-bg.png'
            width={50}
            height={50}
            alt='The letters R and C with a pen and white background'
            onClick={() => router.push('/')}
            className='cursor-pointer'
          />
        </div>
        <div className="login-profile flex flex-row gap-x-3">
          <div className="login-logout">
            {user ? (
              null
            ) : (
              <div className='bg-red-500 hover:bg-red-400 cursor-pointer rounded-full flex justify-center items-center px-4 py-1'>
                <Button 
                  label='Sign In'
                  onClick={handleLogin}
                />
              </div>
            )}
          </div>
          <div className="profile-group flex flex-row justify-center items-center gap-x-1 px-1 hover:outline hover:outline-1 hover:outline-slate-300 cursor-pointer rounded-[4px] relative">
            <div>{user?.name}</div>
            <div className="avatar">
              {userAvatar ? (
                <Image 
                  src={userAvatar}
                  alt='user avatar'
                  width={50}
                  height={50}
                  className='rounded-full'
                />
              ) : (
                <RxPerson size={22} />
              )}
            </div>
            {user && (
              <div className="profile-dropdown" onClick={handleProfileMenuClick}>
                <RxChevronDown size={22} />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar