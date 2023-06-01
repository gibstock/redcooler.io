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
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">
              Email
            </label>
            <input 
              type="email" 
              id='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">
              Password
            </label>
            <input 
              type="password" 
              id='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Submit button  */}
          <div>
            <button type='submit'>Sign In</button>
          </div>
        </form>
      </div>
      <div>
        <h2>Need an account?</h2>
        <button onClick={handleSignUpRoute}>Sign Up</button>
      </div>
    </div>
  )
}