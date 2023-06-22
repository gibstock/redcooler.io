"use client";
import { FormEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery} from '@tanstack/react-query';
import { useUserStore } from '@/hooks/store';
import { useRouter } from 'next/navigation';
import { BsArrowDownCircleFill} from 'react-icons/bs'
import TopicCard from '@/components/TopicCard';
import api from '@/api/api';

export default function Home() {
  const [buttonValue, setButtonValue] = useState("Join Now")
  const user = useUserStore(state => state.user);

  const {data, isLoading, isError, error } = useQuery(['latest'], api.fetchLatestPosts);
  

  const router = useRouter();
  if(user) {
    router.push('/dashboard')
  }
  const handleSignUpRoute = () => {
    setButtonValue("...")
    router.push('/signup')
  }

  return (
    <main className='lg:p-5 p-0 w-full md:w-[80%] mx-0 md:mx-auto'>
      <section className="welcome flex flex-col justify-center items-center mt-16">
        <h1 className='text-3xl text-center md:text-5xl text-slate-200 font-bold m-0 pb-8'>Welcome to <span className='text-red-500'>RedCooler.io</span></h1>
        <p className='m-0 pb-8 text-center text-xl md:text-2xl text-slate-300'>A place to write, share, and collab</p>
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
        <h2 className=' text-3xl md:text-5xl text-slate-200 font-bold m-0 pb-8'>Latest Posts</h2>
        <p className='m-0 pb-8 text-xl md:text-2xl text-slate-300'>See what&apos;s going down</p>
        <div className="down-icon">
          <BsArrowDownCircleFill 
            size={35}
            className='animate-bounce text-slate-300 rounded-full shadow-md shadow-slate-400'
          />
        </div>
        <ul className='flex flex-col gap-3 lg:w-3/4 w-full'>
          {data?.map((convo) => (
            <Link key={convo.$id} href={"/signin"}>
              <TopicCard 
                $id={convo.$id}
                subject={convo.subject}
                createdBy={convo.createdBy}
                created={convo.created}
                starter={convo.starter}
                hasDeleteButton={false}
                database='topics'
                isPreview={true}
                category={convo.community}
              />
            </Link>
          ))}
        </ul>
      </section>
      <section className="onboarding flex flex-col justify-center items-center mt-12">
        <h2 className='text-3xl text-center md:text-5xl text-slate-200 font-bold mb-7'>New to the Conversation?</h2>
        <button 
          className='bg-blue-600 disabled:bg-blue-200 disabled:cursor-not-allowed hover:bg-blue-500 rounded-3xl min-w-[28px] text-white py-2 px-3 text-center outline-none border-none'
          onClick={handleSignUpRoute}
          disabled={buttonValue === "..." ? true : false}
          >
            {buttonValue}
          </button>
      </section>
    </main>
  )
}
