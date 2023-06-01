import React, {Suspense} from "react"
import Loading from "./loading"
import Dashboard from "./page"

export default function DashboardLayout({
  children,
} : {
  children: React.ReactNode
}) {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Dashboard />
      </Suspense>
    </>
  )
}