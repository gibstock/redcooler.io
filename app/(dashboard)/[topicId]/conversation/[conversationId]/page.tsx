import React from 'react'
import { useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import api from '@/api/api';

const Conversation = ({ params }: {params: {topicId: string, conversationId: string}}) => {
  const queryClient = useQueryClient();

  const {data, isLoading, isError, error } = useQuery(['convoWithId'], () => api.fetchPostByTopicId(params.topicId, params.conversationId));


  console.log("huh",params)
  return (
    <div className='w-screen h-screen flex flex-row justify-center items-center'>Topic: {decodeURIComponent(params.topicId)}</div>
  )
}

export default Conversation