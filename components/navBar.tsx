import React from 'react'
import Image from 'next/image'
import {RxPerson, RxChevronDown} from 'react-icons/rx'  

const NavBar = () => {
  return (
    <nav className='flex flex-row w-full justify-between items-center px-4 shadow shadow-slate-300 mb-4'>
      <div className="logo rounded-full">
        <Image 
          src='/rc-logo-white-bg.png'
          width={50}
          height={50}
          alt='The letters R and C with a pen and white background'
        />
      </div>
      <div className="login-profile flex flex-row gap-x-3">
        <div className="login-logout bg-red-500 hover:bg-red-400 cursor-pointer rounded-full flex justify-center items-center px-4 py-1">
          <button className='text-white font-bold flex flex-row justify-center items-center'>
            <span>Log In</span>
          </button>
        </div>
        <div className="profile-group flex flex-row justify-center items-center gap-x-1 px-1 hover:outline hover:outline-1 hover:outline-slate-300 cursor-pointer rounded-[4px]">
          <div className="avatar">
            <RxPerson size={22} />
          </div>
          <div className="profile-dropdown">
            <RxChevronDown size={22} />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar