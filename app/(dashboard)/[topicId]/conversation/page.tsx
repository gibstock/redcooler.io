'use client'
import React from 'react'
import { useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import Link from 'next/link';
import { MdChatBubbleOutline, MdDashboard } from 'react-icons/md'
import { RxChatBubble } from 'react-icons/rx'
import { RiShareForwardLine } from 'react-icons/ri'
import { useUserStore } from '@/hooks/store';
import api from '@/api/api';

const Conversation = ({ params }: {params: {topicId: string}}) => {
  const queryClient = useQueryClient();

  const docId = decodeURIComponent(params.topicId);

  console.log("docId", docId)

  const {data: topic, isLoading, isError, error } = useQuery(['convoWithId'], () => api.fetchPostByTopicId(docId));
  const user = useUserStore(state => state.user);

  console.log("huh",topic?.starter)
  return (
      <div className='mt-[8vh] grid grid-cols-12 bg-slate-100'>
        <div className="parent-topic bg-white row-start-1 col-start-2 md:col-start-3 col-span-10 md:col-span-5 p-4">
          <Link href={'/dashboard'}>
            <div className="dashboard-icon flex flex-row items-center justify-start gap-2">
              <MdDashboard size={22} />
              <div>Dashboard</div>
            </div>
          </Link>
          <div className="topic-card">
            <div className="posted-by">Posted by {topic?.createdBy} | {new Date(topic?.created!).toDateString()}</div>
            <h1 className='font-bold text-3xl'>{topic?.subject}</h1>
            <div className="topic-body mt-4">
              {topic?.starter}
            </div>
            <div className="stats-bar text-slate-500 flex flex-row gap-3 mt-4">
              <div className="contributions-group flex flex-row justify-start items-center gap-2">
                <RxChatBubble size={22} />
                <span>10 contributions</span>
              </div>
              <div className="share-group flex flex-row justify-start items-center gap-2">
                <RiShareForwardLine size={22} />
                <span>Share</span>
              </div>
            </div>
          </div>
        </div>
        <div className="submit-comment flex flex-col justify-start items-start bg-white row-start-2 col-start-2 md:col-start-3 md:col-span-5 col-span-10 p-4">
          <div className="comment-as">
            Comment as {user?.name}
          </div>
          <div className="comment-field w-full p-3  outline outline-1 outline-slate-400 rounded-sm">
            <form className=''>
              <textarea name="topic-reply" id="topic-reply" className='w-full h-[30vh] focus-within:outline-none'></textarea>
              {/* <div className="comment-type-options flex flex-row items-end gap-4 border-solid border-t-2 border-slate-300"> */}
              <div className="comment-type-options grid grid-cols-6 gap-1 justify-items-center content-center pt-2 border-solid border-t-2 border-slate-300">
                <div className="radio-option-group flex flex-row justify-start items-center gap-2">
                  <label htmlFor="comment">Comment</label>
                  <input type="radio" name="option-group" id="comment" defaultChecked/>
                </div>
                <div className="radio-option-group flex flex-row justify-start items-center gap-2">
                  <label htmlFor="verse">Verse</label>
                  <input type="radio" name="option-group" id="verse" />
                </div>
                <div className="radio-option-group flex flex-row justify-start items-center gap-2">
                  <label htmlFor="hook">Hook</label>
                  <input type="radio" name="option-group" id="hook" />
                </div>
                <div className="radio-option-group flex flex-row justify-start items-center gap-2">
                  <label htmlFor="other">Other</label>
                  <input type="radio" name="option-group" id="other" />
                </div>
                <div className="button-group col-start-6 justify-self-end outline outline-1 outline-slate-400 rounded-full px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white">
                  <button>Submit</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="conversation bg-white row-start-3 col-start-2 col-span-10 md:col-start-3 md:col-span-5">
          conersations
        </div>
      </div>
  )
}

export default Conversation