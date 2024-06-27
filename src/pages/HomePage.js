import React from 'react'
import Header from './components/Header'
import HomeContent from './components/HomeContent'
import Footer from './components/Footer'
import { useOrientation } from '../hooks/OrientationContext'
import styles from '../sass/componentsass/HomePage.scss'

const App = () => {
  const orientation = useOrientation()

  return (
    <div
      className={`app-container ${
        orientation === 'landscape-primary' ||
        orientation === 'landscape-secondary'
          ? 'landscape'
          : 'portrait'
      }`}
    >
      <Header />
      <HomeContent />
      <Footer />
    </div>
  )
}

export default App
