'use client'
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useUserStore } from '@/hooks/store';

import api from '@/api/api';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const setUser = useUserStore(state => state.setUser)

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    try {
      const userSignIn = await api.signIn({email, password});
      setUser(userSignIn)
      window.location.replace('/dashboard')
    }catch (err) {
      console.error(err)
      setError("Inavlid Credentials. Please check email and password");
    }
  };

  const handleSignUpRoute = () => {
    router.push('/signup');
  }

  return (
    <div className='flex flex-row justify-center items-center w-screen h-screen'>
      <div className='w-1/2'>
        <h1 className='text-3xl text-slate-200 mb-8 text-center'>Welcome Back</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='input-group group/email flex flex-col relative'>
            <label htmlFor="email" hidden={true}>
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
              className='absolute left-4 -top-6  text-slate-400 peer-focus-within:text-slate-200'
              style={email.length > 0 ? {color: 'green'} : {}}
            >
                Email Address
            </div>
          </div>
          <div className='input-group group/password flex flex-col relative'>
            <label htmlFor="password" hidden={true}>
              Password
            </label>
            <input 
              type="password" 
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='peer group-focus-within/password:outline-black bg-slate-800 text-slate-300 outline outline-2 outline-blue-500 border-2 focus-within:border-yellow-300 px-4 py-2 rounded-sm'
              />
            <div 
              className='absolute left-4 -top-6 bg-slate-800 text-slate-400 peer-focus-within:text-slate-200'
              style={password.length > 0 ? {color: 'green'} : {}}
            >
              Password
            </div>
          </div>
          
          {error && <div>{error}</div>}
          {/* Submit button  */}
          <div className='bg-blue-600 hover:bg-blue-500 cursor-pointer p-2 flex flex-col justify-center items-center rounded-sm'>
            <button type='submit' className='text-white'>Sign In</button>
          </div>
        </form>
      <div className='flex flex-row justify-center items-center gap-4'>
        <h2 className='text-slate-300'>Need an account?</h2>
        <button className='text-blue-600' onClick={handleSignUpRoute}>Sign Up</button>
      </div>
      </div>
    </div>
  )
}