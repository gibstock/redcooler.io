'use client'
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useUserStore } from '@/hooks/store';
import Button from '@/app/components/Button';
import PasswordInput from '@/app/components/PasswordInput';
import api from '@/api/api';
import EmailInput from '@/app/components/EmailInput';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');
  const [buttonValue, setButtonValue] = useState('Sign In')
  const userStore = useUserStore()
  const setUser = userStore.setUser;

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    setButtonValue("Checking Credentials...")
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
      <div className='w-[80%] lg:max-w-md lg:flex lg:flex-col lg:justify-center lg:items-stretch'>
        <h1 className='text-3xl text-slate-800 dark:text-slate-200 mb-8 text-center'>Welcome Back</h1>
        <form onSubmit={handleSubmit} className='flex flex-col items-stretch gap-8 lg:max-w-lg'>
          <EmailInput 
            email={email}
            setEmail={setEmail}
          />
          
          <PasswordInput 
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            password={password}
            setPassword={setPassword}
          />
          {error && <div className='text-red-500'>{error}</div>}
          {/* Submit button  */}
          <Button 
            label={buttonValue}
            bgColor='bg-blue-600'
            fontColor='text-white'
            padding='p-2'
            hover='hover:bg-blue-500'
            type='submit' 
            disabled={buttonValue === "Checking Credentials..." ? true : false}
            disabledConditions='disabled:bg-blue-200 disabled:cursor-wait'
          />
        </form>
      <div className='flex flex-col md:flex-row justify-center items-center gap-4 mt-8'>
        <h2 className='text-slate-500 dark:text-slate-300'>Need an account?</h2>
        <Button 
          label='Sign Up'
          onClick={handleSignUpRoute} 
          bgColor='bg-transparent'
          fontColor='text-blue-600'
          padding='px-3 py-1'
          hover='hover:text-black'
        />
      </div>
      </div>
    </div>
  )
}