'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/hooks/store"
import TopicCard from "@/components/TopicCard";
import Link from "next/link";
import api from '@/api/api';



export default function Dashboard() {
const user = useUserStore(state => state.user);

console.log("User from dashboard", user)

const router = useRouter();
const queryClient = useQueryClient();

const { data: privateTopics, isLoading: privateIsLoading, isError: privateIsError} = useQuery(['private-topics'], () => api.fetchPrivateTopics(user?.email!))


const {data: topics, isLoading, isError, error } = useQuery(['topics'], api.listTopicsWithQuery);

console.log("topics", privateTopics);

const deleteTopicMutation = useMutation({
  mutationFn: api.deleteTopic, 
  onSuccess: () => {
    queryClient.invalidateQueries(['topic']);
  }
})

const canDelete = (userID:string | undefined, array: string[] | undefined) => {
  const result = array?.some((element) => element.includes('delete') && element.includes(userID!))
  return result
};

const handleNewTopicRoute = () => {
  router.push('/newtopic')
}

  return (
    <div className="mt-20 mx-4">
      <div className="new-post-group flex flex-row w-full gap-x-3 items-center justify-around">
        <button className="bg-blue-500 text-white rounded-full px-3 py-1" onClick={handleNewTopicRoute}>
          New Post +
        </button>
      </div>
      <div className="message-board">
        <div className="private-board">
        {isError ? (
          <p>There was an error fetching the messages</p>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : privateTopics ? (
          <div className='mt-8'>
            <h1 className="text-5xl text-center pb-8">Private Posts</h1>
            <ul className="flex flex-col gap-y-4">
              {privateTopics.filter((item => item.members.includes(user?.email!))).map((topic) => (
                <div key={topic?.$id}>
                  <Link href={`/${topic.$id}/conversation/`}>
                    <TopicCard 
                      $id={topic.$id}
                      subject={topic.subject}
                      createdBy={topic.createdBy}
                      created={topic.created}
                      starter={topic.starter}
                      database='topics'
                      hasDeleteButton={false}
                    />
                  </Link>
                  {canDelete(user?.$id, topic?.$permissions) && (
                      <button className="bg-red-600 rounded-full text-white px-3 py-1 mt-3" onClick={() => deleteTopicMutation.mutate(topic.$id)}>Delete</button>
                    )}
                </div>
              ))}
            </ul>
          </div>
        ) : null}
        </div>
        <div className="public-board">
        {isError ? (
          <p>There was an error fetching the messages</p>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : topics ? (
          <div className='mt-8'>
            <h1 className="text-5xl text-center pb-8">Public Posts</h1>
            <ul className="flex flex-col gap-y-4">
              {topics.map((topic) => (
                <div key={topic.$id}>
                  <Link href={`${topic.$id}/conversation/`}>
                    <TopicCard 
                      $id={topic.$id}
                      subject={topic.subject}
                      createdBy={topic.createdBy}
                      created={topic.created}
                      starter={topic.starter}
                      database='topics'
                      hasDeleteButton={false}
                    />
                  </Link>
                  {canDelete(user?.$id, topic?.$permissions) && (
                      <button className="bg-red-600 rounded-full text-white px-3 py-1 mt-3" onClick={() => deleteTopicMutation.mutate(topic.$id)}>Delete</button>
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
