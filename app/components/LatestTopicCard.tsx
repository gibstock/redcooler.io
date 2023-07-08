import React, { useEffect, useState} from 'react'
import { truncate, timeSince } from '@/utils/helpers';
import { RxChatBubble} from 'react-icons/rx';
import { categories } from '@/constants/categories';
import api from '@/api/api';
import Image from 'next/image';


type AppProps = {
  $id: string,
  subject: string,
  createdBy: string,
  created: Date,
  starter: string,
  category: string,
  boardType?: string,
  $permissions?: string[],
  userId?: string,
  hasDeleteButton: boolean,
  countDocId: string,
  canDelete?: boolean,
  database: string
  isPreview?: boolean,
  beat?: string,
  userAvatarId?: string | null,
  audioFileId?: string | null,
}

const LatestTopicCard = ({$id, subject, createdBy, created, starter, $permissions, userId, canDelete, database, hasDeleteButton, isPreview, beat, category, boardType, userAvatarId, audioFileId, countDocId}: AppProps) => {
  const [youTubeImg, setYouTubeImg] = useState('')
  const [convoCount, setConvoCount] = useState(0);

  useEffect(() => {
    const youtbeImageExtraction = () => {
      const result = beat?.match("([^\/]+$)")
      if(result && result[0]) {
        setYouTubeImg(result[0])
      }
    }
    const getConvoCount = async() => {
      const convos = await api.fetchCommentCountByTopicId($id);
      setConvoCount(convos[0].count);
    }
    youtbeImageExtraction()
    getConvoCount();
  }, [beat])

  return (
    <li key={$id} className="flex flex-col bg-white dark:bg-dark-black py-1 px-4 rounded-sm outline outline-3 outline-transparent dark:outline-1 dark:outline-slate-700 hover:opacity-70 dark:shadow-none shadow-[0_0px_30px_0px_hsl(200_35%_90%)]">
      <div className="byline flex flex-row items-center justify-start text-xs text-slate-800 dark:text-slate-400">
        <div className="community-badge-name flex flex-row justify-start items-center gap-1 mr-2">
          <div className="community-badge flex justify-center items-center dark:bg-slate-200 text-slate-900 font-extrabold border border-slate-400 rounded-full w-6 h-6">
            {category.slice(0,1).toUpperCase()}
          </div>
          <span className='text-slate-800 dark:text-slate-200'>{categories[category as keyof typeof categories]}</span>
        </div>
        <div className="right-group flex flex-row mr-2">
            <h3 className='font-bold'>{createdBy}</h3>
        </div>
        <div className="date-dots flex flex-row justify-end items-center">
          <div className="date-posted text-slate-400 text-xs">
            {timeSince(new Date(created))}
          </div>
        </div>
      </div>
        <div className="title-group flex flex-row my-2">
          <h2 className="font-semibold text-sm dark:text-slate-200">
            {subject}
          </h2>
        </div>
          {beat && 
            (
              <div className="thumbs flex flex-row justify-center items-center shadow-sm shadow-[hsl(200_55%_40%)] mb-2">
                  <Image 
                  src={`http://img.youtube.com/vi/${youTubeImg}/0.jpg`}
                  width={480}
                  height={270}
                  alt='youtube thumbnail'
                />
              </div>
            ) 
          }
        <div className='whitespace-pre-wrap text-xs dark:text-slate-200'>{isPreview? (truncate(starter, 50)) : (starter)}</div>
        <div className="button-group text-xs flex flex-row justify-start items-center my-2">
          <div className="contributions-group flex flex-row justify-start items-center gap-2 text-slate-500">
            <RxChatBubble />
            <span>{convoCount} {convoCount > 1 || convoCount < 1 ? ("comments"):("comment")}</span>
          </div>
        </div>
    </li>
  )
}

export default LatestTopicCard