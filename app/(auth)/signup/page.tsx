'use client';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import Button from '@/app/components/Button';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

import api from '@/api/api';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [reIsVisible, setReIsVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [buttonValue, setButtonValue] = useState('Sign Up');
  const [usernameAlert, setUsernameAlert] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUsernameAlert(false);
    if (password !== rePassword) {
      alert('Passwords must match');
      return;
    } else if (password.length < 8) {
      alert('Passwords must be at least 8 characters');
      return;
    } else {
      try {
        const usernameCheck = await api.checkUsernameExists(username);
        if (usernameCheck.length > 0) {
          setUsernameAlert(true);
          return;
        }
        setButtonValue('Signing up...');
        const res = await api.signUp({ email, password, username });
        console.log('sign up success');
        await api.signIn({ email, password });
        console.log('sign in success');
        await api.createUserProfile(
          username,
          email,
          'redcooler noob',
          'user',
          res.$id,
          '',
          ''
        );
        console.log('Profile creation success');
        await api.emailVerification('https://redcooler.net/verifyemail');
        console.log('Verification email sent');
        router.push('/awaitverify');
      } catch (err) {
        let message;
        if (err instanceof Error) message = err.message;
        else message = String(err);
        if (message.includes('email')) {
          setEmailError(true);
          setButtonValue('Sign Up');
          return;
        }
      }
    }
  };

  const handleSignInRoute = () => {
    router.push('/signin');
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="w-[80%] lg:max-w-md mt-8">
        <h1 className="text-3xl text-slate-800 dark:text-slate-200 mb-8 text-center">
          Welcome!
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="input-group group/username flex flex-col relative">
            <label htmlFor="username" hidden>
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="peer group-focus-within/username:outline-black bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-none focus-within:border-2 focus-within:border-blue-700 px-4 py-2 rounded-sm"
            />
            <div
              className="absolute left-4 -top-6 text-slate-500 dark:text-slate-400 peer-focus-within:text-slate-800"
              style={username.length > 0 ? { color: 'hsl(200, 80%, 60%)' } : {}}
            >
              Username
            </div>
            <div
              className={`username-alert text-red-700 text-sm ${
                usernameAlert === false ? 'hidden' : ''
              }`}
            >
              Username already exists, try again
            </div>
          </div>
          <div className="input-group group/email flex flex-col relative">
            <label htmlFor="email" hidden>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer group-focus-within/email:outline-black bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-none focus-within:border-2 focus-within:border-blue-700 px-4 py-2 rounded-sm"
            />
            <div
              className="email-error-message text-red-600"
              hidden={emailError ? false : true}
            >
              <small>A user with this email already exists</small>
            </div>
            <div
              className="absolute left-4 -top-6 text-slate-500 dark:text-slate-400 peer-focus-within:text-slate-800"
              style={email.length > 0 ? { color: 'hsl(200, 80%, 60%)' } : {}}
            >
              Email Address
            </div>
          </div>
          <div className="input-group group/password flex flex-col relative">
            <label htmlFor="password" hidden>
              Password
            </label>
            <input
              type={isVisible ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer group-focus-within/password:outline-black bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 focus-within:border-2 focus-within:border-blue-700 px-4 py-2 rounded-sm"
            />
            <div
              className="eye-wrapper text-blue-600 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? (
                <AiFillEye size={35} />
              ) : (
                <AiFillEyeInvisible size={35} />
              )}
            </div>
            <div
              className="absolute left-4 -top-6 text-slate-500 dark:text-slate-400 peer-focus-within:text-slate-800"
              style={password.length > 0 ? { color: 'hsl(200, 80%, 60%)' } : {}}
            >
              Password
            </div>
          </div>
          <div className="input-group group/repassword flex flex-col relative">
            <label htmlFor="password" hidden={true}>
              RePassword
            </label>
            <input
              type={reIsVisible ? 'text' : 'password'}
              id="repassword"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="peer group-focus-within/repassword:outline-black bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 focus-within:border-2 focus-within:border-blue-700 px-4 py-2 rounded-sm"
            />
            <div
              className="eye-wrapper text-blue-600 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setReIsVisible(!reIsVisible)}
            >
              {reIsVisible ? (
                <AiFillEye size={35} />
              ) : (
                <AiFillEyeInvisible size={35} />
              )}
            </div>
            <div
              className="absolute left-4 -top-6 text-slate-500 dark:text-slate-400 peer-focus-within:text-slate-800"
              style={
                rePassword.length > 0 ? { color: 'hsl(200, 80%, 60%)' } : {}
              }
            >
              Re-Type Password
            </div>
          </div>
          {/* Submit button  */}
          <Button
            label={buttonValue}
            bgColor="bg-blue-600"
            fontColor="text-white"
            padding="p-2"
            hover="hover:bg-blue-500"
            disabled={buttonValue === 'Signing up...' ? true : false}
            disabledConditions="disabled:bg-blue-200 disabled:cursor-not-allowed"
            type="submit"
          />
        </form>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
        <h2 className="text-slate-500 dark:text-slate-300">
          Already have an account?
        </h2>
        <button className="text-blue-600" onClick={handleSignInRoute}>
          Sign In
        </button>
      </div>
    </div>
  );
}
