'use client'
import React, { useState, useEffect} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {RxPerson, RxChevronDown, RxCross1} from 'react-icons/rx' 
import {FaQuoteLeft, FaQuoteRight} from 'react-icons/fa' 
import { BsFillMoonFill, BsSunFill} from 'react-icons/bs'
import Button from './button'
import { useRouter } from 'next/navigation'
import { useUserStore, darkModeStore } from '@/hooks/store'
import api from '@/api/api'

const NavBar = () => {
  const [menuPos, setMenuPos] = useState('[40vw]')
  const [overlayZ, setOverlayZ] = useState('-z-40')
  const router = useRouter();
  const userStore = useUserStore();
  const darkStore = darkModeStore();
  const dark = darkStore.dark;
  const toggleDarkMode = darkStore.toggleDarkMode;
  const user = userStore.user;
  const userProfile = userStore.userProfile;
  const userInitials = userStore.userInitials;
  const setUserInitials = userStore.setUserInitials;
  const setUser = userStore.setUser;

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

  useEffect(() => {
    const userInitials = async() => {
      if(user) {
        const userInitials = await api.getUserInitials(user.name)
        setUserInitials(userInitials)
      }
    }
    userInitials()
  }, [user])

  return (
    <nav className='relative z-50'>
      <div className="sticky-wrapper flex flex-row min-h-[8vh] w-full justify-between items-center px-4 shadow shadow-slate-300 mb-4 fixed top-0 left-0 right-0 bg-white dark:bg-dark-black">
        {user && (
          <>
            <div className={`profile-menu flex flex-col justify-evenly items-center absolute transition-all duration-500 top-0 -right-${menuPos} md:w-[40vw] w-[60vw] h-[100vh] bg-white dark:bg-dark-black z-50`} style={ menuPos === '[40vw]' ? {right: '-60vw'} : {right: '0'}}>
              <div className="close-menu-icon absolute text-slate-800 dark:text-slate-300 dark:hover:text-slate-600 hover:text-slate-200 top-4 right-4 pr-[2vw] cursor-pointer" onClick={handleOverlayClick}>
                <RxCross1  size={'5vw'} />
              </div>
              <div className="user flex flex-col justify-center items-center gap-4 text-slate-900 dark:text-slate-200">
                <div className="flair flex flex-row justify-center items-center gap-2">
                  <FaQuoteLeft />
                  {userProfile && userProfile[0].flair.length > 0 ? userProfile[0].flair : "noob"}
                  <FaQuoteRight />
                </div>
                <div className="avatar rounded-full relative cursor-pointer hover:opacity-80 active:opacity-50" onClick={handleProfileClick}>
                  {userProfile && userProfile[0].avatarHref.length > 10 ? 
                    (
                      userProfile && 
                      <Image 
                        src={userProfile[0].avatarHref}
                        alt='user avatar'
                        width={150}
                        height={150}
                        className='rounded-full'
                      />
                    )
                     : 
                    (
                      userInitials &&
                      <Image 
                        src={userInitials.href}
                        alt='user initials'
                        width={150}
                        height={150}
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
                <div className="dark-mode-group flex flex-col justify-center items-center gap-2">
                  <span>{dark? 'Use Light Mode' : 'Use Dark Mode'}</span>
                  <div className="dark-mode-icon border border-blue-200 p-2 rounded-lg cursor-pointer" onClick={toggleDarkMode}>
                  {!dark ? <BsFillMoonFill /> : <BsSunFill />}
                  </div>
                </div>
              </div>
              <div className="options"></div>
              <div className="policies text-slate-800 dark:text-slate-300">
                <span className='text-sm'>Policies</span>
                <hr className='w-1/2 border-slate-600 dark:border-slate-300' />
                <div className="links text-xs pt-4">
                  <Link href={'/content-guideline'}>
                    <span>Content Guidelines</span>
                  </Link>
                </div>
              </div>
              <div className="sign-out ">
                <Button 
                  label='Sign Out'
                  onClick={handleSignOut}
                  fontColor='text-white'
                  bgColor='bg-red-500'
                  padding='px-4 py-1'
                  hover='hover:bg-red-400'
                />
              </div>
            </div>
            <div className={`overlay absolute transition-all duration-500 top-0 left-0 h-screen w-screen ${overlayZ === 'z-40' ? 'opacity-60' : 'opacity-0'} ${overlayZ === 'z-40' ? '' : 'hidden'} bg-[hsl(0_0%_10%)] ${overlayZ}`} onClick={handleOverlayClick}></div>
          </>

        )}
        <div className="logo rounded-full">
          {dark ? (
            <Image 
              src='/rc-logo-black-bg.png'
              width={50}
              height={50}
              alt='The letters R and C with a pen and white background'
              onClick={() => router.push('/')}
              className='cursor-pointer'
              priority
            />
          ) : (
            <Image 
              src='/rc-logo-white-bg.png'
              width={50}
              height={50}
              alt='The letters R and C with a pen and white background'
              onClick={() => router.push('/')}
              className='cursor-pointer'
              priority
            />
          )}
        </div>
        <div className="login-profile flex flex-row gap-x-3">
          <div className="login-logout">
            {user ? (
              null
            ) : (
              <div className='flex flex-row justify-center items-center gap-4'>
                <div className='nav-sign-in'>
                  <Button 
                    label='Sign In'
                    onClick={handleLogin}
                    fontColor='text-white'
                    bgColor='bg-red-500'
                    hover='hover:bg-red-400'
                    padding=' px-4 py-1'
                  />
                </div>
                <div className={`dark-mode-icon ${dark? "text-white" : "text-black"} cursor-pointer`} onClick={toggleDarkMode}>
                  {!dark ? <BsFillMoonFill /> : <BsSunFill />}
                </div>
              </div>
            )}
          </div>
          <div className="profile-group flex flex-row justify-center items-center gap-x-1 px-1 hover:outline hover:outline-1 hover:outline-slate-300 cursor-pointer rounded-[4px] relative">
            <div>{user?.name}</div>
            <div className="avatar">
              {user && userProfile && userProfile[0].avatarHref.length > 10 ? (
                <Image 
                  src={userProfile[0].avatarHref}
                  alt='user avatar'
                  width={30}
                  height={30}
                  className='rounded-full'
                />
              ) : user && userInitials ? (
                <Image 
                  src={userInitials.href}
                  alt='user avatar'
                  width={30}
                  height={30}
                  className='rounded-full'
                />
              ) : (
                <RxPerson className={`${dark? "text-white" : "text-black"}`} size={22} />
              )}
            </div>
            {user && (
              <div className={`profile-dropdown ${dark ? 'text-white' : 'text-black'}`} onClick={handleProfileMenuClick}>
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