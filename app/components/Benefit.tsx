import React from 'react'
import Image from 'next/image'

type AppProps = {
  heading: string;
  subheading: string;
  details: string;
  imgSrc: string;
  alt: string;
  imgW?: number;
  imgH?: number;
}

const Benefit = ({heading, subheading, details, imgSrc, imgH, imgW, alt}: AppProps) => {
  return (
    <div className='benefit flex flex-col-reverse md:flex-row justify-center items-center w-full'>
      <div className="content p-4">
        <div className="heading text-3xl font-bold">{heading}</div>
        <div className="subheading text-xl">{subheading}</div>
        <div className="details">{details}</div>
      </div>
      <div className="image h-30vh">
        {imgH && imgW ? (
          <Image 
            src={imgSrc}
            alt={alt}
            width={imgW}
            height={imgH}
          />
        ) : (
          <Image 
            src={imgSrc}
            alt={alt}
            fill
            objectFit='cover'
          />
        )}
      </div>
    </div>
  )
}

export default Benefit