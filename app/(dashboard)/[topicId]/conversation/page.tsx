'use client'
import React, {useEffect, useState, useRef,  } from 'react'
import { useQuery} from '@tanstack/react-query';
import { useUserStore } from '@/hooks/store';
import CommentCard from '@/components/CommentCard';
import CommentForm from '@/components/CommentForm';
import ParentTopicCard from '@/components/ParentTopicCard';
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
  // const setDocId = useUserStore(state => state.setCurrentDoc)
  const setTopicId = useUserStore(state => state.setTopicId)
  const [commentFormModal, setCommentFormModal] = useState(false)


  topic?.starter && setContentToEdit(topic.starter)
  topic?.subject && setTitleToEdit(topic.subject);
  topic?.members && setEmailsToEdit(topic.members);
  topic?.isPrivate && setIsPrivateForEdit(topic.isPrivate);
  topic?.beat && setBeatToEdit(topic.beat);

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

  },[topicId, setTopicId])
  
  return (
      <div className='mt-[8vh] md:grid grid-cols-12 w-full text-slate-200'>
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
          />
        )}
        {commentFormModal && <CommentForm 
          name={user?.name}
          $id={user?.$id}
          topicCountDocId={topic?.countDocId}
          countDocId={countDocId}
          docId={topicId}
          ref={commentFormRef}
        />}
        
        <div className="conversation row-start-3 col-start-2 col-span-10 md:col-start-3 md:col-span-5 mb-4">
          {conversations?.map((convo, i) => (
            <CommentCard 
              $id={convo.$id}
              userAccountId={convo.userAccountId}
              $permissions={convo.$permissions}
              createdBy={convo.createdBy}
              created={convo.created}
              commentType={convo.commentType}
              content={convo.content}
              topicId={topicId}
              avatarId={convo.avatarId}
              avatarHref={convo.avatarHref}
              key={convo.$id}
            />
          ))}
        </div>
        {/* add comment modal button */}
        <div className="modal-button bg-[hsl(0_0%_10%)] flex flex-row justify-stretch items-center fixed bottom-0 left-0 px-2 pb-4 pt-2 w-full">
          <button className='p-2 text-xs bg-slate-800 text-slate-400/90 w-full text-left rounded-md' onClick={handleCommentModalClick}>Add Comment</button>
        </div>
      </div>
  )
}

export default Conversation
