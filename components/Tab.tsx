import React from 'react'

type AppProps = {
  label: string,
  activeTab: string
  setActiveTab: (value: string) => void
}

const Tab = ({label, activeTab, setActiveTab}: AppProps) => {

  return (
    <button 
      // className='disabled:text-slate-700 dark:disabled:text-slate-300 text-slate-300 dark:text-slate-500 border-t-2 border-r-2 disabled:border-slate-500 border-slate-300 disabled:border-r-slate-500 border-r-slate-300 rounded-tr-lg px-2'
      className='disabled:bg-blue-500 disabled:text-white text-slate-400 disabled:outline-none outline outline-1 outline-slate-400 rounded-full px-4 py-2'
      onClick={() => setActiveTab(label)}
      disabled={activeTab === label ? true : false}
    >
      {label}
    </button>
  )
}

export default Tab