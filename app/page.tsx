"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WelcomePage from '@/components/WelcomePage';
import getQueryClient from '@/utils/getQueryClient';
import { dehydrate, Hydrate } from "@tanstack/react-query";
import api from '@/api/api';


const preFetchLatest = async () => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(['latest'], api.fetchLatestPosts)
  return dehydrate(queryClient)
}

export default function Home() {
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
    <Hydrate state={preFetchLatest()}>
      <WelcomePage />
    </Hydrate>
)
}
