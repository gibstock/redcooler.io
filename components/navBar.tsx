'use client'
import React from 'react'
import Image from 'next/image'
import {RxPerson, RxChevronDown} from 'react-icons/rx'  
import Button from './button'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/hooks/store'
import api from '@/api/api'

const NavBar = () => {

  const router = useRouter();
  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);

  const handleLogin = () => {
    router.push('/signin')
  }
  const handleSignOut = async () => {
    api.signOut();
    setUser(null);
    router.push('/')
  }

  return (
    <nav className='relative'>
      <div className="sticky-wrapper flex flex-row min-h-[8vh] w-full justify-between items-center px-4 shadow shadow-slate-300 mb-4 fixed top-0 left-0 right-0 bg-white">
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
          <div className="login-logout bg-red-500 hover:bg-red-400 cursor-pointer rounded-full flex justify-center items-center px-4 py-1">
            {user ? (
              <Button 
              label='Sign Out'
              onClick={handleSignOut}
            />
            ) : (
              <Button 
                label='Sign In'
                onClick={handleLogin}
              />
            )}
          </div>
          <div className="profile-group flex flex-row justify-center items-center gap-x-1 px-1 hover:outline hover:outline-1 hover:outline-slate-300 cursor-pointer rounded-[4px]">
            <div>{user?.name}</div>
            <div className="avatar">
              <RxPerson size={22} />
            </div>
            <div className="profile-dropdown">
              <RxChevronDown size={22} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar