'use client'
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import WelcomePage from '@/app/components/WelcomePage';
import LoadingComponent from './components/LoadingComponent';
import api from '@/api/api';

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);

  console.log("Page Render")
  const router = useRouter();

  useEffect(() => {
    console.log("UseEffect Render")
    const user = async () => {
      console.log("User func runs")
      const user = await api.getUser();
      if(user) {
        console.log("found user")
        router.push('/dashboard')
      }
      if(!user) {
        setHasMounted(true);
        console.log("no user")
      }
    };
    user();

  }, [])

  if(!hasMounted) return <LoadingComponent />;

  return (
    <WelcomePage />
  )
}
