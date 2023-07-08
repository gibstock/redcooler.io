import { dehydrate, Hydrate } from "@tanstack/react-query";
import getQueryClient from '@/utils/getQueryClient';
import DashboardComponent from '@/app/components/DashboardComponent';
import ClientOnly from "@/utils/clientOnly";
import api from '@/api/api';

const preFetchPosts = async () => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(['posts'], api.listAllTopics)
  const dehydratedState = dehydrate(queryClient)
  return dehydratedState
}


export default function Dashboard() {

  return (
    <ClientOnly>
      <Hydrate state={preFetchPosts()}>
        <DashboardComponent />
      </Hydrate>
    </ClientOnly>
  )
}
