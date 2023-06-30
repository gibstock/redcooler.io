import React from 'react'
import Skeleton from '@/components/Skeleton'

const LoadingComponent = () => {
  return (
    <div className="grid grid-cols-12 my-40 md:mx-4">
      <div className="skeleton-wrapper col-start-1 md:col-start-3 col-span-12 md:col-span-5 flex flex-col justify-center items-center w-full gap-2">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    </div>
  )
}

export default LoadingComponent