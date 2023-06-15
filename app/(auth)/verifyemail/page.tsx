'use client';
import React, {useEffect} from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import api from '@/api/api'

const VerifyEmail = () => {

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const userId = searchParams.get('userId')
    const secret = searchParams.get('secret')
    const completeEmailVerification = async () => {
      try{
        userId && secret && await api.completeEmailVerification({userId, secret})
        router.push('/dashboard')
      }catch (err) {
        console.error(err);
      }
    }

    completeEmailVerification();
  }, [router, searchParams])

  return (
    <div className='h-screen w-full flex flex-row justify-center items-center text-slate-200'>
      <div className="await-message bg-slate-900 lg:max-w-lg p-4">
        <p>Thank you for verifying your account!.</p>
        <p>You will be automatically redirected to your dashboard.</p>
      </div>
    </div>
  )
}

export default VerifyEmail