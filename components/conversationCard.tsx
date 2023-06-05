import React from 'react'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from '@/api/api';


type AppProps = {
  $id: string,
  subject: string,
  createdBy: string,
  created: Date,
  starter: string,
  $permissions?: string[],
  userId?: string,
  hasDeleteButton: boolean,
  canDelete?: boolean,
  database: string
}

const ConversationCard = ({$id, subject, createdBy, created, starter, $permissions, userId, canDelete, database, hasDeleteButton}: AppProps) => {

const queryClient = useQueryClient();


  const deleteTopicMutation = useMutation({
    mutationFn: api.deleteTopic, 
    onSuccess: () => {
      queryClient.invalidateQueries([`${database}`]);
    }
  })
  return (
    <li key={$id} className="flex flex-col bg-slate-100 p-3 rounded-md">
      <div className="title-group flex flex-row">
        <h2 className="font-bold text-3xl">
          {subject}
        </h2>
      </div>
      <h3>{createdBy} | {new Date(created).toDateString()}</h3>
      <p>{starter}</p>
      <div className="button-group flex flex-row justify-center items-center self-end">
        {hasDeleteButton && (
          canDelete && (
            <button className="bg-red-600 rounded-full text-white px-3 py-1 mt-3" onClick={() => deleteTopicMutation.mutate($id)}>Delete</button>
          )
        )}
      </div>
    </li>
  )
}

export default ConversationCard