import React from 'react'
import { useCategoryStore } from '@/hooks/store'

type AppProps = {
  category?: string,
  isFilter: boolean,
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const CategorySelect = ({isFilter, onChange, category}:AppProps) => {
  const categoryStore = useCategoryStore()
  const savedCategory = categoryStore.savedCategory
  return (
    <div>
      <select required value={category ? category : savedCategory !== null ? savedCategory : "all"} onChange={onChange} name="categories" id="category-select" className='bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-300 py-2 px-3 rounded-sm'>
        <option hidden={isFilter ? false : true} value="all">All</option>
        <option value="music-collab">Music Collab</option>
        <option value="short-stories">Short Stories</option>
        <option value="long-stories">Long Stories</option>
        <option value="journal">Journal</option>
        <option value="showcase">Showcase</option>
        <option value="music-share">Music Share</option>
        <option value="feedback">Feedback</option>
        <option value="looking-for-writers">Looking For Writers</option>
        <option value="looking-for-beats">Looking For Beats</option>
        <option value="creative-writing">Creative Writing</option>
        <option value="incubator">Incubator</option>
        <option value="suggestion-box">Suggestion Box</option>
        <option value="help">Help</option>
        <option value="music-discussion">Music Discussion</option>
        <option value="random">Random</option>
        <option value="personal">Personal</option>
        <option hidden value="testing">Testing</option>
      </select>
    </div>
  )
}

export default CategorySelect