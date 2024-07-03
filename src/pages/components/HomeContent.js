import React, { useEffect, useState } from 'react'
import Circle from './Circle'
import chair from '../../assets/images/chair.png'
import { useOrientation } from '../../hooks/OrientationContext'

const HomeContent = () => {
  const [circles, setCircles] = useState([])
  const orientation = useOrientation()

  useEffect(() => {
    const iconsKeys = ['dine', 'play', 'stay', 'maps', 'events', 'shop']
    const texts = ['Dine', 'Play', 'Stay', 'Maps', 'Events', 'Shop']

    const calculateDistance = () => {
      if (orientation === 'desktop') {
        return 200 // Дистанция для десктопа
      } else {
        return 128 // Дистанция для мобильной версии
      }
    }

    // Calculate positions and create circle data
    const newCircles = texts.map((text, index) => {
      const angle = index * 60
      const distance = calculateDistance()
      return { icon: iconsKeys[index], text, angle, distance }
    })

    setCircles(newCircles)
  }, [orientation])

  return (
    <main className="main-content homePage">
      <h1 className="exploring-header">Tap to begin exploring</h1>
      <div id="main-container">
        <div className="background-circle2"></div>
        <div className="background-circle"></div>
        <div id="circle-container">
          <img
            src={chair}
            alt="Centered"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '78%',
              maxHeight: '78%',
              zIndex: 1,
            }}
          />

          {circles.map((circle, index) => (
            <Circle
              key={index}
              icon={circle.icon}
              text={circle.text}
              angle={circle.angle}
              distance={circle.distance}
              className={circle.icon === 'play' ? 'rotated-icon' : ''}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

export default HomeContent
