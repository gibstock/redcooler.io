"use client";
import { FormEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery} from '@tanstack/react-query';
import { useUserStore } from '@/hooks/store';
import { useRouter } from 'next/navigation';
import TopicCard from '@/components/TopicCard';
import api from '@/api/api';

export default function Home() {
  // const [input, setInput] = useState('');
  const user = useUserStore(state => state.user);
  // const setUser = useUserStore(state => state.setUser);

  // const queryClient = useQueryClient();
  const {data, isLoading, isError, error } = useQuery(['latest'], api.fetchLatestPosts);
  

  const router = useRouter();
  if(user) {
    router.push('/dashboard')
  }
  const handleSignUpRoute = () => {
    router.push('/signup')
  }

  return (
    <main className='p-5 md:w-[60%] md:mx-auto'>
      <section className="welcome flex flex-col justify-center items-center mt-16">
        <h1 className='text-5xl text-slate-200 font-bold m-0 pb-8'>Welcome to <span className='text-red-500'>RedCooler.io</span></h1>
        <p className='m-0 pb-8 text-2xl text-slate-300'>A place to write, share, and collab</p>
      </section>
      <div className="hero-banner flex flex-row justify-center items-center">
        <Image 
          src='/banner-placeholder.jpg'
          width={640}
          height={427}
          alt='A pad of paper with a pen in the middle'
        />
      </div>
      <section className="latest-threads flex flex-col justify-center items-center mt-12">
        <h2 className='text-5xl text-slate-200 font-bold m-0 pb-8'>Latest Posts</h2>
        <p className='m-0 pb-8 text-2xl text-slate-300'>See what&apos;s going down</p>
        <ul className='flex flex-col gap-3'>
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
              />
            </Link>
          ))}
        </ul>
      </section>
      <section className="onboarding flex flex-col justify-center items-center mt-12">
        <h2 className='text-5xl text-slate-200 font-bold mb-7'>New to the Conversation?</h2>
        <button 
          className='bg-blue-600 hover:bg-blue-500 rounded-3xl min-w-[28px] text-white py-2 px-3 text-center outline-none border-none'
          onClick={handleSignUpRoute}
          >
            Join Now
          </button>
      </section>
      {/* {user && (
        <div>
          <form onSubmit={handleSubmit}>
            <input 
              type='text'
              value={input}
              placeholder='Add Message'
              onChange={(e) => setInput(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mt-4" 
            ></input>
          </form>
            <button onClick={handleSignOut}>
                  Sign Out
            </button>
        </div>
      )}
      <div>
          {isError ? (
            <p>There was an error fetching the messages</p>
          ) : isLoading ? (
            <p>Loading...</p>
          ): messages ? (
            <div>
              <h1>Message Board</h1>
              <ul>
                {messages.map((message) => (
                  <li key={message.$id}>
                    <p>
                      {message?.message}
                    </p>
                    {canDelete(user?.$id, message?.$permissions) && (
                      <button onClick={() => deleteMessageMutation.mutate(message.$id)}>Delete</button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
      </div> */}
    </main>
  )
}
