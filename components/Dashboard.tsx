'use client'
import api from "@/api/api"
import { useQuery } from "@tanstack/react-query"

export default function Dashboard() {
  const {data} = useQuery({queryKey: ['posts'], queryFn: api.listAllTopics})
  console.log("fr dashboard", data)
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}