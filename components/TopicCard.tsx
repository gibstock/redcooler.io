import React from 'react'
import { truncate } from '@/utils/helpers';
import { RxChatBubble } from 'react-icons/rx';
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
  isPreview?: boolean,
}

const TopicCard = ({$id, subject, createdBy, created, starter, $permissions, userId, canDelete, database, hasDeleteButton, isPreview}: AppProps) => {




  return (
    <li key={$id} className="flex flex-col bg-slate-100 py-1 px-4 rounded-sm outline outline-3 outline-transparent hover:outline-red-500">
      <div className="byline flex flex-row items-center justify-start gap-4 text-xs text-slate-400">
        <h3>{createdBy} | {new Date(created).toDateString()}</h3>
      </div>
      <div className="title-group flex flex-row my-2">
        <h2 className="font-semibold text-2xl">
          {subject}
        </h2>
      </div>
      <div className='whitespace-pre-wrap'>{isPreview? (truncate(starter, 50)) : (starter)}</div>
      <div className="button-group flex flex-row justify-start items-center my-2">
        <div className="contributions-group flex flex-row justify-start items-center gap-2 text-slate-500">
          <RxChatBubble size={22} />
          {/* <span>{convoCount![0].count} {convoCount![0].count > 1 || convoCount![0].count < 1 ? ("contributors"):("contributor")}</span> */}
        </div>
      </div>
    </li>
  )
}

export default TopicCard