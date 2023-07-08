'use client'
import React, {useEffect} from 'react';
import { useRouter } from 'next/navigation';
import api from '@/api/api';

export default function CheckUser({children}: {children: React.ReactNode}) {
  const router = useRouter();

  useEffect(() => {
    const user = async () => {
      const user = await api.getUser();
      if(user) {
        router.push('/dashboard')
      }
    };
    user();
  }, [])

  return (
    <div>
      {children}
    </div>
  )
}