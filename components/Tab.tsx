import React from 'react'
import Button from './Button'

type AppProps = {
  label: string,
  activeTab: string
  setActiveTab: (value: string) => void
}

const Tab = ({label, activeTab, setActiveTab}: AppProps) => {

  return (
    <Button 
      label={label}
      onClick={() => setActiveTab(label)}
      bgColor='bg-transparent'
      fontColor='text-slate-400'
      padding='px-4 py-2'
      hover='hover:bg-slate-300 hover:text-slate-700'
      outline='outline outline-1 outline-slate-400'
      disabled={activeTab === label ? true : false}
      disabledConditions='disabled:bg-blue-500 disabled:text-white disabled:outline-none'
    />
  )
}

export default Tab