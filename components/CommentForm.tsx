import React, {useState, FormEvent, useRef} from 'react'
import api from '@/api/api'

type AppProps = {
  name: string | undefined,
  $id: string | undefined,
  topicCoundDocId: string | undefined,
  docId: string,
  countDocId: {
    topicId: string;
    count: number;
    $id: string;
}[] | undefined
  
}

const CommentForm = ({name, $id, topicCoundDocId, countDocId, docId}: AppProps) => {
  const [mark, setMark] = useState('')
  const [buttonValue, setButtonValue] = useState("Post")

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const handleSubmitComment = async (e: FormEvent<HTMLFormElement>) => {
    setButtonValue("Posting...")
    e.preventDefault()
    if(textareaRef.current?.value?.length === undefined) {
      alert('Please enter content to submit')
    }
    try {
      await api.submitCommentToTopicChain(textareaRef?.current?.value!, name!, docId!, $id!, mark)
      await api.updateCommentCount(topicCoundDocId!, countDocId![0].count + 1 )
      setMark('')
      window.location.reload()
    }catch(err) {
      console.log(err)
    }
  }

 

  
  return (
    <div className="submit-comment flex flex-col justify-start items-start row-start-2 col-start-2 md:col-start-3 md:col-span-5 col-span-10 p-4 bg-slate-700 rounded-b-md">
          <div className="comment-as mb-2">
            Comment as <span className='font-bold'>{name}</span>
          </div>
          <div className="comment-field w-full p-3  outline outline-1 outline-slate-400 rounded-sm">
            <form onSubmit={handleSubmitComment}>
              <textarea 
                name="topic-reply" 
                id="topic-reply" 
                className='w-full p-2 text-slate-900 h-[30vh] focus-within:outline-none'
                ref={textareaRef}
              >
              </textarea>
              <div className="comment-type-options mt-2 pt-2 flex flex-row flex-wrap justify-between items-end gap-4 border-solid border-t-2 border-slate-300">
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
}

export default CommentForm