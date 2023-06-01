"use client"
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import api from '@/api/api';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement> ) => {
    e.preventDefault();

    try {
      await api.signUp({email, password, username});

      router.push('/dashboard');
    }catch(err) {
      console.log('Error signing up ', err);
    }
  };

  const handleSignInRoute = () => {
    router.push('/signin');
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">
              Username
            </label>
            <input 
              type="text" 
              id='username'
              placeholder='Enter your username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
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
            <button type='submit'>Sign Up</button>
          </div>
        </form>
      </div>
      <div>
        <h2>Already have an account?</h2>
        <button onClick={handleSignInRoute}>Sign In</button>
      </div>
    </div>
  )
}