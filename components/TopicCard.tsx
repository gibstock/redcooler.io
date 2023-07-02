import React, { useEffect, useState} from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { truncate, timeSince } from '@/utils/helpers';
import { RxChatBubble, RxDotsVertical, RxCross2 } from 'react-icons/rx';
import {TbTrashX} from 'react-icons/tb'
import { categories } from '@/constants/categories';
import { useUserStore } from '@/hooks/store';
import api from '@/api/api';
import Image from 'next/image';
import Link from 'next/link';


type AppProps = {
  $id: string,
  subject: string,
  createdBy: string,
  created: Date,
  starter: string,
  category: string,
  boardType: string,
  $permissions?: string[],
  userId?: string,
  hasDeleteButton: boolean,
  countDocId: string,
  canDelete?: boolean,
  database: string
  isPreview?: boolean,
  beat?: string,
  userAvatarId?: string | null,
  audioFileId?: string | null,
}

const TopicCard = ({$id, subject, createdBy, created, starter, $permissions, userId, canDelete, database, hasDeleteButton, isPreview, beat, category, boardType, userAvatarId, audioFileId, countDocId}: AppProps) => {
  const [youTubeImg, setYouTubeImg] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [userInitialsHref, setUserInitialsHref] = useState('')
  const [communityIcon, setCommunityIcon] = useState('')
  const [convoCount, setConvoCount] = useState(0);
  const [deleting, setDeleting] = useState('Delete');
  const [commentMenuOpen, setCommentMenuOpen] = useState(false)
  const imageUrlMap = useUserStore(state => state.imageUrlMap)

  const queryClient = useQueryClient();
  const router = useRouter();


  useEffect(() => {
    const youtbeImageExtraction = () => {
      const result = beat?.match("([^\/]+$)")
      if(result && result[0]) {
        setYouTubeImg(result[0])
      }
    }
    const getUserAvatar = async () => {
      // get user profile
      // get proile_pic_id
      // get img url from imagemap
      if(userAvatarId !== null && userAvatarId !== undefined) {
        if(imageUrlMap) {
          const avId = imageUrlMap.get(userAvatarId)
          avId !== undefined && setUserAvatar(avId)
        }
      } else {
        const userInitials = await api.getUserInitials(createdBy)
        setUserInitialsHref(userInitials.href)
      }
    }
    const getCommunityIcon = async () => {
      const categoryName = categories[category as keyof typeof categories]
      const communityIcon = await api.getUserInitials(categoryName)
      setCommunityIcon(communityIcon.href)
    }
    const getConvoCount = async() => {
      const convos = await api.fetchCommentCountByTopicId($id);
      setConvoCount(convos[0].count);
    }
    youtbeImageExtraction()
    getUserAvatar();
    getCommunityIcon();
    getConvoCount();
  }, [beat])

  const deleteTopicMutation = useMutation({
    mutationFn: api.deleteTopic, 
    onSuccess: () => {
      queryClient.invalidateQueries([`${boardType}-topics`]);
    }
  })
  const deleteConversationMutation = useMutation({
    mutationFn: api.deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries([`${boardType}-topics`]);
    }
  })
  const deleteConvoCountMutation = useMutation({
    mutationFn: api.deleteConvoCount,
    onSuccess: () => {
      queryClient.invalidateQueries([`${boardType}-topics`])
    }
  })

  const deleteAudioFileMutation = useMutation({
    mutationFn: api.deleteAudioFile,
    onSuccess: () => {
      queryClient.invalidateQueries([`${boardType}-topics`])
    }
  })

  const handleDelete = async (topicId: string, countDocId: string) => {
    if(window.confirm("Are you sure you want to delete this post?") === false) return;
    setDeleting("Deleting...")
    try {
       await api.deleteTopic(topicId);
      // deleteTopicMutation.mutate(topicId)
      console.log("topic deleted")
      await api.deleteConvoCount(countDocId)
      // deleteConvoCountMutation.mutate(countDocId);
      console.log("count deleted")
      await api.deleteConversation(topicId);
      // deleteConversationMutation.mutate(topicId)
      console.log("convo deleted")
      if(audioFileId !== null && audioFileId !== undefined) {
        await api.deleteAudioFile(audioFileId)
        // deleteAudioFileMutation.mutate(audioFileId);
        console.log("audioFile deleted")
      }else {
        console.log("no audio file found")
      }
      router.push('/dashboard');
      // window.location.reload()
    } catch(err) {
      console.error("Error deleting, something...",err)
    }
  }
  // const handleDeleteMutations = async (topicId: string, countDocId: string) => {
  //   if(window.confirm("Are you sure you want to delete this post?") === false) return;
  //   setDeleting("Deleting...")
  //   try {
  //     deleteTopicMutation.mutate(topicId)
  //     console.log("topic deleted")
  //     deleteConvoCountMutation.mutate(countDocId);
  //     console.log("count deleted")
  //     deleteConversationMutation.mutate(topicId)
  //     console.log("convo deleted")
  //     if(audioFileId !== null && audioFileId !== undefined) {
  //       deleteAudioFileMutation.mutate(audioFileId);
  //       console.log("audioFile deleted")
  //     }else {
  //       console.log("no audio file found")
  //     }
  //     window.location.reload()
  //   } catch(err) {
  //     console.error("Error deleting, something...",err)
  //   }
  // }

  return (
    <li key={$id} className="flex flex-col bg-white dark:bg-dark-black py-1 px-4 rounded-sm outline outline-3 outline-transparent dark:outline-1 dark:outline-slate-700 hover:opacity-70 dark:shadow-none shadow-[0_0px_30px_0px_hsl(200_35%_90%)]">
      <div className="byline flex flex-row items-center justify-start text-xs text-slate-800 dark:text-slate-400">
        {commentMenuOpen && (
          <div className="comment-menu-dropdown flex flex-col justify-center items-start gap-2 p-3 absolute top-[7vh] right-0 bg-[hsl(200_10%_20%)] ">
            {hasDeleteButton && (
              <div className="edit-button flex flex-row gap-2 items-center text-xs text-red-500 hover:text-red-300">
                <TbTrashX size={14}/>
                <button onClick={() => handleDelete($id, countDocId)}>
                {/* <button onClick={() => handleDeleteMutations($id, countDocId)}> */}
                  <span>{deleting}</span>
                </button>
              </div>
            )}
            {!hasDeleteButton && <div className='text-xs'>No Permissions</div>}
          </div>
        )}
        <div className="community-badge-name flex flex-row justify-start items-center gap-1 mr-2">
          <div className="community-badge flex justify-center items-center dark:bg-slate-200 text-slate-900 font-extrabold border border-slate-400 rounded-full w-6 h-6">
            {category.slice(0,1).toUpperCase()}
          </div>
          <span className='text-slate-800 dark:text-slate-200'>{categories[category as keyof typeof categories]}</span>
        </div>
        
        <div className="right-group flex flex-row mr-2">
            {/* <span>Posted by</span> */}
            <h3 className='font-bold'>{createdBy}</h3>
        </div>
        <div className="created">
            {/* {new Date(created).toDateString().split(' ').slice(1).join(' ')} */}
            {/* {new Date(created).toLocaleDateString('es-pa')} */}
        </div>
        <div className="date-dots flex flex-row justify-end items-center">
          <div className="date-posted text-slate-400 text-xs">
            {timeSince(new Date(created))}
          </div>
          {/* <button className="comment-menu" onClick={() => setCommentMenuOpen(!commentMenuOpen)}>
            {commentMenuOpen ? (
              <RxCross2 />
            ): (
              <RxDotsVertical />
            )}
          </button> */}
        </div>
        {/* {hasDeleteButton && <button className="text-red-500 absolute top-1 right-4 opacity-30 hover:opacity-100" onClick={() => handleDeleteMutations($id, countDocId)}>{deleting}</button>} */}
        
      </div>
      <Link href={`${$id}/conversation/`}>
        <div className="title-group flex flex-row my-2">
          <h2 className="font-semibold text-sm dark:text-slate-200">
            {subject}
          </h2>
        </div>
          {beat && 
            (
              <div className="thumbs flex flex-row justify-center items-center shadow-sm shadow-[hsl(200_55%_40%)] mb-2">
                  <Image 
                  src={`http://img.youtube.com/vi/${youTubeImg}/0.jpg`}
                  width={480}
                  height={270}
                  alt='youtube thumbnail'
                />
              </div>
            ) 
          }
        <div className='whitespace-pre-wrap text-xs dark:text-slate-200'>{isPreview? (truncate(starter, 50)) : (starter)}</div>
        <div className="button-group text-xs flex flex-row justify-start items-center my-2">
          <div className="contributions-group flex flex-row justify-start items-center gap-2 text-slate-500">
            <RxChatBubble />
            <span>{convoCount} {convoCount > 1 || convoCount < 1 ? ("comments"):("comment")}</span>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default TopicCard