import WelcomePage from '@/app/components/WelcomePage';
import getQueryClient from '@/utils/getQueryClient';
import { dehydrate, Hydrate } from "@tanstack/react-query";
import CheckUser from '@/utils/checkUser';
import ClientOnly from '@/utils/clientOnly';
import api from '@/api/api';


const preFetchLatest = async () => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(['latest'], api.fetchLatestPosts)
  const dehydratedState = dehydrate(queryClient)
  return dehydratedState
}

export default function Home() {

  return (
    <ClientOnly>
      <CheckUser>
        <Hydrate state={preFetchLatest()}>
          <WelcomePage />
        </Hydrate>
      </CheckUser>
    </ClientOnly>
)
}
