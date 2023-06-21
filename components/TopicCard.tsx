import React, { useEffect, useState} from 'react'
import { truncate } from '@/utils/helpers';
import { RxChatBubble } from 'react-icons/rx';
import { categories } from '@/constants/categories';
import { useUserStore } from '@/hooks/store';
import api from '@/api/api';
import Image from 'next/image';


type AppProps = {
  $id: string,
  subject: string,
  createdBy: string,
  created: Date,
  starter: string,
  category: string,
  $permissions?: string[],
  userId?: string,
  hasDeleteButton: boolean,
  canDelete?: boolean,
  database: string
  isPreview?: boolean,
  beat?: string,
  userAvatarId?: string | null,
}

const TopicCard = ({$id, subject, createdBy, created, starter, $permissions, userId, canDelete, database, hasDeleteButton, isPreview, beat, category, userAvatarId}: AppProps) => {
  const [youTubeImg, setYouTubeImg] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [userInitialsHref, setUserInitialsHref] = useState('')
  const [communityIcon, setCommunityIcon] = useState('')
  const imageUrlMap = useUserStore(state => state.imageUrlMap)

  useEffect(() => {
    const youtbeImageExtraction = () => {
      const result = beat?.match("([^\/]+$)")
      if(result && result[0]) {
        setYouTubeImg(result[0])
      }
    }
    const getUserAvatar = async () => {
      // get user profile
      // get proile_pic_id
      // get img url from imagemap
      if(userAvatarId !== null && userAvatarId !== undefined) {
        if(imageUrlMap) {
          const avId = imageUrlMap.get(userAvatarId)
          avId !== undefined && setUserAvatar(avId)
        }
      } else {
        const userInitials = await api.getUserInitials(createdBy)
        setUserInitialsHref(userInitials.href)
      }
    }
    const getCommunityIcon = async () => {
      const categoryName = categories[category as keyof typeof categories]
      const communityIcon = await api.getUserInitials(categoryName)
      setCommunityIcon(communityIcon.href)
    }
    youtbeImageExtraction()
    getUserAvatar();
    getCommunityIcon();
  }, [beat])

  return (
    <li key={$id} className="flex flex-col bg-[hsl(200_55%_18%)] py-1 px-4 rounded-sm outline outline-3 outline-transparent hover:opacity-70 shadow-[inset_0_2px_4px_hsl(200_55%_40%)]">
      <div className="byline flex flex-row items-center justify-start gap-4 text-xs text-slate-400">
        <div className="community-badge-name flex flex-row justify-start items-center gap-1">
          <div className="community-badge flex justify-center items-center bg-slate-200 text-slate-900 font-extrabold border border-slate-400 rounded-full w-9 h-9">
            {category.slice(0,1).toUpperCase()}
          </div>
          <span className='text-slate-200'>{categories[category as keyof typeof categories]}</span>
        </div>
        <div className="created">
            {new Date(created).toDateString()}
        </div>
        <div className="right-group flex flex-row gap-2">
          <div className="posted-by flex flex-row justify-center items-end">
            <span>Posted by</span>
            <h3 className='font-bold'>{createdBy}</h3>
          </div>
        </div>
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