import React from 'react'
import Image from 'next/image'

type AppProps = {
  heading: string;
  subheading: string;
  details: string;
  imgSrc: string;
  alt: string;
  isEven: boolean;
  imgW?: number;
  imgH?: number;
}

const Benefit = ({heading, subheading, details, imgSrc, imgH, imgW, alt, isEven}: AppProps) => {
  return (
    <div className={`benefit flex flex-col-reverse md:gap-8 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} justify-center items-center w-full`}>
      <div className="content p-4">
        <div className="heading text-3xl font-bold">{heading}</div>
        <div className="subheading text-xl mt-4 mb-2">{subheading}</div>
        <div className="details mb-8">{details}</div>
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