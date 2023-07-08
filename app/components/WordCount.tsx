import React from 'react'

type AppProps = {
  count: number;
  words: number;
  color: string;
}

const WordCount = ({count, words, color}: AppProps) => {

  return (
    <div className={`flex flex-row justify-end items-center pr-4 ${color} text-sm`}>
      <span className={`${words > count ? `text-red-700 font-bold` : ''}`}>{words}</span><span>{`/${count}`}</span>
    </div>
  )
}

export default WordCount