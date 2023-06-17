'use client'
import React, { useState} from 'react'
import Image from 'next/image'
import {RxPerson, RxChevronDown, RxCross1} from 'react-icons/rx'  
import Button from './button'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/hooks/store'
import api from '@/api/api'

const NavBar = () => {
  const [menuPos, setMenuPos] = useState('[40vw]')
  const [overlayZ, setOverlayZ] = useState('-z-40')
  const router = useRouter();
  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);

  console.log(user)

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

  return (
    <nav className='relative z-50'>
      <div className="sticky-wrapper flex flex-row min-h-[8vh] w-full justify-between items-center px-4 shadow shadow-slate-300 mb-4 fixed top-0 left-0 right-0 bg-white">
        <div className={`profile-menu flex flex-col justify-evenly items-center absolute transition-all duration-500 top-0 -right-${menuPos} w-[40vw] h-[100vh] bg-[hsl(0_0%_10%)] z-50`} style={ menuPos === '[40vw]' ? {right: '-40vw'} : {right: '-16px'}}>
          <div className="close-menu-icon absolute text-slate-300 hover:text-slate-200 top-4 right-4 pr-[2vw] cursor-pointer" onClick={handleOverlayClick}>
            <RxCross1  size={'5vw'} />
          </div>
          <div className="user flex flex-col justify-center items-center gap-4 text-slate-200">
            <div className="avatar border border-slate-200 rounded-full w-[20vw] h-[20vw] relative">
              <Image 
                src='/avatar-placeholder.jpg'
                alt='wolverine toy'
                className='rounded-full'
                fill
              />
            </div>
            <div className="username">
              {user?.name}
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
        <div className={`overlay absolute transition-all duration-500 top-0 left-0 h-screen w-screen ${overlayZ === 'z-40' ? 'opacity-60' : 'opacity-0'} bg-[hsl(0_0%_10%)] ${overlayZ}`} onClick={handleOverlayClick}></div>
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
              <RxPerson size={22} />
            </div>
            <div className="profile-dropdown" onClick={handleProfileMenuClick}>
              <RxChevronDown size={22} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar