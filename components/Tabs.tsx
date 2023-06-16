import React from 'react'
import Tab from './Tab'

type AppProps = {
  activeTab: string,
  setActiveTab: (value: string) => void
}

const Tabs = ({activeTab, setActiveTab}: AppProps) => {
  return (
    <div className="tab-group-wrapper">
      <div className="tab-group flex flex-row border-b-2 border-slate-300">
        <Tab  
          label='Public'
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <Tab  
          label='Private'
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {/* <button 
          className='disabled:text-slate-300 text-slate-500 border-t-2 border-r-2 disabled:border-slate-300 border-slate-500 disabled:border-r-slate-300 border-r-slate-300 rounded-tr-lg px-2'
          onClick={() => setActiveTab('Public')}
          disabled={activeTab === 'Public' ? true : false}
        >
          Public
        </button> */}
        {/* <button 
          className='disabled:text-slate-300 text-slate-500  border-t-2 border-r-2 disabled:border-slate-300 border-slate-500 disabled:border-r-slate-300 border-r-slate-500 rounded-tr-lg px-2'
          onClick={() => setActiveTab("Private")}
          disabled={activeTab === "Private" ? true : false}
        >
          Private
        </button> */}
      </div>
    </div>
  )
}

export default Tabs