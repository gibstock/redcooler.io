'use client'
import { useEffect, FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/hooks/store"
import TopicCard from "@/components/TopicCard";
import api from '@/api/api';



export default function Dashboard() {
const [input, setInput] = useState('');
const user = useUserStore(state => state.user);
const setUser = useUserStore(state => state.setUser);

const router = useRouter();
const queryClient = useQueryClient();
const {data: topics, isLoading, isError, error } = useQuery(['topics'], api.listTopicsWithQuery);

console.log(topics)

const addMessageMutation = useMutation({
  mutationFn: ({message, userId}: {message: string, userId: string}) => api.createDocument({message, userId}), 
  onSuccess: () => {
    setInput('');
    queryClient.invalidateQueries(['conversations']);
  },
  onError: (err: Error) => {
    console.error("Error: ", err, input);
  }
})

const deleteTopicMutation = useMutation({
  mutationFn: api.deleteTopic, 
  onSuccess: () => {
    queryClient.invalidateQueries(['topic']);
  }
})

const handleSignOut = async () => {
  api.signOut();
  setUser(null);
  router.push('/')
 }

//  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   console.log("Adding message to database", input)
//   addMessageMutation.mutate({message:input, userId: user?.$id!});
// }

const canDelete = (userID:string | undefined, array: string[] | undefined) => {
  console.log("to be tested",user, userID, array)
  const result = array?.some((element) => element.includes('delete') && element.includes(userID!))
  console.log("Candelete?", result)
  return result
};

const handleNewTopicRoute = () => {
  router.push('/newtopic')
}

// useEffect(() => {
//   console.log("USER CHECK: ", user)
//   if(user === null) {
//     router.push('/signup')
//   }
// }, [])
console.log("whoami" ,user)
  return (
    <div className="mt-20 mx-4">
      <div className="new-post-group flex flex-row w-full gap-x-3 items-center justify-around">
        <button className="bg-blue-500 text-white rounded-full px-3 py-1" onClick={handleNewTopicRoute}>
          New Post +
        </button>
          {/* <button className="bg-red-500 text-white rounded-full px-3 py-1" onClick={handleSignOut}>
                Sign Out
          </button> */}
      </div>
      <div className="message-board">
        {isError ? (
          <p>There was an error fetching the messages</p>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : topics ? (
          <div className='mt-8'>
            <h1 className="text-5xl text-center pb-8">Conversations</h1>
            <ul className="flex flex-col gap-y-4">
              {topics.map((topic) => (
                <div key={topic.$id}>
                  <TopicCard 
                    $id={topic.$id}
                    subject={topic.subject}
                    createdBy={topic.createdBy}
                    created={topic.created}
                    starter={topic.starter}
                    database='topics'
                    hasDeleteButton={false}
                  />
                  {canDelete(user?.$id, topic?.$permissions) && (
                      <button className="bg-red-600 rounded-full text-white px-3 py-1 mt-3" onClick={() => deleteTopicMutation.mutate(topic.$id)}>Delete</button>
                    )}
                </div>
                // <li key={topic.$id} className="flex flex-col bg-slate-100 p-3 rounded-md">
                //   <div className="title-group flex flex-row">
                //     <h2 className="font-bold text-3xl">
                //       {topic?.subject}
                //     </h2>
                //   </div>
                //   <h3>{topic.createdBy} | {new Date(topic.created).toDateString()}</h3>
                //   <p>{topic.starter}</p>
                //   <div className="button-group flex flex-row justify-center items-center self-end">
                //   {/* @ts-ignore */}
                //     {canDelete(user?.$id, topic?.$permissions) && (
                //       <button className="bg-red-600 rounded-full text-white px-3 py-1 mt-3" onClick={() => deleteTopicMutation.mutate(topic.$id)}>Delete</button>
                //     )}
                //   </div>
                // </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
  </div>
  )
}
