import { Timer, TimerData } from '../models/timer.model'
import { addTimer, startTimer, updateTimer, completeTimer, removeTimer } from '../store/actions/timers'
import store from '../store'
import { getCurrentCookingRecipe } from '../store/selectors/cookingRecipes'
import i18n from '../i18n'
import { SpeakerService } from './SpeakerService'

function create(duration: number, options: TimerData) {
  const data = Object.assign({ duration }, options)

  const timer = new Timer(data)

  store.dispatch(addTimer(timer))

  if (timer.active) {
    start(timer)
  }
}

function start(timer: Timer) {
  const interval = timer.start(tick)

  if (interval) {
    store.dispatch(startTimer(timer))
  }
}

function pause(timer: Timer) {
  timer.pause()

  store.dispatch(updateTimer(timer))
}

function stop(timer: Timer, silent: boolean = false) {
  timer.stop()

  if (!silent) {
    store.dispatch(completeTimer(timer))

    if (timer.completed) {
      const currentRecipe = getCurrentCookingRecipe(store.getState())

      setTimeout(() => {
        let description: string
        if (currentRecipe && timer.recipeId === currentRecipe._id) {
          if (timer.contextualDescription) {
            description = i18n.t('common.timeElapsedForTimer', { timer: timer.contextualDescription })
          } else {
            description = i18n.t('common.elapsedTime')
          }
        } else {
          if (timer.title) {
            description = i18n.t('common.timeElapsedForTimer', { timer: timer.title })
          } else {
            description = i18n.t('common.elapsedTime')
          }
        }

        SpeakerService.speak(description, {
          dialogTitle: i18n.t('common.timer'),
          chime: true,
          dialogCloseDelay: 3000
        })
      }, 1500)
    }

    setTimeout(() => {
      store.dispatch(removeTimer(timer))
    }, 5000)
  } else {
    store.dispatch(removeTimer(timer))
  }
}

function remove(timer: Timer) {
  stop(timer, true)
}

function tick (timer: Timer) {
  if (timer.remainingTime <= 0) {
    stop(timer)
    return
  }
}

export const TimerService = {
  create,
  start,
  pause,
  stop,
  remove,
  tick,
}