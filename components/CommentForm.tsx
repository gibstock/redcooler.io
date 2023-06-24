import React, {useState, FormEvent, useRef, forwardRef, useEffect} from 'react'
import { useUserStore } from '@/hooks/store'
import { RxCross2 } from 'react-icons/rx'
import WordCount from './WordCount'
import api from '@/api/api'

type AppProps = {
  name: string | undefined,
  $id: string | undefined,
  topicCountDocId: string | undefined,
  docId: string,
  commentModalState: boolean,
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
  const [mark, setMark] = useState('')
  const [charTotal, setCharTotal] = useState(0)
  const [buttonValue, setButtonValue] = useState("Post")
  const userStore = useUserStore()
  const userProfile = userStore.userProfile;
  // const userAvatar = useUserStore(state => state.userAvatar);

  const {name, $id, topicCountDocId, docId, countDocId, commentModalState, setCommentModalState} = props
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const handleSubmitComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
        await api.submitCommentToTopicChain(textareaRef?.current?.value!, name!, docId!, $id!, mark, undefined, undefined, userProfile[0].avatarHref)
        await api.updateCommentCount(topicCountDocId!, countDocId![0].count + 1 )
        setMark('')
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

  
  return (
    <div className="submit-comment flex flex-col justify-start items-start row-start-2 col-start-2 md:col-start-3 md:col-span-5 col-span-10 p-4 bg-slate-700 rounded-b-md">
          <RxCross2 onClick={() => setCommentModalState(!commentModalState)} title='Cancel' size={22} className='text-4xl text-slate-300 hover:text-slate-100 mb-4 cursor-pointer'/>
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
                  <button 
                    type='submit' 
                    title='Post'
                    className='col-start-6 justify-self-end outline outline-1 outline-slate-400 rounded-full px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white disabled:bg-blue-200 disabled:cursor-not-allowed' 
                    disabled={buttonValue === "Posting..." ? true : false} 
                    onSubmit={() =>handleSubmitComment}
                  >
                    {buttonValue}
                  </button>
              </div>
            </form>
          </div>
        </div>
  )
})

CommentForm.displayName = 'CommentForm';

export default CommentForm