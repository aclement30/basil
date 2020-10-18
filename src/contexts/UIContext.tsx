import React, { useCallback, useMemo, useState } from 'react'

import { VoiceAssistantState } from '../services/VoiceAssistantService'

export interface UIContext {
  cookMode: boolean
  setCookMode(value: boolean): void
  kitchenSidebarVisible: boolean
  toggleKitchenSidebar(value?: boolean): void
  navigationMenuVisible: boolean
  toggleNavigationMenu(value?: boolean): void
  voiceAssistantState: VoiceAssistantState
  toggleVoiceAssistant(value?: VoiceAssistantState): void
  // voiceAssistantListening: boolean
  // setVoiceAssistantListening(value: boolean): void
  // voiceAssistantSpeaking: boolean
  // toggleVoiceAssistantSpeaking(value?: boolean): void
}

export const UIContext = React.createContext<UIContext>({
  cookMode: false,
  setCookMode: () => {},
  kitchenSidebarVisible: false,
  toggleKitchenSidebar: () => {},
  navigationMenuVisible: false,
  toggleNavigationMenu: () => {},
  voiceAssistantState: false,
  toggleVoiceAssistant: () => {},
  // voiceAssistantListening: false,
  // setVoiceAssistantListening: () => {},
  // voiceAssistantSpeaking: false,
  // toggleVoiceAssistantSpeaking: () => {},
})

interface ProviderProps {
  children: React.ReactNode
}

export function UIContextProvider ({ children }: ProviderProps) {
  const [cookMode, setCookModeValue] = useState<boolean>(false)
  const [kitchenSidebarVisible, setKitchenSidebar] = useState<boolean>(false)
  const [navigationMenuVisible, setNavigationMenu] = useState<boolean>(false)
  const [voiceAssistantState, setVoiceAssistantState] = useState<VoiceAssistantState>(false)
  // const [voiceAssistantListening, setVoiceAssistantListening] = useState<boolean>(false)
  // const [voiceAssistantSpeaking, setVoiceAssistantSpeaking] = useState<boolean>(false)

  const setCookMode = useCallback((value: boolean) => {
    if (value) {
      setNavigationMenu(false)
    } else {
      setKitchenSidebar(false)
    }
    setCookModeValue(value)
  }, [setCookModeValue, setNavigationMenu, setKitchenSidebar])

  const toggleKitchenSidebar = useCallback((value?: boolean) => {
    // If `value` argument was passed, use it to set `kitchenSidebarVisible`,
    // otherwise toggle the current value of `kitchenSidebarVisible`
    setKitchenSidebar(typeof value !== 'undefined' ? value : (currentValue) => !currentValue)
  }, [setKitchenSidebar])

  const toggleNavigationMenu = useCallback((value?: boolean) => {
    // If `value` argument was passed, use it to set `navigationMenuVisible`,
    // otherwise toggle the current value of `navigationMenuVisible`
    setNavigationMenu(typeof value !== 'undefined' ? value : (currentValue) => !currentValue)
  }, [setNavigationMenu])

  const toggleVoiceAssistant = useCallback((value?: VoiceAssistantState) => {
    setVoiceAssistantState((currentValue) => {
      if (typeof value !== 'undefined') return value

      if (!currentValue) return 'waiting'

      return false
    })
  }, [setVoiceAssistantState])

  // const toggleVoiceAssistant = useCallback((value?: boolean) => {
  //   // If `value` argument was passed, use it to set `voiceAssistantEnabled`,
  //   // otherwise toggle the current value of `voiceAssistantEnabled`
  //   setVoiceAssistantEnabled(typeof value !== 'undefined' ? value : (currentValue) => !currentValue)
  // }, [setVoiceAssistantEnabled])

  const value = useMemo(() => ({
    cookMode,
    setCookMode,
    kitchenSidebarVisible,
    toggleKitchenSidebar,
    navigationMenuVisible,
    toggleNavigationMenu,
    voiceAssistantState,
    toggleVoiceAssistant,
  }), [
    cookMode,
    setCookMode,
    kitchenSidebarVisible,
    toggleKitchenSidebar,
    navigationMenuVisible,
    toggleNavigationMenu,
    voiceAssistantState,
    toggleVoiceAssistant,
  ])

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
