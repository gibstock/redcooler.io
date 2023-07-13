import React from 'react'
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai'

type AppProps = {
  isVisible: boolean,
  setIsVisible: (value: boolean) => void,
  password: string,
  setPassword: (value: string) => void
}

const PasswordInput = ({isVisible, setIsVisible, password, setPassword}: AppProps) => {
  return (
    <div className='input-group group/password flex flex-col relative'>
            <label htmlFor="password" hidden={true}>
              Password
            </label>
            <input 
              type={isVisible ? 'text' : 'password'} 
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='peer group-focus-within/password:outline-black bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-none focus-within:border-2 focus-within:border-blue-700 px-4 py-2 rounded-sm'
              />
              <div className="eye-wrapper text-blue-600 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => setIsVisible(!isVisible)}>
                {isVisible ? (
                <AiFillEye size={35} />
              ) : (
                <AiFillEyeInvisible size={35} />
              )}
              </div>
            <div 
              className='absolute left-4 -top-6 text-slate-500 dark:text-slate-400 peer-focus-within:text-slate-800'
              style={password.length > 0 ? {color: 'hsl(200, 80%, 60%)'} : {}}
            >
              Password
            </div>
          </div>
  )
}

export default PasswordInput