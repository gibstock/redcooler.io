"use client"
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import api from '@/api/api';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [username, setUsername] = useState('');

  const router = useRouter();

  type Err = {

  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    if(password !== rePassword) {
      alert("Passwords must match")
    } else if(password.length < 8) {
      alert("Passwords must be at least 8 characters")
    } else {
      try {
        await api.signUp({email, password, username});
        window.location.replace('/dashboard')
      }catch(err) {
        console.log('Error signing up ', {err});
      }
    }
  };

  const handleSignInRoute = () => {
    router.push('/signin');
  }

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center'>
      <div className='w-1/2'>
        <h1 className='text-3xl text-slate-200 mb-8 text-center'>Welcome!</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='input-group group/username flex flex-col relative'>
            <label htmlFor="username" hidden>
              Username
            </label>
            <input 
              type="text" 
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='peer group-focus-within/username:outline-black bg-slate-800 text-slate-300 outline outline-2 border-2 focus-within:border-yellow-300 outline-blue-500 px-4 py-2 rounded-sm'
            />
            <div 
              className='absolute left-4 -top-6 text-slate-400 peer-focus-within:text-slate-200'
              style={username.length > 0 ? {color: 'green'} : {}}
            >
                Username
            </div>
          </div>
          <div className='input-group group/email flex flex-col relative'>
            <label htmlFor="email" hidden>
              Email
            </label>
            <input 
              type="email" 
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='peer group-focus-within/email:outline-black bg-slate-800 text-slate-300 outline outline-2 border-2 focus-within:border-yellow-300 outline-blue-500 px-4 py-2 rounded-sm'
            />
            <div 
              className='absolute left-4 -top-6 text-slate-400 peer-focus-within:text-slate-200'
              style={email.length > 0 ? {color: 'green'} : {}}
            >
                Email Address
            </div>
          </div>
          <div className='input-group group/password flex flex-col relative'>
            <label htmlFor="password" hidden>
              Password
            </label>
            <input 
              type="password" 
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='peer group-focus-within/password:outline-black bg-slate-800 text-slate-300 outline outline-2 border-2 focus-within:border-yellow-300 outline-blue-500 px-4 py-2 rounded-sm'
            />
            <div 
              className='absolute left-4 -top-6 text-slate-400 peer-focus-within:text-slate-200'
              style={password.length > 0 ? {color: 'green'} : {}}
            >
              Password
            </div>
          </div>
          <div className='input-group group/repassword flex flex-col relative'>
            <label htmlFor="password" hidden={true}>
              RePassword
            </label>
            <input 
              type="password" 
              id='repassword'
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              className='peer group-focus-within/repassword:outline-black bg-slate-800 text-slate-300 outline outline-2 border-2 focus-within:border-yellow-300 outline-blue-500 px-4 py-2 rounded-sm'
              />
            <div 
              className='absolute left-4 -top-6 text-slate-400 peer-focus-within:text-slate-200'
              style={rePassword.length > 0 ? {color: 'green'} : {}}
            >
              Re-Type Password
            </div>
          </div>
          {/* Submit button  */}
          <div className='bg-blue-600 hover:bg-blue-500 cursor-pointer p-2 flex flex-col justify-center items-center rounded-sm'>
            <button type='submit' className='text-white'>Sign Up</button>
          </div>
        </form>
      </div>
      <div className='flex flex-row justify-center items-center gap-4'>
        <h2 className='text-slate-300'>Already have an account?</h2>
        <button className='text-blue-600' onClick={handleSignInRoute}>Sign In</button>
      </div>
    </div>
  )
}