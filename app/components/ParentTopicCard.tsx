'use client'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {MdDashboard, MdPlayCircle, MdPauseCircle,} from 'react-icons/md'
import {RiPencilFill, RiShareForwardLine} from 'react-icons/ri'
import {RxChatBubble} from 'react-icons/rx'
import ReactPlayer from 'react-player';
import { useUserStore } from '@/hooks/store'
import api from '@/api/api'

type AppProps = {
  $id: string | undefined,
  $permissions: string[] | undefined,
  createdBy: string,
  created: Date | undefined,
  subject: string | undefined,
  starter: string | undefined,
  beat: string | undefined,
  avatarId: string | undefined,
  userAvatarHref: string | undefined,
  audioFileId?: string | undefined,
  countDocId: {
    topicId: string;
    count: number;
    $id: string;
}[] | undefined
}

const ParentTopicCard = ({$id, $permissions, createdBy, created, subject, starter, beat, countDocId, avatarId, userAvatarHref, audioFileId}: AppProps) => {
  const [userInitialsHref, setUserInitialsHref] = useState('')
  const [audioSrc, setAudioSrc] = useState('');

  const router = useRouter()

  const canEdit = (userID:string | undefined, array: string[] | undefined) => {
    const result = array?.some((element) => element.includes('update') && element.includes(userID!))
    return result
  };

  useEffect(() => {
    const getAudioStream = async () => {
      if(audioFileId && audioFileId.length > 2) {
        const audioFileSrc = await api.streamAudioFile(audioFileId);
        setAudioSrc(audioFileSrc.href);
      }
    }
    getAudioStream();

  }, [audioFileId])

  useEffect(()=>{
    const getUserAvatar = async () => {
      // get user profile
      // get proile_pic_id
      // get img url from imagemap
      if(userAvatarHref === null || userAvatarHref === undefined) {
        const userInitials = await api.getUserInitials(createdBy)
        setUserInitialsHref(userInitials.href)
      } 
    }
    getUserAvatar();
  }, [avatarId])

  return (
    <div className="parent-topic bg-transparent row-start-1 col-start-2 md:col-start-3 col-span-10 md:col-span-5 p-4 border-b-8 border-b-slate-700/70">
          <div className="dash-edit-wrapper flex flex-row justify-between items-center">
            {/* <Link href={'/dashboard'}> */}
              <div 
                className="dashboard-icon flex flex-row items-center justify-start gap-2 text-xs hover:text-red-500 cursor-pointer"
                onClick={() => router.back()}  
              >
                <MdDashboard size={14} className=' text-red-500' />
                <div>Back to Dashboard</div>
              </div>
            {/* </Link> */}
            {canEdit($id, $permissions) && (
              <div className="edit-button flex flex-row text-red-500">
                <RiPencilFill />
                <Link href={'/editpost2'}>
                  <span>edit</span>
                </Link>
              </div>
            )}
          </div>
          <div className="topic-card">
            
            <div className="posted-by flex flex-row justify-start items-center gap-2 my-4">
            {userAvatarHref  ? (
              <Image 
                src={userAvatarHref}
                width={24}
                height={24}
                alt={createdBy}
                className='rounded-full'
              />
            ) : (
              <Image 
                src={userInitialsHref}
                width={24}
                height={24}
                alt={createdBy}
                className='rounded-full'
              />
            )}
              <span className='text-red-400 text-sm'>{createdBy}</span> 
              <span className='text-sm'>| {new Date(created!).toDateString()}</span>
            </div>
            <h1 className='font-bold text-lg'>{subject}</h1>
            <div className="topic-body mt-4 whitespace-pre-wrap text-sm">
              {starter}
            </div>
            <div className="stats-bar text-slate-400 dark:text-slate-300 flex flex-row gap-3 mt-4 text-xs">
              <div className="contributions-group flex flex-row justify-start items-center gap-2">
                <RxChatBubble size={14} />
                <span>{countDocId? countDocId[0].count : 0} {countDocId && countDocId[0].count < 1 || countDocId && countDocId[0].count > 1 ? "comments" : "comment" }</span>
              </div>
              {/* todo  */}
              {/* implement share function  */}
              {/* <div className="share-group flex flex-row justify-start items-center gap-2">
                <RiShareForwardLine size={22} />
                <span>Share</span>
              </div> */}
            </div>
          </div>
          <div className="sound-player mt-4 text-xs">
            {beat?.includes("youtu") ? (
              <>
                <h2 className='mb-4 font-bold'>YouTube Beat</h2>
                <div className="player-wrapper relative pt-[56.25%]">
                  <ReactPlayer 
                    className='absolute top-0 left-0'
                    url={beat}
                    width='100%'
                    height='100%'
                    loop={true}
                    controls={true}
                  />
                </div>
              </>
            ) : beat?.includes("soundcloud") ? (
              <>
                <h2 className='mb-4 font-bold'>Soundcloud Beat</h2>
                <div className="player-wrapper relative pt-[56.25%]">
                  <ReactPlayer 
                    className='absolute top-0 left-0'
                    url={beat}
                    width='100%'
                    height='100%'
                    loop={true}
                    controls={true}
                  />
                </div>
              </>
            ) : audioFileId && audioFileId?.length > 2 ? (
              <div className='flex flex-col justify-center items-start'>
                <h2 className='mb-4 font-bold'>Original Beat</h2>
                <audio className='bg-[#e5e7eb] w-full rounded-md' src={audioSrc} controls></audio>
              </div>
            ): null}
          </div>
        </div>
  )
}

export default ParentTopicCard