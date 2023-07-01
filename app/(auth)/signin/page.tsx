'use client'
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useUserStore } from '@/hooks/store';

import api from '@/api/api';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [buttonValue, setButtonValue] = useState('Sign In')
  const setUser = useUserStore(state => state.setUser)
  const setUserProfile = useUserStore(state => state.setUserProfile);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    setButtonValue("Checking Credentials...")
    try {
      const userSignIn = await api.signIn({email, password});
      setUser(userSignIn)
      // const userProfile = await api.getUserProfile(userSignIn.$id)
      // setUserProfile(userProfile)
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
      <div className='w-[80%] lg:max-w-md lg:flex lg:flex-col lg:justify-center lg:items-stretch'>
        <h1 className='text-3xl text-slate-800 dark:text-slate-200 mb-8 text-center'>Welcome Back</h1>
        <form onSubmit={handleSubmit} className='flex flex-col items-stretch gap-8 lg:max-w-lg'>
          <div className='input-group group/email flex flex-col relative'>
            <label htmlFor="email" hidden={true}>
              Email
            </label>
            <input 
              type="email" 
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='peer group-focus-within/email:outline-black bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-none focus-within:border-2 focus-within:border-blue-700 px-4 py-2 rounded-sm'
            />
            <div 
              className='absolute left-4 -top-6 text-slate-500 dark:text-slate-400 peer-focus-within:text-slate-800'
              style={email.length > 0 ? {color: 'hsl(200, 80%, 60%)'} : {}}
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
              className='peer group-focus-within/password:outline-black bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-none focus-within:border-2 focus-within:border-blue-700 px-4 py-2 rounded-sm'
              />
            <div 
              className='absolute left-4 -top-6 text-slate-500 dark:text-slate-400 peer-focus-within:text-slate-800'
              style={password.length > 0 ? {color: 'hsl(200, 80%, 60%)'} : {}}
            >
              Password
            </div>
          </div>
          
          {error && <div className='text-red-500'>{error}</div>}
          {/* Submit button  */}
          <button 
            type='submit' 
            disabled={buttonValue === "Checking Credentials..." ? true : false}
            className='bg-blue-600 hover:bg-blue-500 disabled:bg-blue-200 cursor-pointer p-2 flex flex-col justify-center items-center rounded-sm text-white disabled:cursor-wait'>{buttonValue}</button>
        </form>
      <div className='flex flex-col md:flex-row justify-center items-center gap-4 mt-8'>
        <h2 className='text-slate-500 dark:text-slate-300'>Need an account?</h2>
        <button className='text-blue-600' onClick={handleSignUpRoute}>Sign Up</button>
      </div>
      </div>
    </div>
  )
}