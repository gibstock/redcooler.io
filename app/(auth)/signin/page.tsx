'use client'
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import api from '@/api/api';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement> ) => {
    e.preventDefault();

    try {
      await api.signIn({email, password});

      router.push('/dashboard');
    }catch {
      console.log('Error signing in');
    }
  };

  const handleSignUpRoute = () => {
    router.push('/signup');
  }

  return (
    <div className='flex flex-row justify-center items-center w-screen h-screen'>
      <div className='w-1/2'>
        <h1 className='text-3xl mb-8 text-center'>Welcome Back</h1>
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
              className='peer group-focus-within/email:outline-black outline outline-blue-300 px-4 py-2 rounded-sm'
            />
            <div className='absolute left-4 top-2 bg-white text-slate-400 peer-focus-within:-top-4'>Email Address</div>
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
              className='peer group-focus-within/password:outline-black outline outline-blue-300 px-4 py-2 rounded-sm'
            />
            <div className='absolute left-4 top-2 bg-white text-slate-400 peer-focus-within:-top-4'>Password</div>
          </div>
          {/* Submit button  */}
          <div className='bg-blue-600 hover:bg-blue-500 cursor-pointer p-2 flex flex-col justify-center items-center rounded-sm'>
            <button type='submit' className='text-white'>Sign In</button>
          </div>
        </form>
      <div className='flex flex-row justify-center items-center gap-4'>
        <h2>Need an account?</h2>
        <button className='text-blue-600' onClick={handleSignUpRoute}>Sign Up</button>
      </div>
      </div>
    </div>
  )
}