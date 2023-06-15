import React, {useState} from 'react'
import { useRouter } from 'next/navigation'
import {RiPencilFill} from 'react-icons/ri'
import {RxPerson, RxDotsVertical} from 'react-icons/rx'
import {TbTrashX} from 'react-icons/tb'
import { useUserStore } from '@/hooks/store';


type AppProps = {
  $id: string,
  userAccountId: string,
  $permissions: string[],
  createdBy: string,
  created: Date,
  commentType: string,
  content: string,
}

const CommentCard = ({$id, userAccountId, $permissions, createdBy, created, commentType, content} : AppProps) => {
  const [commentMenuOpen, setCommentMenuOpen] = useState(false)
  const setCommentToEdit = useUserStore(state => state.setCommentToEdit)
  const setMark = useUserStore(state => state.setMark)
  const setCommentId = useUserStore(state => state.setCommentId)
  const router = useRouter();

  const canEdit = (userID:string | undefined, array: string[] | undefined) => {
    const result = array?.some((element) => element.includes('update') && element.includes(userID!))
    return result
  };
  const canDelete = (userID:string | undefined, array: string[] | undefined) => {
    const result = array?.some((element) => element.includes('delete') && element.includes(userID!))
    return result
  };

  const handleEditComment = () => {
    setCommentToEdit(content)
    setMark(commentType)
    setCommentId($id)
    router.push('/editcomment')
  }

  return (
    <div key={$id} className='comment-wrapper bg-slate-800 text-white mt-4 relative rounded-b-md'>
              <div className="info-row flex flex-row justify-start items-center gap-2 bg-slate-500 p-4 rounded-t-md relative">
                {commentMenuOpen && (
                  <div className="comment-menu-dropdown p-3 absolute top-[7vh] right-0 bg-[hsl(200_15%_10%)] max-w-[340px] w-[15vw] h-[20vh]">
                    {canEdit(userAccountId, $permissions) && (
                      <div className="edit-button flex flex-row items-center text-red-500 hover:text-red-300">
                        <RiPencilFill />
                        <button onClick={handleEditComment}>
                          <span>edit</span>
                        </button>
                      </div>
                    )}
                    {/* {canDelete(userAccountId, $permissions) && (
                      <div className="edit-button flex flex-row items-center text-red-500 hover:text-red-300">
                        <TbTrashX />
                        <Link href={'/editpost2'}>
                          <span>delete</span>
                        </Link>
                      </div>
                    )} */}
                  </div>
                )}
                <div className="avatar">
                  <RxPerson size={22} />
                </div>
                <div className="username font-bold">
                  {createdBy}
                </div>
              
                <div className="date-posted text-slate-300 ml-auto">
                  {new Date(created).toLocaleTimeString()}
                </div>
                <button className="comment-menu" onClick={() => setCommentMenuOpen(!commentMenuOpen)}>
                  <RxDotsVertical />
                </button>
              </div>
              <div className="content-group p-4">
                <div className="top-bar mb-2">
                  {commentType}
                </div>
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