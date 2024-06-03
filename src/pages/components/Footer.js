import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useOrientation } from '../../hooks/OrientationContext'
import { ReactComponent as DineIcon } from '../../assets/icos/dine.svg'
import { ReactComponent as PlayIcon } from '../../assets/icos/play.svg'
import { ReactComponent as StayIcon } from '../../assets/icos/stay.svg'
import { ReactComponent as MapsIcon } from '../../assets/icos/maps.svg'
import { ReactComponent as EventsIcon } from '../../assets/icos/events.svg'
import { ReactComponent as ShopIcon } from '../../assets/icos/shop.svg'
import '../../sass/componentsass/Footer.scss'

const icons = {
  dine: DineIcon,
  play: PlayIcon,
  stay: StayIcon,
  maps: MapsIcon,
  events: EventsIcon,
  shop: ShopIcon,
}

function Footer({ showCircles = false }) {
  const orientation = useOrientation()
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigate = (path) => {
    navigate(`/${path}`)
  }

  const isHomePage = location.pathname === '/home'

  return (
    <footer>
      {showCircles && (
        <div className="footer-circles">
          {Object.keys(icons).map((key, index) => {
            const Icon = icons[key]
            const isActive = location.pathname === `/${key}`
            return (
              <div
                key={index}
                className={`footer-icon ${isActive ? 'active' : ''}`}
                onClick={() => handleNavigate(key)}
              >
                <Icon className={`icon-svg ${isActive ? 'active-icon' : ''}`} />
                <span className={`icon-label ${isActive ? 'active-text' : ''}`}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <div className="footer-container">
        <div className="circle-background">
          {isHomePage && (
            <div>
              <h3>Get Free Info</h3>
              <p>at Visitor Information Center</p>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

export default Footer
