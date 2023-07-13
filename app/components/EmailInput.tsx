import React from 'react'

type AppProps = {
  email: string,
  setEmail: (value: string) => void
}

const EmailInput = ({email, setEmail}:AppProps) => {
  return (
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
  )
}

export default EmailInput