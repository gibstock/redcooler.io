import React from 'react'
import Link from 'next/link';
import { useRouter } from "next/navigation";
import TopicCard from './TopicCard'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/hooks/store"

import api from '@/api/api';

type AppProps = {
  activeTab: string,

}

const PrivateBoard = ({activeTab}: AppProps) => {
  const user = useUserStore(state => state.user);

  const router = useRouter();
  const queryClient = useQueryClient();


  const { data: privateTopics, isLoading: privateIsLoading, isError: privateIsError} = useQuery(['private-topics'], () => api.fetchPrivateTopics(user?.email!))

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

  const handleDeleteMutations = (topicId: string, countDocId: string) => {
    try {
      deleteConversationMutation.mutate(topicId)
      deleteTopicMutation.mutate(topicId)
      deleteConvoCountMutation.mutate(countDocId);
      router.refresh()
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <div className="private-board">
      {privateIsError ? (
        <p>There was an error fetching the messages</p>
      ) : privateIsLoading ? (
        <p className='text-slate-200'>Loading private posts...</p>
      ) : privateTopics && activeTab === 'Private' && privateTopics.filter((item => item.members.includes(user?.email!))).length > 0 ? (
        <div className='grid grid-cols-12 gap-y-4 mt-1 md:mt-8'>
          <ul className="w-full row-start-2 col-start-1 col-span-12 md:col-start-3 md:col-span-5 flex flex-col justify-center items-stretch gap-4">
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
      ) : null}
    </div>
  )
}

export default PrivateBoard