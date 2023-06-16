'use client'
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useUserStore } from "@/hooks/store"
import PublicBoard from '@/components/PublicBoard';
import PrivateBoard from '@/components/PrivateBoard';
import Tabs from '@/components/Tabs';
import { MdDashboard } from 'react-icons/md';



export default function Dashboard() {
  const [buttonValue, setButtonValue] = useState('New Post +')
  const [activeTab, setActiveTab] = useState("Public")
  const user = useUserStore(state => state.user);

  const router = useRouter();

  const handleNewTopicRoute = () => {
    setButtonValue("One moment please")
    router.push("/newtopic")
  }
  return (
    <div className="my-20 md:mx-4">
      <div className="new-post-group flex flex-row w-full pb-4 gap-x-8 items-center justify-between md:grid md:grid-cols-12">
        <div className="dashboard-icon flex flex-row items-center justify-start gap-2 md:col-start-3 md:col-span-2">
          <MdDashboard size={22} className=' text-red-500' />
          <div className='text-slate-200'>Your Dashboard</div>
        </div>
        <button 
          className="bg-blue-500 text-white rounded-full px-3 py-1 md:col-start-5 md:col-span-3 disabled:bg-blue-200 disabled:cursor-not-allowed" 
          onClick={handleNewTopicRoute}
          disabled={buttonValue === "One moment please" ? true : false}
        >
          {buttonValue}
        </button>
      </div>
      <Tabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {/* <div className="tab-group-wrapper">
        <div className="tab-group flex flex-row border-b-2 border-slate-300">
          <button 
            className='disabled:text-slate-300 text-slate-500 border-t-2 border-r-2 disabled:border-slate-300 border-slate-500 disabled:border-r-slate-300 border-r-slate-300 rounded-tr-lg px-2'
            onClick={() => setActiveTab('Public')}
            disabled={activeTab === 'Public' ? true : false}
          >
            Public
          </button>
          <button 
            className='disabled:text-slate-300 text-slate-500  border-t-2 border-r-2 disabled:border-slate-300 border-slate-500 disabled:border-r-slate-300 border-r-slate-500 rounded-tr-lg px-2'
            onClick={() => setActiveTab("Private")}
            disabled={activeTab === "Private" ? true : false}
          >
            Private
          </button>
        </div>
      </div> */}
      <div className="message-board">
        <PrivateBoard 
          activeTab={activeTab}
        />
        <PublicBoard 
          activeTab={activeTab}
        />
      </div>
  </div>
  )
}
