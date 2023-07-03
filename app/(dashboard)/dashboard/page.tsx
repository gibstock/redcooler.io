'use client'
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useUserStore } from "@/hooks/store"
import { useQuery } from "@tanstack/react-query";
import Tabs from '@/components/Tabs';
import { MdDashboard } from 'react-icons/md';
import api from '@/api/api';
import Board from '@/components/Board';
import { imageMap } from '@/hooks/imageMap';




export default function Dashboard() {
  const [buttonValue, setButtonValue] = useState('New Post +')
  const [activeTab, setActiveTab] = useState("Public")
  const [modal, setModal] = useState(false);
  const userStore = useUserStore();
  const user = userStore.user;
  const imageList = userStore.imageList;
  const setImageList = userStore.setImageList;
  const setImageUrlMap = userStore.setImageUrlMap;
  const imageUrlMap = userStore.imageUrlMap;

  const router = useRouter();
  
  const { data: privateTopics, isLoading: privateIsLoading, isError: privateIsError} = useQuery(['private-topics'], () => api.fetchPrivateTopics(user?.email!))
  const {data: publicTopics, isLoading: publicIsLoading, isError: publicIsError } = useQuery(['public-topics'], api.listTopicsWithQuery);
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
    // const getImageList = async () => {
    //   const getAvatars = await api.listAvatars();
    //   setImageList(getAvatars)
    //   setImageUrlMap(imageMap(imageList))
    // }
    // getImageList();
  }, [user, router])

  return (
    <div className="my-20 md:mx-4">
      <div className="new-post-group flex flex-row w-full pb-4 px-2 gap-x-8 items-center justify-between md:grid md:grid-cols-12">
        <div className="dashboard-icon flex flex-row items-center justify-start gap-2 md:col-start-3 md:col-span-2">
          <MdDashboard size={14} className=' text-red-500' />
          <div className='dark:text-slate-200 md:text-lg text-sm'>Your Dashboard</div>
        </div>
        <button 
          className="bg-blue-500 text-white text-sm rounded-full px-3 py-1 md:col-start-5 md:col-span-3 disabled:bg-blue-200 disabled:cursor-wait" 
          onClick={handleNewTopicRoute}
          disabled={buttonValue === "One moment please" ? true : false}
        >
          {buttonValue}
        </button>
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
        {privateTopics && user && activeTab === 'Private' && privateTopics?.filter((item => item.members.includes(user?.email))).length > 0 ? (
          <Board 
            activeTab={activeTab}
            boardType='private'
            topics={privateTopics}
            isLoading={privateIsLoading}
            isError={privateIsError}
          />
        ): publicTopics && (
          <Board 
            activeTab={activeTab}
            boardType='public'
            topics={publicTopics}
            isLoading={publicIsLoading}
            isError={publicIsError}
          />
        )}
      </div>
  </div>
  )
}
