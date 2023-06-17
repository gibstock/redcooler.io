import React from 'react'
import Link from 'next/link'
import {MdDashboard} from 'react-icons/md'
import {RiPencilFill, RiShareForwardLine} from 'react-icons/ri'
import {RxChatBubble} from 'react-icons/rx'
import ReactPlayer from 'react-player';

type AppProps = {
  $id: string | undefined,
  $permissions: string[] | undefined,
  createdBy: string | undefined,
  created: Date | undefined,
  subject: string | undefined,
  starter: string | undefined,
  beat: string | undefined,
  countDocId: {
    topicId: string;
    count: number;
    $id: string;
}[] | undefined
}

const ParentTopicCard = ({$id, $permissions, createdBy, created, subject, starter, beat, countDocId}: AppProps) => {
  

  const canEdit = (userID:string | undefined, array: string[] | undefined) => {
    const result = array?.some((element) => element.includes('update') && element.includes(userID!))
    return result
  };

  return (
    <div className="parent-topic bg-slate-700 row-start-1 col-start-2 md:col-start-3 col-span-10 md:col-span-5 p-4">
          <div className="dash-edit-wrapper flex flex-row justify-between items-center">
            <Link href={'/dashboard'}>
              <div className="dashboard-icon flex flex-row items-center justify-start gap-2 hover:text-red-500">
                <MdDashboard size={22} className=' text-red-500' />
                <div>Back to Dashboard</div>
              </div>
            </Link>
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
            <div className="posted-by">Posted by <span className='text-red-400'>{createdBy}</span> | {new Date(created!).toDateString()}</div>
            <h1 className='font-bold text-3xl'>{subject}</h1>
            <div className="topic-body mt-4 whitespace-pre-wrap">
              {starter}
            </div>
            <div className="stats-bar text-slate-300 flex flex-row gap-3 mt-4">
              <div className="contributions-group flex flex-row justify-start items-center gap-2">
                <RxChatBubble size={22} />
                <span>{countDocId? countDocId[0].count : 0} contributions</span>
              </div>
              <div className="share-group flex flex-row justify-start items-center gap-2">
                <RiShareForwardLine size={22} />
                <span>Share</span>
              </div>
            </div>
          </div>
          <div className="sound-player mt-4">
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
            ) : null}
          </div>
        </div>
  )
}

export default ParentTopicCard