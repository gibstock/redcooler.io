'use client'
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient, useQueries, UseQueryOptions } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/hooks/store"
import TopicCard from "@/components/TopicCard";
import Link from "next/link";
import { MdDashboard } from 'react-icons/md';
import api from '@/api/api';



export default function Dashboard() {
  const [buttonValue, setButtonValue] = useState('New Post +')
  const user = useUserStore(state => state.user);

  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret')

  const { data: privateTopics, isLoading: privateIsLoading, isError: privateIsError} = useQuery(['private-topics'], () => api.fetchPrivateTopics(user?.email!))
  const {data: topics, isLoading, isError, error } = useQuery(['topics'], api.listTopicsWithQuery);
  console.log("SP", userId, secret)
  const deleteTopicMutation = useMutation({
    mutationFn: api.deleteTopic, 
    onSuccess: () => {
      queryClient.invalidateQueries(['topic']);
    }
  })
  const deleteConversationMutation = useMutation({
    mutationFn: api.deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries(['topic']);
    }
  })
  const deleteConvoCountMutation = useMutation({
    mutationFn: api.deleteConvoCount,
    onSuccess: () => {
      queryClient.invalidateQueries(['topic'])
    }
  })

  const canDelete = (userID:string | undefined, array: string[] | undefined) => {
    const result = array?.some((element) => element.includes('delete') && element.includes(userID!))
    return result
  };

  const handleNewTopicRoute = () => {
    setButtonValue("One moment please")
    router.push("/newtopic")
  }

  const handleDeleteMutations = (topicId: string, countDocId: string) => {
    try {
      deleteConversationMutation.mutate(topicId)
      console.log("Stage one success")
      deleteTopicMutation.mutate(topicId)
      console.log("Stage two success")
      deleteConvoCountMutation.mutate(countDocId);
      console.log("Stage three success")
      router.refresh()
    } catch(err) {
      console.error(err)
    }
  }

  
  return (
    <div className="my-20 md:mx-4">
      <div className="new-post-group flex flex-row w-full gap-x-8 items-center justify-between md:grid md:grid-cols-12">
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
      <div className="message-board">
        <div className="private-board">
        {isError ? (
          <p>There was an error fetching the messages</p>
        ) : isLoading ? (
          <p className='text-slate-200'>Loading private posts...</p>
        ) : privateTopics && privateTopics.filter((item => item.members.includes(user?.email!))).length > 0 ? (
          <div className='grid grid-cols-12 gap-y-4 mt-8'>
            <h1 className="text-xl text-slate-200 pb-8 col-start-2 col-span-5 md:col-start-3 row-start-1">Private Posts</h1>
            <ul className="w-full row-start-2 col-start-2 col-span-10 md:col-start-3 md:col-span-5 flex flex-col justify-center items-stretch gap-4">
              {privateTopics.filter((item => item.members.includes(user?.email!))).map((topic) => (
                <div key={topic?.$id} className="col-start-2 col-span-10 md:col-start-3 md:col-span-5 relative">
                  <Link href={`/${topic.$id}/conversation/`}>
                    <TopicCard 
                      $id={topic.$id}
                      subject={topic.subject}
                      createdBy={topic.createdBy}
                      created={topic.created}
                      starter={topic.starter}
                      database='topics'
                      hasDeleteButton={false}
                      isPreview={true}
                      beat={topic.beat}
                    />
                  </Link>
                  {canDelete(user?.$id, topic?.$permissions) && (
                      <button className="text-red-500 absolute top-1 right-4 opacity-30 hover:opacity-100" onClick={() => handleDeleteMutations(topic.$id, topic.countDocId)}>Delete</button>
                    )}
                </div>
              ))}
            </ul>
          </div>
        ) : (
          <div className='px-4'>
            <h1 className="text-xl text-slate-200 pb-8 col-start-2 col-span-5 md:col-start-3 row-start-1">No Private Posts Yet</h1>
            <p className='text-slate-200'>Start your private collection and they&apos;ll appear here.</p>
          </div>
          )}
        </div>
        <div className="public-board">
        {isError ? (
          <p>There was an error fetching the messages</p>
        ) : isLoading ? (
          <p className='text-slate-400'>Loading public posts...</p>
        ) : topics ? (
          <div className='grid grid-cols-12 gap-y-4 mt-8'>
            <h1 className="text-xl text-slate-200 pb-8 col-start-2 col-span-5 md:col-start-3 row-start-1">Public Posts</h1>
            <ul className="w-full row-start-2 col-start-1 col-span-12 md:col-start-3 md:col-span-5 flex flex-col justify-center items-stretch gap-4">
              {topics.map((topic) => (
                <div key={topic.$id} className="col-start-2 col-span-10 md:col-start-3 md:col-span-5 relative">
                  <Link href={`${topic.$id}/conversation/`}>
                    <TopicCard 
                      $id={topic.$id}
                      subject={topic.subject}
                      createdBy={topic.createdBy}
                      created={topic.created}
                      starter={topic.starter}
                      database='topics'
                      hasDeleteButton={false}
                      isPreview={true}
                      beat={topic.beat}
                    />
                  </Link>
                  {canDelete(user?.$id, topic?.$permissions) && (
                      <button className="text-red-500 absolute top-1 right-4 opacity-30 hover:opacity-100" onClick={() => deleteTopicMutation.mutate(topic.$id)}>Delete</button>
                    )}
                </div>
              ))}
            </ul>
          </div>
        ) : null}
        </div>
      </div>
  </div>
  )
}
