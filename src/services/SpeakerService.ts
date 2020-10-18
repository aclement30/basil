import * as $ from 'jquery'

import { Dialog } from './Dialog'
import { useContext } from 'react'
import { UIContext } from '../contexts/UIContext'
import { useTranslation } from 'react-i18next'

export interface IWindow extends Window {
  SpeechSynthesisUtterance: any
  speechSynthesis: any
}

export interface SpeakerOptions {
  dialogTitle?: string
  dialogText?: string
  dialogCloseDelay?: number
  chime?: boolean
  ding?: boolean
}

const { SpeechSynthesisUtterance }: IWindow = window
const { speechSynthesis }: IWindow = window

let message: SpeechSynthesisUtterance

function chime(): Promise<void> {
  const audioElement: HTMLAudioElement = $('audio.chime-sound')[0]
  audioElement.play()

  return new Promise(r => setTimeout(r, 1500))
}

function ding(): Promise<void> {
  const audioElement: HTMLAudioElement = $('audio.ding-sound')[0]
  audioElement.play()

  return new Promise(r => setTimeout(r, 500))
}

function stopSpeaking(options: SpeakerOptions): Function {
  return () => {
    const uiContext = useContext<UIContext>(UIContext)

    setTimeout(Dialog.close, options.dialogCloseDelay)

    uiContext.toggleVoiceAssistant(false)
  }
}

function getWaitTime(text: string): number {
  const wpm = 180        // Readable words per minute
  const wordLength = 5   // Standardized number of chars in calculable word
  const delay = 500     // Milliseconds before user starts reading the notification
  const bonus = 500     // Extra time

  const words = text.length / wordLength
  const wordsTime = ((words / wpm) * 60) * 1000

  return delay + wordsTime + bonus
}

async function speak(text: string, options: SpeakerOptions = {}) {
  const uiContext = useContext<UIContext>(UIContext)
  const { i18n: { language } } = useTranslation()

  message = new SpeechSynthesisUtterance()
  message.lang = language === 'fr' ? 'fr-FR' : 'en-CA'
  message.rate = 1.2
  message.text = text

  message.onend = stopSpeaking.bind(null, options)

  uiContext.toggleVoiceAssistant('speaking')

  if (options.chime) await chime()
  if (options.ding) await ding()

  Dialog.show(options.dialogTitle!, options.dialogText ? options.dialogText : text)
  speechSynthesis.speak(message)

  // Failsafe in the event SpeechSynthesis does not call onend callback
  setTimeout(stopSpeaking(options), getWaitTime(text))
}

export const SpeakerService = {
  speak,
}