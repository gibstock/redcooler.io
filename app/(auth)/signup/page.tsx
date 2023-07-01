"use client"
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import api from '@/api/api';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [username, setUsername] = useState('');
  const [buttonValue, setButtonValue] = useState('Sign Up')
  const [usernameAlert, setUsernameAlert] = useState(false)

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    setUsernameAlert(false)
    if(password !== rePassword) {
      alert("Passwords must match")
      return;
    } else if(password.length < 8) {
      alert("Passwords must be at least 8 characters")
      return;
    } else {
      try {
        const usernameCheck = await api.checkUsernameExists(username);
        if(usernameCheck.length > 0) {
          setUsernameAlert(true)
          return;
        }
        setButtonValue("Signing up...")
        const res = await api.signUp({email, password, username});
        console.log("sign up success")
        await api.signIn({email, password})
        console.log("sign in success")
        await api.createUserProfile(username,email,"redcooler noob",'user', res.$id,"", "")
        console.log("Profile creation success")
        await api.emailVerification("https://redcooler.io/verifyemail");
        console.log("Verification email sent")
        router.push('/awaitverify')
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
      <div className='w-[80%] lg:max-w-md mt-8'>
        <h1 className='text-3xl text-slate-800 dark:text-slate-200 mb-8 text-center'>Welcome!</h1>
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
              className='peer group-focus-within/username:outline-black bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-none focus-within:border-2 focus-within:border-blue-700 px-4 py-2 rounded-sm'
            />
            <div 
              className='absolute left-4 -top-6 text-slate-500 dark:text-slate-400 peer-focus-within:text-slate-800'
              style={username.length > 0 ? {color: 'hsl(200, 80%, 60%)'} : {}}
            >
                Username
            </div>
            <div className={`username-alert text-red-700 text-sm ${usernameAlert === false ? 'hidden':''}`}>
              Username already exists, try again
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
            <label htmlFor="password" hidden>
              Password
            </label>
            <input 
              type="password" 
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='peer group-focus-within/password:outline-black bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 focus-within:border-2 focus-within:border-blue-700 px-4 py-2 rounded-sm'
            />
            <div 
              className='absolute left-4 -top-6 text-slate-500 dark:text-slate-400 peer-focus-within:text-slate-800'
              style={password.length > 0 ? {color: 'hsl(200, 80%, 60%)'} : {}}
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
              className='peer group-focus-within/repassword:outline-black bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 focus-within:border-2 focus-within:border-blue-700 px-4 py-2 rounded-sm'
              />
            <div 
              className='absolute left-4 -top-6 text-slate-500 dark:text-slate-400 peer-focus-within:text-slate-800'
              style={rePassword.length > 0 ? {color: 'hsl(200, 80%, 60%)'} : {}}
            >
              Re-Type Password
            </div>
          </div>
          {/* Submit button  */}
          <button 
            type='submit' 
            className='text-white bg-blue-600 disabled:bg-blue-200 hover:bg-blue-500 cursor-pointer disabled:cursor-not-allowed p-2 flex flex-col justify-center items-center rounded-sm'
            disabled={buttonValue === "Signing up..." ? true : false}
          >
            {buttonValue}
          </button>
        </form>
      </div>
      <div className='flex flex-col md:flex-row justify-center items-center gap-4 mt-8'>
        <h2 className='text-slate-500 dark:text-slate-300'>Already have an account?</h2>
        <button className='text-blue-600' onClick={handleSignInRoute}>Sign In</button>
      </div>
    </div>
  )
}