import React from 'react'

import './index.scss'

interface Props {
  text: string
}

const LoadingCard = React.memo<Props>(({ text }) => {
  return (
    <div className="LoadingCard">
      <div className="preloader pl-xl">
        <svg className="pl-circular" viewBox="25 25 50 50">
          <circle className="plc-path" cx="50" cy="50" r="20"/>
        </svg>
      </div>

      <p className="lead">{text}</p>
    </div>
  )
})

export default LoadingCard