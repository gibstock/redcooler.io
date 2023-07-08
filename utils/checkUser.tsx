'use client'
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import api from '@/api/api';

export default function CheckUser({children}: {children: React.ReactNode}) {
  const [hasMounted, setHasMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const user = async () => {
      const user = await api.getUser();
      if(user) {
        router.push('/dashboard')
      }
    };
    user();
    setHasMounted(true);

  }, [])

  if(!hasMounted) return null;

  return (
    <div>
      {children}
    </div>
  )
}