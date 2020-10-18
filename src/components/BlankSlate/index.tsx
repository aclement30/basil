import React from 'react'

import './index.scss'

interface Props {
  icon: string
  text: string
  button?: React.ReactNode
}

const BlankSlate = React.memo<Props>(({ icon, text, button }) => {
  return (
    <div className="BlankSlate">
      <i className={'blank-icon zmdi ' + icon} />
      <p className="lead">{text}</p>

      {button}
    </div>
  )
})

export default BlankSlate