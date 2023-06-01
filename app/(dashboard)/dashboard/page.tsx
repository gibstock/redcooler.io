'use client'
import { useEffect, FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/hooks/store"
import api from '@/api/api';



export default function Dashboard() {
const [input, setInput] = useState('');
const user = useUserStore(state => state.user);
const setUser = useUserStore(state => state.setUser);

const router = useRouter();
const queryClient = useQueryClient();
const {data: messages, isLoading, isError, error } = useQuery(['conversations'], api.listDocumentsWithQuery);


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

const deleteMessageMutation = useMutation({
  mutationFn: api.deleteMessage, 
  onSuccess: () => {
    queryClient.invalidateQueries(['conversations']);
  }
})

const handleSignOut = async () => {
  api.signOut();
  setUser(null);
  router.push('/')
 }

 const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("Adding message to database", input)
  addMessageMutation.mutate({message:input, userId: user?.$id!});
}

const canDelete = (userID:string, array: string[]) => {
  return array.some((element) => element.includes('delete') && element.includes(userID))
};

const handleNewTopicRoute = () => {
  router.push('/newtopic')
}

useEffect(() => {
  console.log("USER CHECK: ", user)
  if(!user) {
    router.push('/signup')
  }
}, [])
console.log("whoami" ,user)
  return (
    <>
    <div className="message-board">
      {isError ? (
        <p>There was an error fetching the messages</p>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : messages ? (
        <div>
          <h1>Message Board</h1>
          <ul>
            {messages.map((message) => (
              <li key={message.$id}>
                <p>
                  {message?.message}
                </p>
                {/* @ts-ignore */}
                {canDelete(user?.$id, message?.$permissions) && (
                  <button onClick={() => deleteMessageMutation.mutate(message.$id)}>Delete</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
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
        <button onClick={handleNewTopicRoute}>
          New Post +
        </button>
          <button onClick={handleSignOut}>
                Sign Out
          </button>
      </div>
    </>
  )
}
