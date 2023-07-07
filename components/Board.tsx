import React from 'react'
import TopicCard from './TopicCard'
import { useUserStore } from "@/hooks/store"

type AppProps = {
  activeTab: string,
  boardType: string,
  topics: {
    subject: string;
    $id: string;
    starter: string;
    beat: string;
    createdBy: string;
    community: string;
    user_account_id: string;
    isPrivate: boolean;
    created: Date;
    $permissions: string[];
    members: string[];
    convocount: number;
    countDocId: string;
    userAvatarId: string;
    audioFileId: string;
  }[],
  isLoading?: boolean,
  isError?: boolean,

}

const Board = ({activeTab, boardType,topics, isLoading, isError}: AppProps) => {
  const userStore = useUserStore()
  const user = userStore.user;
  const canDelete = (userID:string | undefined, array: string[] | undefined) => {
    const result = array?.some((element) => element.includes('delete') && element.includes(userID!))
    return result
  };

  return (
    <div className={`${boardType}-board`}>
      {isError ? (
        <p>There was an error fetching the messages. Please refresh the page or contact admin.</p>
      ) : isLoading ? (
        <p className='text-slate-200'>Loading {boardType} posts...</p>
      ) : (
        <div className='grid grid-cols-12 gap-y-4 mt-1 md:mt-8'>
          <ul className="w-full row-start-2 col-start-1 col-span-12 md:col-start-3 md:col-span-5 flex flex-col justify-center items-stretch gap-2 md:gap-4">
            {boardType === 'private' ? (
              // private posts
              topics.filter((item => item.members.includes(user?.email!))).map((topic) => (
                <div key={topic?.$id} className="col-start-2 col-span-10 md:col-start-3 md:col-span-5 relative">
                  <TopicCard 
                    $id={topic.$id}
                    subject={topic.subject}
                    createdBy={topic.createdBy}
                    created={topic.created}
                    starter={topic.starter}
                    database='topics'
                    hasDeleteButton={canDelete(user?.$id, topic?.$permissions) ? true : false}
                    isPreview={true}
                    beat={topic.beat}
                    category={topic.community}
                    boardType={boardType}
                    userId={topic.user_account_id}
                    userAvatarId={topic.userAvatarId}
                    countDocId={topic.countDocId}
                    audioFileId={topic.audioFileId}
                  />
                </div>
              )
            )) : (
              // public posts
              topics.map((topic) => (
                <div key={topic.$id} className="col-start-2 col-span-10 md:col-start-3 md:col-span-5 relative">
                  <TopicCard 
                    $id={topic.$id}
                    subject={topic.subject}
                    createdBy={topic.createdBy}
                    created={topic.created}
                    starter={topic.starter}
                    database='topics'
                    hasDeleteButton={canDelete(user?.$id, topic?.$permissions) ? true : false}
                    isPreview={true}
                    beat={topic.beat}
                    category={topic.community}
                    boardType={boardType}
                    userId={topic.user_account_id}
                    userAvatarId={topic.userAvatarId}
                    countDocId={topic.countDocId}
                    audioFileId={topic.audioFileId}
                  />
                </div>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Board