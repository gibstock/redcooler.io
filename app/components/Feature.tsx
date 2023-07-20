import React, {ElementType} from 'react'

type AppProps = {
  feature: string;
  Icon: ElementType;
  contentText: string;
}

const Feature = ({feature, Icon, contentText}: AppProps) => {
  return (
    <div className='feature-card flex flex-col justify-center items-center md:items-start gap-2 max-w-md lg:max-w-[25vw]'>
      <div className="title lg:flex lg:flex-row lg:gap-4">
        <div className="title-icon text-redcooler flex justify-center md:justify-start items-center">
          <Icon size={45} />
        </div>
        <h2 className="title-feature-name flex justify-center items-center font-bold text-lg">
          {feature}
        </h2>
      </div>
      <div className="content">
        <p className="content-text text-center md:text-left">
          {contentText}
        </p>
      </div>
    </div>
  )
}

export default Feature