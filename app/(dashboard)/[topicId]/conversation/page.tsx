'use client'
import React, {FormEvent, useState, useRef, useEffect} from 'react'
import { useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import Link from 'next/link';
import { MdDashboard } from 'react-icons/md'
import { RxChatBubble, RxPerson } from 'react-icons/rx'
import { RiShareForwardLine, RiPencilFill } from 'react-icons/ri'
import { useUserStore } from '@/hooks/store';
import ReactPlayer, {ReactPlayerProps} from 'react-player';
import api from '@/api/api';

const Conversation = ({ params }: {params: {topicId: string}}) => {
  // const [comment, setComment] = useState('');
  const [mark, setMark] = useState('');
  const queryClient = useQueryClient();

  const docId = decodeURIComponent(params.topicId);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const {data: topic, isLoading, isError, error } = useQuery(['convoWithId'], () => api.fetchPostByTopicId(docId));
  const {data: conversations, isLoading: convoIsLoading, isError: convoIsError } = useQuery(['conversations'], () => api.fetchConversationByTopicId(docId))
  // const {data: count, isError: countIsError } = useQuery(['count'], () => api.fetchConversationCount(docId))
    const {data: countDocId} = useQuery(['countDocId'], () => api.fetchCommentCountByTopicId(docId))
  const user = useUserStore(state => state.user);
  const setContentToEdit = useUserStore(state => state.setContentToEdit);
  const setTitleToEdit = useUserStore(state => state.setTitleToEdit);
  const setEmailsToEdit = useUserStore(state => state.setEmailsForEdit);
  const setBeatToEdit = useUserStore(state => state.setBeatToEdit);
  const setIsPrivateForEdit = useUserStore(state => state.setIsPrivateToEdit);
  const setDocId = useUserStore(state => state.setCurrentDoc)

  topic?.starter && setContentToEdit(topic.starter)
  topic?.subject && setTitleToEdit(topic.subject);
  topic?.members && setEmailsToEdit(topic.members);
  topic?.isPrivate && setIsPrivateForEdit(topic.isPrivate);
  topic?.beat && setBeatToEdit(topic.beat);
  
  useEffect(() => {
    docId && setDocId(docId);

  },[docId])
  
  const handleSubmitComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(textareaRef.current?.value?.length === undefined) {
      alert('Please enter content to submit')
    }
    try {
      await api.submitCommentToTopicChain(textareaRef?.current?.value!, user?.name!, docId, user?.$id!, mark)
      await api.updateCommentCount(topic?.countDocId!, countDocId![0].count + 1 )
      setMark('')
      window.location.reload()
    }catch(err) {
      console.log(err)
    }
  }


  const canEdit = (userID:string | undefined, array: string[] | undefined) => {
    const result = array?.some((element) => element.includes('update') && element.includes(userID!))
    return result
  };

  console.log(countDocId)

  return (
      <div className='mt-[8vh] grid grid-cols-12 text-slate-200'>
        <div className="parent-topic bg-slate-700 row-start-1 col-start-2 md:col-start-3 col-span-10 md:col-span-5 p-4">
          <div className="dash-edit-wrapper flex flex-row justify-between items-center">
            <Link href={'/dashboard'}>
              <div className="dashboard-icon flex flex-row items-center justify-start gap-2">
                <MdDashboard size={22} className=' text-red-500' />
                <div>Dashboard</div>
              </div>
            </Link>
            {canEdit(user?.$id, topic?.$permissions) && (
              <div className="edit-button flex flex-row text-red-500">
                <RiPencilFill />
                <Link href={'/editpost2'}>
                  <span>edit</span>
                </Link>
              </div>
            )}
          </div>
          <div className="topic-card">
            <div className="posted-by">Posted by <span className='text-red-400'>{topic?.createdBy}</span> | {new Date(topic?.created!).toDateString()}</div>
            <h1 className='font-bold text-3xl'>{topic?.subject}</h1>
            <div className="topic-body mt-4 whitespace-pre-wrap">
              {topic?.starter}
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
            {topic?.beat?.includes("youtu") ? (
              <>
                <h2 className='mb-4 font-bold'>YouTube Beat</h2>
                <div className="player-wrapper relative pt-[56.25%]">
                  <ReactPlayer 
                    className='absolute top-0 left-0'
                    url={topic.beat}
                    width='100%'
                    height='100%'
                  />
                </div>
              </>
            ) : topic?.beat?.includes("soundcloud") ? (
              <>
                <h2 className='mb-4 font-bold'>Soundcloud Beat</h2>
                <div className="player-wrapper relative pt-[56.25%]">
                  <ReactPlayer 
                    className='absolute top-0 left-0'
                    url={topic.beat}
                    width='100%'
                    height='100%'
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
        <div className="submit-comment flex flex-col justify-start items-start row-start-2 col-start-2 md:col-start-3 md:col-span-5 col-span-10 p-4 bg-slate-700">
          <div className="comment-as mb-2">
            Comment as <span className='font-bold'>{user?.name}</span>
          </div>
          <div className="comment-field w-full p-3  outline outline-1 outline-slate-400 rounded-sm">
            <form onSubmit={handleSubmitComment}>
              <textarea 
                name="topic-reply" 
                id="topic-reply" 
                className='w-full p-2 text-slate-900 h-[30vh] focus-within:outline-none'
                ref={textareaRef}
                // value={comment}  
                // onChange={(e) => setComment(e.target.value)}
              >
              </textarea>
              <div className="comment-type-options mt-2 pt-2 flex flex-row flex-wrap justify-between items-end gap-4 border-solid border-t-2 border-slate-300">
              {/* <div className="comment-type-options grid grid-cols-6 gap-1 justify-items-center content-center pt-2 border-solid border-t-2 border-slate-300"> */}
                <div className="radio-option-group flex flex-row justify-start items-center gap-2">
                  <label htmlFor="comment">Comment</label>
                  <input type="radio" name="option-group" id="comment" onChange={() => setMark('comment')} required={true}/>
                </div>
                <div className="radio-option-group flex flex-row justify-start items-center gap-2">
                  <label htmlFor="verse">Verse</label>
                  <input type="radio" name="option-group" id="verse" onChange={() => setMark('verse')} />
                </div>
                <div className="radio-option-group flex flex-row justify-start items-center gap-2">
                  <label htmlFor="hook">Hook</label>
                  <input type="radio" name="option-group" id="hook" onChange={() => setMark('hook')} />
                </div>
                <div className="radio-option-group flex flex-row justify-start items-center gap-2">
                  <label htmlFor="other">Other</label>
                  <input type="radio" name="option-group" id="other" onChange={() => setMark('other')} />
                </div>
                <div className="button-group col-start-6 justify-self-end outline outline-1 outline-slate-400 rounded-full px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white">
                  <button type='submit' onSubmit={() =>handleSubmitComment}>Submit</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="conversation row-start-3 col-start-2 col-span-10 md:col-start-3 md:col-span-5 mb-4">
          {conversations?.map((convo) => (
            <div key={convo.$id} className='comment-wrapper bg-slate-800 text-white mt-4 relative'>
              <div className="info-row flex flex-row justify-start items-center gap-2 bg-slate-500 p-4">
                <div className="avatar">
                  <RxPerson size={22} />
                </div>
                <div className="username font-bold">
                  {convo.createdBy}
                </div>
                <div className="date-posted text-slate-300 ml-auto">
                  {new Date(convo.created).toLocaleTimeString()}
                </div>
              </div>
              <div className="content-group p-4">
                <div className="top-bar mb-2">
                  {convo.commentType}
                </div>
                <div className="content whitespace-pre-wrap">
                  {convo.content}
                </div>
              </div>
              {/* to do */}
              {/* fix delete function */}
              {/* {canDelete(user?.$id, convo?.$permissions) && (
                <button className="text-red-500 absolute bottom-1 right-4 opacity-30 hover:opacity-100" onClick={() => deleteCommentMutation.mutate(convo?.id)}>Delete</button>
              )} */}
              <div className="options">
              </div>
              
            </div>
          ))}
        </div>
      </div>
  )
}

export default Conversation
