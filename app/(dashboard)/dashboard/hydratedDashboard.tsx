import { dehydrate, Hydrate } from "@tanstack/react-query";
import getQueryClient from "@/utils/getQueryClient";
import Dashboard from "./page";
import api from "@/api/api";

export default async function HydratedDashboard() {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(['posts'], api.listAllTopics)
  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <Dashboard />
    </Hydrate>
  )
}
