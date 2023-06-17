import React from 'react'

type AppProps = {
  label: string,
  activeTab: string
  setActiveTab: (value: string) => void
}

const Tab = ({label, activeTab, setActiveTab}: AppProps) => {

  console.log(`active tab from ${label}`, activeTab)
  return (
    <button 
      className='disabled:text-slate-300 text-slate-500 border-t-2 border-r-2 disabled:border-slate-300 border-slate-500 disabled:border-r-slate-300 border-r-slate-300 rounded-tr-lg px-2'
      onClick={() => setActiveTab(label)}
      disabled={activeTab === label ? true : false}
    >
      {label}
    </button>
  )
}

export default Tab