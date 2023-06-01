"use client";
import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import { useUserStore } from '@/hooks/store';
import { useRouter } from 'next/navigation';
import api from '@/api/api';

export default function Home() {
  const [input, setInput] = useState('');
  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);

  const queryClient = useQueryClient();
  const {data: messages, isLoading, isError, error } = useQuery(['messages'], api.listDocumentsWithQuery);
  const router = useRouter();
  if(user) {
    router.push('/dashboard')
  }

  const handleSignInRoute = () => {
    console.log('signin')
    router.push('/signin')
  }
  const handleSignUpRoute = () => {
    router.push('/signup')
  }

  return (
    <main>
      <h1>Welcome to RedCooler.io</h1>
      <p>A place to write, share, and collab on raps.</p>
      <div className="buttons">
        <p>Have an account?</p>
        <button onClick={handleSignInRoute}>Sign In</button>
        <p>Want to join the convo?</p>
        <button onClick={handleSignUpRoute}>Sign Up</button>
      </div>
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
