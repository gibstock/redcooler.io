import React from 'react'

const AwaitVerify = () => {
  return (
    <div className='h-screen w-full flex flex-row justify-center items-center text-slate-200'>
      <div className="await-message bg-slate-900 lg:max-w-lg p-4">
        <p>A verfication email has been sent to the account you provided. Please click the link in the email and you&apos;ll be redirected to your new Redcooler dashboard.</p>
        <p>You can close this tab.</p>
      </div>
    </div>
  )
}

export default AwaitVerify