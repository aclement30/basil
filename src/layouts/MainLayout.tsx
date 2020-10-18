import React from 'react'

import './MainLayout.scss'

import Header from '../components/Header'
import NavigationMenu from '../components/NavigationMenu'
import KitchenSidebar from '../components/KitchenSidebar'
import Footer from '../components/Footer'
import { UIContext, UIContextProvider } from '../contexts/UIContext'
import CookmodeMenu from '../components/CookmodeMenu'

interface Props {
  children: React.ReactNode
  sidebar?: React.ReactNode
}

export default React.memo<Props>(({ children, sidebar }) => {
  return (
    <UIContextProvider>
      <UIContext.Consumer>
        {({ cookMode }) => (
          <div className={'MainLayout' + (cookMode ? ' cookmode' : '')}>
            <Header />

            <NavigationMenu />
            {cookMode && <KitchenSidebar />}

            <section id="main">
              <div className="sidebar">
                {sidebar}
              </div>

              <div className="main">
                {children}
              </div>
            </section>

            <Footer />

            {cookMode && <CookmodeMenu />}
          </div>
        )}
      </UIContext.Consumer>
    </UIContextProvider>
  )
})