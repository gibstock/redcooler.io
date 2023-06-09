import React from 'react'
import { truncate } from '@/utils/helpers';
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  isPreview?: boolean
}

const TopicCard = ({$id, subject, createdBy, created, starter, $permissions, userId, canDelete, database, hasDeleteButton, isPreview}: AppProps) => {

// const queryClient = useQueryClient();


//   const deleteTopicMutation = useMutation({
//     mutationFn: api.deleteTopic, 
//     onSuccess: () => {
//       queryClient.invalidateQueries([`${database}`]);
//     }
//   })
  return (
    <li key={$id} className="flex flex-col bg-slate-100 py-4 px-4 rounded-md outline outline-3 outline-transparent hover:outline-red-500">
      <div className="title-group flex flex-row">
        <h2 className="font-bold text-3xl">
          {subject}
        </h2>
      </div>
      <h3>{createdBy} | {new Date(created).toDateString()}</h3>
      <div className='whitespace-pre-wrap'>{isPreview? (truncate(starter, 50)) : (starter)}</div>
      <div className="button-group flex flex-row justify-center items-center self-end">
        {/* {hasDeleteButton && (
          canDelete && (
            <button className="bg-red-600 rounded-full text-white px-3 py-1 mt-3" onClick={() => deleteTopicMutation.mutate($id)}>Delete</button>
          )
        )} */}
      </div>
    </li>
  )
}

export default TopicCard