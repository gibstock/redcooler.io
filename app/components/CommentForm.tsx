import React, {useState, FormEvent, useRef, forwardRef, useEffect} from 'react'
import { useUserStore, commentModalStore } from '@/hooks/store'
import { RxCross2 } from 'react-icons/rx'
import { useRouter } from 'next/navigation'
import WordCount from './WordCount'
import Button from './Button'
import api from '@/api/api'

type AppProps = {
  name: string | undefined,
  $id: string | undefined,
  topicCountDocId: string | undefined,
  docId: string,
  commentModalState: boolean,
  isChildComment: boolean,
  parentCommentId?: string,
  setCommentModalState: (state: boolean) => void ,
  countDocId: {
    topicId: string;
    count: number;
    $id: string;
}[] | undefined
  
}

// interface Props {
//   children: ReactNode;
// }

const CommentForm = forwardRef<HTMLDivElement, AppProps>((props, ref) => {
  // const [mark, setMark] = useState('')
  const [charTotal, setCharTotal] = useState(0)
  const [buttonValue, setButtonValue] = useState("Post")
  const [modal, setModal] = useState(false);
  const userStore = useUserStore()
  const modalStore = commentModalStore()
  const userProfile = userStore.userProfile;
  const toggleModalActive = modalStore.toggleModalActive
  // const userAvatar = useUserStore(state => state.userAvatar);

  const router = useRouter()

  const {name, $id, topicCountDocId, docId, countDocId, commentModalState, setCommentModalState, isChildComment, parentCommentId} = props
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const handleSubmitComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(userProfile && userProfile[0].name === "Guest") {
      setModal(true)
      return
    }
    if(userProfile === null) {
      setModal(true)
      return
    }
    if(textareaRef.current?.value?.length === undefined) {
      alert('Please enter content to submit')
      return;
    }
    if(textareaRef.current && textareaRef.current?.value?.length > 1024) {
      alert("You are over the character limit, please edit your comment.")
      return;
    }
    setButtonValue("Posting...")
    try {
      if(userProfile !== null) {
        if(isChildComment && parentCommentId) {
          await api.submitCommentToTopicChain(textareaRef?.current?.value!, name!, docId!, $id!, "comment", parentCommentId, userProfile[0].avatarId, userProfile[0].avatarHref)
        } else {
          await api.submitCommentToTopicChain(textareaRef?.current?.value!, name!, docId!, $id!, "comment", undefined, userProfile[0].avatarId, userProfile[0].avatarHref)
        }
        await api.updateCommentCount(topicCountDocId!, countDocId![0].count + 1 )
        window.location.reload()
      } else {
        throw Error;
      }
    }catch(err) {
      console.log(err)
    }
  }
  useEffect(() => {
    if(commentModalState) {
      textareaRef.current?.focus();
    }
  }, [commentModalState])

 
  const handleCharChange = () => {
    if(textareaRef && textareaRef.current){
      setCharTotal(textareaRef.current.value.length)
    }
  }

  const handleCancel = () => {
    setModal(false)
  }

  return (
    <div className="submit-comment flex flex-col justify-start items-start row-start-2 col-start-2 md:col-start-3 md:col-span-5 col-span-10 p-4 bg-white dark:bg-slate-700 rounded-b-md">
      <RxCross2 onClick={() => {
        setCommentModalState(!commentModalState)
        toggleModalActive(false)
        }} title='Cancel' size={22} className='text-4xl text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100 mb-4 cursor-pointer'/>
      <div className="comment-as mb-2 text-xs">
        Comment as <span className='font-bold'>{name}</span>
      </div>
      <div className="comment-field w-full p-3  outline outline-1 outline-slate-400 rounded-sm relative">
        <form onSubmit={handleSubmitComment} className='relative'>
          <div className="textarea-wrap bg-white flex flex-col gap-0 w-full relative">
            <textarea 
              name="topic-reply" 
              id="topic-reply" 
              className='w-full pt-2 px-2 text-slate-900 h-[30vh] focus-within:outline-none'
              ref={textareaRef}
              onChange={handleCharChange}
            >
            </textarea>
            <div className="wordcount-wrapper w-full bg-white">
              <WordCount count={1024} words={charTotal} color='text-slate-800'/>
            </div>
          </div>
          <div className="comment-type-options text-xs mt-2 pt-2 flex flex-row flex-wrap justify-between items-end gap-4 border-solid border-t-2 border-slate-300">
            {/* <div className="radio-option-group flex flex-row justify-start items-center gap-2">
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
            </div> */}
            <Button 
              label={buttonValue}
              onClick={() =>handleSubmitComment}
              bgColor='bg-blue-600'
              fontColor='text-white'
              padding='px-2 py-1'
              hover='hover:bg-blue-500'
              disabled={buttonValue === "Posting..." ? true : false} 
              disabledConditions='disabled:bg-blue-200 disabled:cursor-not-allowed'
              outline='outline outline-1 outline-slate-400'
              type='submit' 
            />
            {modal && (
              <div className='modal-wrapper top-0 left-0 w-full h-full'>
                <div className="overlay absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
                <div className="modal absolute top-[30%] left-0 w-full bg-black p-4 flex flex-col gap-1">
                  <header>
                    <h1 className='text-slate-200 text-xl font-bold'>Only registered users can do that.</h1>
                  </header>
                  <div className="body text-slate-300">
                    <p>Would you like to sign up?</p>
                  </div>
                  <div className="responses flex flex-row justify-around items-center">
                    {/* <button className='text-slate-400' onClick={() => router.push('/signup')}>Yes!</button> */}
                    <button className='text-slate-100 w-full font-bold bg-blue-500 hover:bg-blue-400 py-1 px-5 rounded-full' onClick={() => router.push('/signup')}>Yes!</button>
                    <button className='text-slate-400 w-full hover:text-slate-200' onClick={handleCancel}>Keep Browsing</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
})

CommentForm.displayName = 'CommentForm';

export default CommentForm