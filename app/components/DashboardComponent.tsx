'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import api from "@/api/api"
import { useQuery,useQueryClient } from "@tanstack/react-query"
import { postFiler } from "@/utils/postFilter"
import Button from '@/app/components/Button';
import Tabs from '@/app/components/Tabs';
import Board from '@/app/components/Board';
import { MdDashboard } from 'react-icons/md';
import { useUserStore } from "@/hooks/store"


export default function DashboardComponent() {
  const [buttonValue, setButtonValue] = useState('New Post +')
  const [activeTab, setActiveTab] = useState("Public")
  const [modal, setModal] = useState(false);
  const {data} = useQuery({queryKey: ['posts'], queryFn: api.listAllTopics})

  const userStore = useUserStore();
  const user = userStore.user;
  const router = useRouter();

  const publicPosts = postFiler(data,false);
  const privatePosts = postFiler(data, true);

  const queryClient = useQueryClient()
  queryClient.removeQueries({ queryKey: ['convoWithId','conversations']})

  const handleNewTopicRoute = () => {
    if(user && user.name === "Guest"){
      setModal(true);
      return;
    }
    setButtonValue("One moment please")
    router.push("/newtopic")
  }
   const handleCancel = () => {
    setModal(false);
  }

  useEffect(() => {
    if(!user) {
      router.replace('/')
    } 
  }, [user, router])

  return (
  <div className="my-20 md:mx-4">
      <div className="new-post-group flex flex-row w-full pb-4 px-2 gap-x-8 items-center justify-between md:grid md:grid-cols-12">
        <div className="dashboard-icon flex flex-row items-center justify-start gap-2 md:col-start-3 md:col-span-2">
          <MdDashboard size={14} className=' text-red-500' />
          <div className='dark:text-slate-200 md:text-lg text-sm'>Your Dashboard</div>
        </div>
        <Button 
          label={buttonValue}
          onClick={handleNewTopicRoute}
          bgColor='bg-blue-500'
          fontColor='text-white'
          padding='px-3 py-1'
          hover='hover:bg-blue-400'
          disabled={buttonValue === "One moment please" ? true : false}
          disabledConditions='disabled:bg-blue-200 disabled:cursor-wait'
        />
        {modal && (
          <div className='modal-wrapper absolute z-50 top-0 left-0 w-full h-full'>
            <div className="overlay absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
            <div className="modal absolute top-[30%] left-0 w-full bg-black p-4 flex flex-col gap-1">
              <header>
                <h1 className='text-slate-200 text-xl font-bold'>Only registered users can do that.</h1>
              </header>
              <div className="body text-slate-300">
                <p>Would you like to sign up?</p>
              </div>
              <div className="responses flex flex-row justify-around items-center">
                {/* <button className='text-slate-400' onClick={() => router.push('/signup')}>Yes!</button> */}
                <button className='text-slate-100 w-full font-bold bg-blue-500 hover:bg-blue-400 py-1 px-5 rounded-full' onClick={() => router.push('/signup')}>Yes!</button>
                <button className='text-slate-400 w-full hover:text-slate-200' onClick={handleCancel}>Keep Browsing</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Tabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="message-board">
        {privatePosts && user && activeTab === 'Private' && privatePosts?.filter((item => item.members.includes(user?.email))).length > 0 ? (
          <Board 
            activeTab={activeTab}
            boardType='private'
            topics={privatePosts}
          />
        ): publicPosts && (
          <Board 
            activeTab={activeTab}
            boardType='public'
            topics={publicPosts}
          />
        )}
      </div>
  </div>
  )
}