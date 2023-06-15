import React, {use, useEffect, useState} from 'react'
import { truncate } from '@/utils/helpers';
import { RxChatBubble } from 'react-icons/rx';
import Image from 'next/image';


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
  beat?: string
}

const TopicCard = ({$id, subject, createdBy, created, starter, $permissions, userId, canDelete, database, hasDeleteButton, isPreview, beat}: AppProps) => {
  const [youTubeImg, setYouTubeImg] = useState('')

  useEffect(() => {
    const youtbeImageExtraction = () => {
      const result = beat?.match("([^\/]+$)")
      if(result && result[0]) {
        setYouTubeImg(result[0])
      }
    }
    youtbeImageExtraction()
  }, [beat])

  
  

  return (
    <li key={$id} className="flex flex-col bg-[hsl(200_55%_18%)] py-1 px-4 rounded-sm outline outline-3 outline-transparent hover:outline-red-500 shadow-[inset_0_2px_4px_hsl(200_55%_40%)]">
      <div className="byline flex flex-row items-center justify-start gap-4 text-xs text-slate-400">
        <h3>Posted by {createdBy} | {new Date(created).toDateString()}</h3>
      </div>
      <div className="title-group flex flex-row my-2">
        <h2 className="font-semibold text-lg text-slate-200">
          {subject}
        </h2>
      </div>
      <div className="thumbs flex flex-row justify-center items-center shadow-sm shadow-[hsl(200_55%_40%)]">
        {beat && <Image 
          src={`http://img.youtube.com/vi/${youTubeImg}/0.jpg`}
          width={480}
          height={270}
          alt='youtube thumbnail'
        />}
        
      </div>
      <div className='whitespace-pre-wrap text-slate-200'>{isPreview? (truncate(starter, 50)) : (starter)}</div>
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