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
import { ImFileMusic} from 'react-icons/im'
import {GiPapers, GiThreeFriends} from 'react-icons/gi'
import { useUserStore } from '@/hooks/store'
import Feature from './Feature';
import Benefit from './Benefit';
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
      <div className="big-hero-back -z-10 bg-gradient-to-br from-redcooler from-50% via-redcoolerLite via-30% to-white to-70% absolute left-0 top-0 w-full h-full"></div>
      <section className="hero relative flex flex-row justify-center items-center gap-[8vw] h-screen">
        <div className="hero-content flex flex-col justify-center items-center mt-16">
          <h1 className='text-3xl text-center md:text-6xl text-slate-800 dark:text-slate-200 font-bold mt-8 pb-8'><span>Find</span> <span className='text-whiteish tracking-wide'>inspiration,</span> <span>get</span> <span className='text-whiteish tracking-wide'>feedback,</span> <span>store</span> your <span className='text-whiteish tracking-wide'>writing,</span> <span className='text-whiteish tracking-wide'>discuss.</span></h1>
          <p className='m-0 pb-8 text-center text-xl md:text-3xl text-slate-700 dark:text-slate-300'>Join the growing collaborative community of contributors &mdash; artists, musicians, writers, producers &mdash; and create something beautiful</p>
          <div className="buttons-group flex flex-row justify-center items-center gap-4">
            <Button 
              label='Join Us'
              bgColor='bg-blackish'
              fontColor='text-[#f2f2f2]'
              padding='py-2 px-4'
              hover='hover:bg-redcoolerLite'
            />
            <div className="social-proof">
              <p>Motivation awaits </p>
            </div>
          </div>
        </div>
        <div className="hero-image relative lg:flex md:hidden flex-row justify-center items-center w-full hidden">
          <Image 
            src='/banner-placeholder.jpg'
            width={640}
            height={427}
            alt='A pad of paper with a pen in the middle'
            className='shadow-md'
          />
          <div className="image-gradient w-full h-full absolute left-0 top-0 bg-gradient-to-br from-redcooler/20 from-55% to-white/70"></div>
        </div>
      </section>
      <section className="features-benefits w-full mt-24">
        <div className="feature-wrapper flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4">
          <Feature 
            feature='Upload your beats'
            Icon={ImFileMusic}
            contentText='Content Text Content Text Content Text Content Text Content Text Content TextContent Text Content Text Content TextContent Text Content Text v.'
          />
          <Feature 
            feature='Look for collaborators'
            Icon={GiThreeFriends}
            contentText='Content Text Content Text Content Text Content Text Content Text Content TextContent Text Content Text Content TextContent Text Content Text v.'
          />
          <Feature 
            feature='Store your writing'
            Icon={GiPapers}
            contentText='Content TextContent Text Content Text Content Text Content Text Content Text Content TextContent Text Content Text Content TextContent Text Content Text v.'
          />
        </div>
        <div className="benefits-wrapper relative mt-24 bg-gradient-to-tl from-redcooler from-50% via-redcoolerLite via-30% to-white to-70%">
          <Benefit 
            heading='Never miss a spontaneous moment of creation'
            subheading='Subheading 1 here'
            details='Not sure what will be here'
            imgSrc='/book-transparent.png'
            alt='book for inspiration'
            imgW={640}
            imgH={480}
            isEven={false}
          />
          <Benefit 
            heading='Find your people and be inspired'
            subheading='Subheading 2 here'
            details='Not sure what will be here'
            imgSrc='/inspired.jpg'
            alt='book for inspiration'
            imgW={640}
            imgH={480}
            isEven={true}
          />
        </div>
      </section>
      <section className="latest-threads flex flex-col justify-center items-center mt-12">
        <h2 className=' text-3xl md:text-5xl text-slate-800 dark:text-slate-200 font-bold m-0 pb-8'>Latest Posts</h2>
        <p className='m-0 pb-8 text-xl md:text-2xl text-slate-700 dark:text-slate-300'>See what&apos;s going down</p>
        <div className="down-icon">
          <BsArrowDownCircleFill 
            size={35}
            className='animate-bounce text-redcooler rounded-full shadow-md shadow-slate-400'
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
          bgColor='bg-redcooler'
          fontColor='text-white'
          padding='py-2 px-4'
          hover='hover:bg-redcoolerLite'
          disabled={buttonValue === "..." ? true : false}
          disabledConditions='disabled:cursor-not-allowed'
        />
      </section>
      <section className="guest-signin flex flex-col justify-center items-center mt-12">
        <h2 className='text-3xl text-center md:text-5xl text-slate-800 dark:text-slate-200 font-bold mb-7'>Want to sign in as a guest and have a look?</h2>
        <Button 
          label={guestButtonValue}
          onClick={handleGuestSignIn}
          bgColor='bg-redcooler'
          fontColor='text-white'
          padding='py-2 px-4'
          hover='hover:bg-redcoolerLite'
          disabled={guestButtonValue === "Logging in..." ? true : false}
          disabledConditions='disabled:cursor-not-allowed'
        />
      </section>
    </main>
  )
}

export default WelcomePage