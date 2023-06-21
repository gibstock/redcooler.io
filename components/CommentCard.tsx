import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {RiPencilFill} from 'react-icons/ri'
import {RxPerson, RxDotsVertical} from 'react-icons/rx'
import {TbTrashX} from 'react-icons/tb'
import { useUserStore } from '@/hooks/store';
import api from '@/api/api'


type AppProps = {
  $id: string,
  userAccountId: string,
  $permissions: string[],
  createdBy: string,
  created: Date,
  commentType: string,
  content: string,
  topicId: string,
  avatarId?: string,
  avatarHref?: string,
}

const CommentCard = ({$id, userAccountId, $permissions, createdBy, created, commentType, content, topicId, avatarId, avatarHref} : AppProps) => {
  const [commentMenuOpen, setCommentMenuOpen] = useState(false)
  const [commentAvatarHref, setCommentAvatarHref] = useState('');
  const setCommentToEdit = useUserStore(state => state.setCommentToEdit)
  const setMark = useUserStore(state => state.setMark)
  const setCommentId = useUserStore(state => state.setCommentId)
  const imageUrlMap = useUserStore(state => state.imageUrlMap);
  const user = useUserStore(state => state.user)
  const router = useRouter();

  const queryClient = useQueryClient();

  const canEdit = (userID:string, array: string[] | undefined) => {
    const result = array?.some((element) => element.includes('update') && element.includes(userID))
    return result
  };
  const canDelete = (userID:string, array: string[] | undefined) => {
    const result = array?.some((element) => element.includes('delete') && element.includes(userID))
    return result
  };

  const deleteCommentMutation = useMutation({
    mutationFn: api.deleteConverstaionWithId,
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations'])
    }
  });

  const handleEditComment = () => {
    setCommentToEdit(content)
    setMark(commentType)
    setCommentId($id)
    router.push('/editcomment')
  }

  const handleDeleteComment = async (topicId: string) => {
    try {
      const count = await api.fetchCommentCountByTopicId(topicId)
      deleteCommentMutation.mutate($id);
      await api.updateCommentCount(count[0].$id, count[0].count - 1);
      router.refresh()
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <div key={$id} className='comment-wrapper bg-slate-800 text-white mt-4 relative rounded-b-md'>
      <div className="info-row flex flex-row justify-between items-center gap-2 bg-slate-500 px-4 py-1 rounded-t-md relative">
        {commentMenuOpen && (
          <div className="comment-menu-dropdown p-3 absolute top-[7vh] right-0 bg-[hsl(200_10%_20%)] max-w-[340px] w-[15vw] h-[20vh]">
            {canEdit(user?.$id!, $permissions) && (
              <div className="edit-button flex flex-row items-center text-red-500 hover:text-red-300">
                <RiPencilFill />
                <button onClick={handleEditComment}>
                  <span>edit</span>
                </button>
              </div>
            )}
            {canDelete(user?.$id!, $permissions) && (
              <div className="edit-button flex flex-row items-center text-red-500 hover:text-red-300">
                <TbTrashX />
                <button onClick={() => handleDeleteComment(topicId)}>
                  <span>delete</span>
                </button>
              </div>
            )}
          </div>
        )}
        <div className="avatar-user flex flex-row justify-start items-center gap-1">
          {avatarHref && avatarHref !== null ? (
            <Image 
              src={avatarHref}
              width={35}
              height={35}
              alt='User avatar'
              className='rounded-full'
            />
          ): (
            <div className="avatar">
              <RxPerson size={22} />
            </div>
          )}
          <div className="username font-bold justify-self-start">
            {createdBy}
          </div>
        </div>
        <div className="top-bar">
          {commentType}
        </div>
        <div className="date-dots flex flex-row justify-end items-center gap-3">
          <div className="date-posted text-slate-300">
            {new Date(created).toLocaleTimeString()}
          </div>
          <button className="comment-menu" onClick={() => setCommentMenuOpen(!commentMenuOpen)}>
            <RxDotsVertical />
          </button>
        </div>
      </div>
      <div className="content-group p-4">
        {/* <div className="top-bar mb-2">
          {commentType}
        </div> */}
        <div className="content whitespace-pre-wrap">
          {content}
        </div>
      </div>
      <div className="options">
      </div>
    </div>
  )
}

export default CommentCard