import React, {useState, useRef} from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import {RiPencilFill, RiReplyLine} from 'react-icons/ri'
import {RxPerson, RxDotsVertical, RxCross2} from 'react-icons/rx'
import {TbTrashX} from 'react-icons/tb'
import { useUserStore, commentModalStore } from '@/hooks/store';
import { timeSince } from '@/utils/helpers'
import ChildCommentCard from './ChildCommentCard'
import CommentForm from './CommentForm'
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
  convoCountDocId: string,
  countDocId: {
    topicId: string;
    count: number;
    $id: string;
}[] | undefined,
  parentConversationId?: string,
}

const CommentCard = ({$id, userAccountId, $permissions, createdBy, created, commentType, content, convoCountDocId, countDocId, topicId, avatarId, avatarHref, parentConversationId} : AppProps) => {
  const {data: childConvos, isLoading, isError } = useQuery({
    queryKey: ['child-convos', $id], 
    queryFn: () => api.fetchConversationsByParentId($id), 
    enabled: Boolean($id),
  })
  const [commentMenuOpen, setCommentMenuOpen] = useState(false)
  const [deleteBtnValue, setDeleteBtnValue] = useState('delete')
  // const [commentAvatarHref, setCommentAvatarHref] = useState('');
  const toggleModalActive = commentModalStore(state => state.toggleModalActive);

  const setCommentToEdit = useUserStore(state => state.setCommentToEdit)
  const setMark = useUserStore(state => state.setMark)
  const setCommentId = useUserStore(state => state.setCommentId)
  const [commentFormModal, setCommentFormModal] = useState(false)
  // const imageUrlMap = useUserStore(state => state.imageUrlMap);
  const user = useUserStore(state => state.user)
  const router = useRouter();

  const commentFormRef = useRef<HTMLDivElement>(null);


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
      setDeleteBtnValue('deleting')
      const count = await api.fetchCommentCountByTopicId(topicId)
      deleteCommentMutation.mutate($id);
      await api.updateCommentCount(count[0].$id, count[0].count - 1);
      router.refresh()
    } catch(err) {
      console.error(err)
    }
  }

  const handleReply = async() => {
    setCommentFormModal(!commentFormModal)
    toggleModalActive(true)
  }

  return (
    <div key={$id} className='comment-wrapper bg-transparent border-b border-b-slate-300/50 text-slate-900 dark:text-white mt-4 relative'>
      <div className="info-row flex flex-row justify-between items-center gap-2 bg-transparent px-4 py-1 relative">
        {commentMenuOpen && (
          <div className="comment-menu-dropdown flex flex-col justify-center items-start gap-2 p-3 absolute top-[7vh] right-0 bg-[hsl(200_10%_20%)] ">
            {canEdit(user?.$id!, $permissions) && (
              <div className="edit-button flex flex-row gap-2 items-center text-xs text-red-500 hover:text-red-300">
                <RiPencilFill size={14} />
                <button onClick={handleEditComment}>
                  <span>edit</span>
                </button>
              </div>
            )}
            {canDelete(user?.$id!, $permissions) && (
              <div className="edit-button flex flex-row gap-2 items-center text-xs text-red-500 hover:text-red-300">
                <TbTrashX size={14}/>
                <button disabled={deleteBtnValue === 'deleting' ? true : false} onClick={() => handleDeleteComment(topicId)}>
                  <span>{deleteBtnValue}</span>
                </button>
              </div>
            )}
            {!canEdit(user?.$id!, $permissions) && <div className='text-xs'>No Permissions</div>}
          </div>
        )}
        <div className="avatar-user flex flex-row justify-start items-center gap-2">
          {/* <div className="avatar-wrap"> */}
            {avatarHref && avatarHref !== null ? (
              <Image 
                src={avatarHref}
                width={24}
                height={24}
                alt='User avatar'
                className='rounded-full object-cover max-h-6'
              />
            ): (
              <div className="avatar">
                <RxPerson size={22} />
              </div>
            )}
          {/* </div> */}
          <div className="username font-bold justify-self-start text-xs text-slate-400">
            {createdBy}
          </div>
        </div>
        {/* <div className="top-bar">
          {commentType}
        </div> */}
        <div className="date-dots flex flex-row justify-end items-center gap-3">
          <div className="date-posted text-slate-400 text-xs">
          {timeSince(new Date(created))}
          </div>
          <button className="comment-menu" onClick={() => setCommentMenuOpen(!commentMenuOpen)}>
            {commentMenuOpen ? (
              <RxCross2 />
            ): (
              <RxDotsVertical />
            )}
          </button>
        </div>
      </div>
      <div className="content-group px-4 pt-4">
        {/* <div className="top-bar mb-2">
          {commentType}
        </div> */}
        <div className="content whitespace-pre-wrap text-sm">
          {content}
        </div>
        <div className="options w-full flex flex-row justify-end items-center">
          <div className="items-wrap flex flex-row justify-center items-center" onClick={handleReply}>
            <RiReplyLine />
            <span className='text-xs'>Reply</span>
          </div>
        </div>
      {commentFormModal && <CommentForm 
          name={user?.name}
          $id={user?.$id}
          topicCountDocId={convoCountDocId}
          countDocId={countDocId}
          docId={topicId}
          ref={commentFormRef}
          commentModalState={commentFormModal}
          setCommentModalState={setCommentFormModal}
          isChildComment={true}
          parentCommentId={$id}
        />}
      </div>
      <div className="child-comments pl-4">
        {childConvos && childConvos.documents && childConvos.documents.map((convo: AppProps) => (
          <ChildCommentCard 
            $id={convo.$id}
            userAccountId={convo.userAccountId}
            $permissions={convo.$permissions}
            createdBy={convo.createdBy}
            created={convo.created}
            commentType={convo.commentType}
            content={convo.content}
            topicId={topicId}
            parentConversationId={convo.parentConversationId}
            convoCountDocId={convoCountDocId}
            avatarId={convo.avatarId}
            avatarHref={convo.avatarHref}
            countDocId={countDocId}
            key={convo.$id}
          />
        ))}
      </div>
    </div>
  )
}

export default CommentCard