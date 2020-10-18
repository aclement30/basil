import React from 'react'
import { useTranslation } from 'react-i18next'
import * as moment from 'moment'

import './index.scss'

import { Timer } from '../../models/timer.model'
import { TimerService } from '../../services/TimerService'

interface Props {
  timer: Timer
}

const TimerComponent: React.FC<Props> = ({ timer }) => {
  const { t } = useTranslation()

  const toggleStatus = () => {
    if (timer.active) {
      TimerService.pause(timer)
    } else {
      TimerService.start(timer)
    }
  }

  const stop = () => {
    TimerService.stop(timer, true)
  }

  const timerDisplay = (): string => {
    const remainingSeconds = timer.remainingTime
    let format: string = ''

    if (remainingSeconds >= 3600) {
      format += 'HH:'
    }
    format += 'mm:ss'

    return moment.utc(remainingSeconds * 1000).format(format)
  }

  const elapsedPercentage = (): number => {
    return Math.round((timer.originalDuration - timer.remainingTime) / timer.originalDuration * 100)
  }

  return (
    <div className="Timer">
      {!timer.completed &&
      <>
        <div className="wrapper">
          <h2>{timerDisplay()}</h2>

          <div className="btn-group actions">
            <button type="button" onClick={toggleStatus} className="btn btn-default waves-effect" disabled={timer.completed}>
              <i className={'zmdi' + (timer.active ? ' zmdi-pause' : ' zmdi-play')} />
            </button>

            <button type="button" onClick={stop} className="btn btn-default waves-effect"><i className="zmdi zmdi-stop" /></button>
          </div>
        </div>

        <div className="progress">
          <div className="progress-bar progress-bar-success" role="progressbar" style={{ width: elapsedPercentage() + '%' }} />
        </div>
      </>
      }

      <div className="wrapper">
        {timer.completed &&
        <div className="completed">
          <i className="zmdi zmdi-check-circle"/>
        </div>
        }

        <div className="description">
          {!!timer.title && <div className="title">{timer.title}</div>}
          {!!timer.contextualDescription && <div className="contextual-description">{timer.contextualDescription}</div>}
          {!!timer.recipeStep && <small>{t('common.step')} {timer.recipeStep}</small>}
        </div>
      </div>
    </div>
  )
}

export default TimerComponent