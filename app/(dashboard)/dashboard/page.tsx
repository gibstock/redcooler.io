'use client'
import { dehydrate, Hydrate } from "@tanstack/react-query";
import getQueryClient from '@/utils/getQueryClient';
import DashboardComponent from '@/components/DashboardComponent';
import api from '@/api/api';

const preFetchPosts = async () => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(['posts'], api.listAllTopics)
  return dehydrate(queryClient)
}


export default function Dashboard() {

  return (
    <Hydrate state={preFetchPosts()}>
      <DashboardComponent />
    </Hydrate>
  )
}
