import React from 'react'
import Tab from './Tab'

type AppProps = {
  activeTab: string,
  setActiveTab: (value: string) => void
}

const Tabs = ({activeTab, setActiveTab}: AppProps) => {

  console.log("active tab from tabs", activeTab)
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
      </div>
    </div>
  )
}

export default Tabs