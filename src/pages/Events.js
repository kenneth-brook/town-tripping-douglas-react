import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { ReactComponent as EventsIcon } from '../assets/icos/events.svg'
import { useHeightContext } from '../hooks/HeightContext';

const Events = ({ pageTitle }) => {
  const { headerHeight, footerHeight, footerRef } = useHeightContext()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/get-events'
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        console.log('API response:', result)
        setData(result)

      } catch (error) {
        setError(`Failed to fetch data: ${error.message}`)
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <Header />
      <main
        className="internal-content"
        style={{
          paddingTop: `calc(${headerHeight}px + 30px)`,
          paddingBottom: `calc(${footerHeight}px + 50px)`,
        }}
      >
        <div className="page-title">
        <EventsIcon />
          <h1>{pageTitle}</h1>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <div className="content">
            {data.map((item) => (
              <div key={item.id} className="content-item">
                <h2>{item.name}</h2>
                <div className="descriptBox">
                  <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
                </div>
                <div className="reviews-container">
                  <button className="more-button">more</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer showCircles={true} />
    </>
  )
}

export default Events
