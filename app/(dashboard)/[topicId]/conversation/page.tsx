'use client'
import React, {useEffect, useState, useRef,  } from 'react'
import { useQuery} from '@tanstack/react-query';
import { useUserStore } from '@/hooks/store';
import CommentCard from '@/components/CommentCard';
import CommentForm from '@/components/CommentForm';
import ParentTopicCard from '@/components/ParentTopicCard';
import ChildCommentCard from '@/components/ChildCommentCard';
import api from '@/api/api';

const Conversation = ({ params }: {params: {topicId: string}}) => {
  const topicId = decodeURIComponent(params.topicId);

  const {data: topic, isLoading, isError, error } = useQuery(['convoWithId'], () => api.fetchPostByTopicId(topicId));
  const {data: conversations, isLoading: convoIsLoading, isError: convoIsError } = useQuery(['conversations'], () => api.fetchConversationByTopicId(topicId))
  const {data: countDocId} = useQuery(['countDocId'], () => api.fetchCommentCountByTopicId(topicId))
  const user = useUserStore(state => state.user);
  const setContentToEdit = useUserStore(state => state.setContentToEdit);
  const setTitleToEdit = useUserStore(state => state.setTitleToEdit);
  const setEmailsToEdit = useUserStore(state => state.setEmailsForEdit);
  const setBeatToEdit = useUserStore(state => state.setBeatToEdit);
  const setIsPrivateForEdit = useUserStore(state => state.setIsPrivateToEdit);
  const setTopicId = useUserStore(state => state.setTopicId)
  const [commentFormModal, setCommentFormModal] = useState(false)
  
  // topic?.starter && setContentToEdit(topic.starter)
  // topic?.subject && setTitleToEdit(topic.subject);
  // topic?.members && setEmailsToEdit(topic.members);
  // topic?.isPrivate && setIsPrivateForEdit(topic.isPrivate);
  // topic?.beat && setBeatToEdit(topic.beat);

  const commentFormRef = useRef<HTMLDivElement>(null);
  const commentFormScrollIntoView = () => commentFormRef.current?.scrollIntoView()
  const handleCommentModalClick = () => {
    setCommentFormModal(!commentFormModal)
    if(commentFormModal === true) {
      commentFormScrollIntoView()
      commentFormRef.current?.focus()
    }
  }
  useEffect(() => {
    topicId && setTopicId(topicId);
    topic?.starter && setContentToEdit(topic.starter)
    topic?.subject && setTitleToEdit(topic.subject);
    topic?.members && setEmailsToEdit(topic.members);
    topic?.isPrivate && setIsPrivateForEdit(topic.isPrivate);
    topic?.beat && setBeatToEdit(topic.beat);

  },[topicId, setTopicId, topic])
  
  return (
      <div className='mt-[8vh] md:grid grid-cols-12 w-full text-slate-900 dark:text-slate-200'>
        {topic && (
          <ParentTopicCard 
            $id={user?.$id}
            $permissions={topic?.$permissions}
            createdBy={topic?.createdBy}
            created={topic?.created}
            subject={topic?.subject}
            starter={topic?.starter}
            beat={topic?.beat}
            countDocId={countDocId}
            avatarId={topic?.userAvatarId}
            userAvatarHref={topic.userAvatarHref}
            audioFileId={topic.audioFileId}
          />
        )}
        {/* <div className="modal-button bg-[hsl(0_0%_10%)] flex flex-row justify-stretch items-center px-2 pb-4 pt-2 w-full">
          <button className='p-2 text-xs bg-slate-800 text-slate-300 w-full text-left rounded-md' onClick={handleCommentModalClick}>Add Comment</button>
        </div> */}
        {commentFormModal && <CommentForm 
          name={user?.name}
          $id={user?.$id}
          topicCountDocId={topic?.countDocId}
          countDocId={countDocId}
          docId={topicId}
          ref={commentFormRef}
          commentModalState={commentFormModal}
          setCommentModalState={setCommentFormModal}
          isChildComment={false}
        />}
        
        <div className="conversation row-start-3 col-start-2 col-span-10 md:col-start-3 md:col-span-5 mb-4">
          {topic && conversations?.map((convo, i) => (
            <div key={i}>
              {convo.parentConversationId === null ? (
                <CommentCard 
                  $id={convo.$id}
                  userAccountId={convo.userAccountId}
                  $permissions={convo.$permissions}
                  createdBy={convo.createdBy}
                  created={convo.created}
                  commentType={convo.commentType}
                  content={convo.content}
                  topicId={topicId}
                  parentConversationId={convo.parentConversationId}
                  avatarId={convo.avatarId}
                  avatarHref={convo.avatarHref}
                  convoCountDocId={topic?.countDocId}
                  countDocId={countDocId}
                  key={convo.$id}
                />

              ): (
                null
              )}
            </div>
          ))}
        </div>
        {/* add comment modal button */}
        {/* Button should dissapear when the comment form is active  */}
        {!commentFormModal && 
        <div className="modal-button bg-white dark:bg-dark-black flex flex-row justify-stretch items-center fixed bottom-0 left-0 px-2 pb-4 pt-4 w-full">
          <button className='px-2 py-4 text-sm bg-[hsl(200,45%,95%)] dark:bg-slate-800 dark:text-slate-300 w-full text-center rounded-md' onClick={handleCommentModalClick}>Add Comment</button>
        </div>
        }
      </div>
  )
}

export default Conversation
