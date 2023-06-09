'use client'
import React, {useState} from 'react'
import { useQuery, dehydrate, Hydrate} from '@tanstack/react-query';
import Image from 'next/image'
import Link from 'next/link'
import getQueryClient from '@/utils/getQueryClient';
import { useRouter } from 'next/navigation'
import LatestTopicCard from './LatestTopicCard';
import Button from './Button'
import LoadingComponent from './LoadingComponent';
import {BsArrowDownCircleFill} from 'react-icons/bs'
import { useUserStore } from '@/hooks/store'
import api from '@/api/api'

export async function getStaticProps() {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(['latest'], api.fetchLatestPosts)

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}

const WelcomePage = () => {
  const [buttonValue, setButtonValue] = useState("Join Now")
  const [guestButtonValue, setGuestButtonValue] = useState('Guest Sign In')
  const userStore = useUserStore()
  const setUser = userStore.setUser;

  const {data: latestPosts, isLoading} = useQuery({queryKey: ['latest'], queryFn: api.fetchLatestPosts})

  const router = useRouter()

  const handleSignUpRoute = () => {
    setButtonValue("...")
    router.push('/signup')
  }
  const handleGuestSignIn = async() => {
    setGuestButtonValue("Logging in...");
    try {
      const userSignIn = await api.signIn({email:'guest@agonzales.dev', password:'redcooler'});
      setUser(userSignIn)
      window.location.replace('/dashboard')
    }catch(err) {
      console.error(err)
    }
  }

  return (
    <main className='lg:p-5 p-0 w-full md:w-[80%] mx-0 md:mx-auto'>
      <section className="welcome flex flex-col justify-center items-center mt-16">
        <h1 className='text-3xl text-center md:text-5xl text-slate-800 dark:text-slate-200 font-bold mt-8 pb-8'>Welcome to <span className='text-red-500'>RedCooler.io</span></h1>
        <p className='m-0 pb-8 text-center text-xl md:text-2xl text-slate-700 dark:text-slate-300'>A place to write, share, and collab</p>
      </section>
      <div className="hero-banner flex flex-row justify-center items-center w-full">
        <Image 
          src='/banner-placeholder.jpg'
          width={640}
          height={427}
          alt='A pad of paper with a pen in the middle'
        />
      </div>
      <section className="latest-threads flex flex-col justify-center items-center mt-12">
        <h2 className=' text-3xl md:text-5xl text-slate-800 dark:text-slate-200 font-bold m-0 pb-8'>Latest Posts</h2>
        <p className='m-0 pb-8 text-xl md:text-2xl text-slate-700 dark:text-slate-300'>See what&apos;s going down</p>
        <div className="down-icon">
          <BsArrowDownCircleFill 
            size={35}
            className='animate-bounce text-secondary rounded-full shadow-md shadow-slate-400'
          />
        </div>
        <ul className='flex flex-col gap-3 lg:w-3/4 w-full'>
          {isLoading? (
            <LoadingComponent />
          ):(latestPosts?.map((convo) => (
              <Link key={convo.$id} href={"/signin"} >
                <div className='latest-topic-card'>
                  <LatestTopicCard 
                    $id={convo.$id}
                    subject={convo.subject}
                    createdBy={convo.createdBy}
                    created={convo.created}
                    starter={convo.starter}
                    hasDeleteButton={false}
                    database='topics'
                    isPreview={true}
                    category={convo.community}
                    countDocId={convo.countDocId}
                  />
                </div>
              </Link>
            )))}
        </ul>
      </section>
      <section className="onboarding flex flex-col justify-center items-center mt-12">
        <h2 className='text-3xl text-center md:text-5xl text-slate-800 dark:text-slate-200 font-bold mb-7'>New to the Conversation?</h2>
        <Button 
          label={buttonValue}
          onClick={handleSignUpRoute}
          bgColor='bg-blue-600'
          fontColor='text-white'
          padding='py-2 px-3'
          hover='hover:bg-blue-500'
          disabled={buttonValue === "..." ? true : false}
          disabledConditions='disabled:bg-blue-200 disabled:cursor-not-allowed'
        />
      </section>
      <section className="guest-signin flex flex-col justify-center items-center mt-12">
        <h2 className='text-3xl text-center md:text-5xl text-slate-800 dark:text-slate-200 font-bold mb-7'>Want to sign in as a guest and have a look?</h2>
        <Button 
          label={guestButtonValue}
          onClick={handleGuestSignIn}
          bgColor='bg-blue-600'
          fontColor='text-white'
          padding='py-2 px-3'
          hover='hover:bg-blue-500'
          disabled={guestButtonValue === "Logging in..." ? true : false}
          disabledConditions='disabled:bg-blue-200 disabled:cursor-not-allowed'
        />
      </section>
    </main>
  )
}

export default WelcomePage