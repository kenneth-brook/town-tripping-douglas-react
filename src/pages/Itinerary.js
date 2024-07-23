import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ReactComponent as Intinerery } from '../assets/icos/intinerery.svg';
import { ReactComponent as Share } from '../assets/icos/share-icon.svg';
import { useHeightContext } from '../hooks/HeightContext';
import { useOrientation } from '../hooks/OrientationContext';
import { useAuth } from '../hooks/AuthContext';
import { useItineraryContext } from '../hooks/ItineraryContext';
import { ReactComponent as EyeIcon } from '../assets/icos/eye.svg';
import { ReactComponent as ShareIcon } from '../assets/icos/share-icon2.svg';
import { ReactComponent as PhoneIcon } from '../assets/icos/phone2.svg';
import { ReactComponent as WebIcon } from '../assets/icos/web.svg';
import { ReactComponent as MapIcon } from '../assets/icos/maps.svg';
import { ReactComponent as EditIcon } from '../assets/icos/edit.svg';
import '../sass/componentsass/Itinerary.scss';
import { useViewMode } from '../hooks/ViewModeContext';
import MapView from './components/MapView';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${month}/${day}/${year}`;
};

const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hours12 = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${hours12}:${minutes} ${ampm}`;
};

const Itinerary = ({ pageTitle }) => {
  const navigate = useNavigate();
  const { headerRef, footerRef, headerHeight, footerHeight, updateHeights } = useHeightContext();
  const orientation = useOrientation();
  const { userId, isAuthenticated } = useAuth();
  const { itineraries, selectedItinerary, setSelectedItinerary, fetchItineraries, saveItinerary, updateItinerary, removeFromItinerary, addToItinerary } = useItineraryContext();
  const [selectedItineraryId, setSelectedItineraryId] = useState(localStorage.getItem('selectedItineraryId') || '');
  const [newItineraryName, setNewItineraryName] = useState('');
  const [showNewItineraryWarning, setShowNewItineraryWarning] = useState(false);
  const [editLocationId, setEditLocationId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const { isMapView, setIsMapView } = useViewMode();

  const updateComponentHeights = useCallback(() => {
    updateHeights();
  }, [updateHeights]);

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchItineraries(userId);
    }
  }, [isAuthenticated, userId, fetchItineraries]);

  useEffect(() => {
    updateComponentHeights();
  }, [updateComponentHeights]);

  useEffect(() => {
    if (selectedItineraryId) {
      const itinerary = itineraries.find(it => it.id === parseInt(selectedItineraryId));
      setSelectedItinerary(itinerary);
    }
  }, [selectedItineraryId, itineraries, setSelectedItinerary]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        const message = 'You have unsaved changes, do you really want to leave?';
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [unsavedChanges]);

  const handleSelectItineraryChange = (e) => {
    const itineraryId = e.target.value;
    setSelectedItineraryId(itineraryId);
    localStorage.setItem('selectedItineraryId', itineraryId);
  };

  const handleSelectItinerary = () => {
    const itinerary = itineraries.find(it => it.id === parseInt(selectedItineraryId));
    setSelectedItinerary(itinerary);
  };

  const handleNewItinerary = () => {
    if (selectedItinerary && selectedItinerary.itinerary_data.length > 0) {
      setShowNewItineraryWarning(true);
    } else {
      setSelectedItinerary({ id: null, itinerary_name: '', itinerary_data: [] });
      setNewItineraryName('');
      setUnsavedChanges(true);
    }
  };

  const handleConfirmNewItinerary = () => {
    setShowNewItineraryWarning(false);
    setSelectedItinerary({ id: null, itinerary_name: '', itinerary_data: [] });
    setNewItineraryName('');
    setUnsavedChanges(true);
  };

  const handleSaveItinerary = async () => {
    if (selectedItinerary.id) {
      await updateItinerary(selectedItinerary.id, selectedItinerary.itinerary_data, selectedItinerary.itinerary_name);
    } else {
      await saveItinerary(userId, newItineraryName, selectedItinerary.itinerary_data);
    }
    setUnsavedChanges(false);
  };

  const handleItineraryNameChange = (e) => {
    const newName = e.target.value;
    setNewItineraryName(newName);
    if (selectedItinerary) {
      setSelectedItinerary({ ...selectedItinerary, itinerary_name: newName });
    }
    setUnsavedChanges(true);
  };

  const handleEditLocation = (location) => {
    setEditLocationId(location.id);
    setEditDate(location.visitDate || '');
    setEditTime(location.visitTime || '');
  };

  const handleCancelEdit = () => {
    setEditLocationId(null);
    setEditDate('');
    setEditTime('');
  };

  const handleUpdateLocation = (location) => {
    const updatedLocation = {
      ...location,
      visitDate: editDate,
      visitTime: editTime
    };
    const updatedData = selectedItinerary.itinerary_data.map(loc => 
      loc.id === location.id ? updatedLocation : loc
    );
    setSelectedItinerary({ ...selectedItinerary, itinerary_data: updatedData });
    handleCancelEdit();
    setUnsavedChanges(true);
  };

  const handleRemoveLocation = (locationId) => {
    const updatedData = selectedItinerary.itinerary_data.filter(loc => loc.id !== locationId);
    setSelectedItinerary({ ...selectedItinerary, itinerary_data: updatedData });
    setUnsavedChanges(true);
  };

  const handleAddLocation = async (location) => {
    if (selectedItinerary) {
      await addToItinerary(location);
      setUnsavedChanges(true);
      await handleSaveItinerary(); // Ensure the changes are saved before navigating
      navigate('/itinerary'); // Navigate to itinerary page after adding location
    } else {
      // Handle the case where no itinerary is selected
    }
  };

  const handleMapView = (location) => {
    setIsMapView(true);
    navigate(`/${location.category}/${location.id}`, { state: { location } });
  };

  const handleFooterMapView = () => {
    setIsMapView(true);
  };

  const renderLocationItem = (location, index, dayCount) => (
    <div key={index} className="location-item">
      <div className="left-side">
        <div className="day-box">
          <div className="day-label">DAY</div>
          <div className="day-number">{dayCount !== null ? String(dayCount).padStart(2, '0') : '--'}</div>
        </div>
        <div className="date-box">
          <div className="date-value">{location.visitDate ? formatDate(location.visitDate) : ''}</div>
        </div>
        <div className="time-box">
          <div className="time-value">{location.visitTime ? formatTime(location.visitTime) : '--:--'}</div>
        </div>
        <button className="details-button" onClick={() => navigate(`/detail/${location.id}`, { state: { location, category: location.category } })}>
          <EyeIcon />
          Details
        </button>
      </div>
      <div className="right-side">
        <div className="right-side-header">
          <div className='textBlock'>
            <h3>{location.name}</h3>
            <p>{location.street_address},</p>
            <p>{location.city}, {location.state} {location.zip}</p>
          </div>
          <button className="edit-button" onClick={() => handleEditLocation(location)}>
            <EditIcon />Edit</button>
        </div>
        
        <div className="button-group">
          {location.web && (
            <button onClick={() => window.open(location.web, '_blank')}>
              <WebIcon />
              Web
            </button>
          )}
          {location.phone && (
            <button onClick={() => window.open(`tel:${location.phone}`, '_blank')}>
              <PhoneIcon />
              Call
            </button>
          )}
          <button>
            <ShareIcon />
            Share
          </button>
          <button onClick={() => handleMapView(location)}>
            <MapIcon />
            Map
          </button>
        </div>
        {editLocationId === location.id && (
          <div className="edit-box">
            <label>Date:</label>
            <input 
              type="date" 
              value={editDate} 
              onChange={e => setEditDate(e.target.value)} 
            />
            <label>Time:</label>
            <input 
              type="time" 
              value={editTime} 
              onChange={e => setEditTime(e.target.value)} 
            />
            <button onClick={() => handleUpdateLocation(location)}>Update</button>
            <button onClick={() => handleRemoveLocation(location.id)}>Remove</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );

  const sortItineraryData = (data) => {
    return data.sort((a, b) => {
      if (a.visitDate && b.visitDate) {
        if (a.visitDate === b.visitDate) {
          return a.visitTime.localeCompare(b.visitTime);
        }
        return a.visitDate.localeCompare(b.visitDate);
      }
      if (a.visitDate) return -1;
      if (b.visitDate) return 1;
      return 0;
    });
  };

  const getDayCounts = (data) => {
    let currentDay = 1;
    let lastDate = null;
    const dayCounts = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i].visitDate) {
        const date = new Date(data[i].visitDate);
        if (lastDate === null || date.getTime() !== lastDate.getTime()) {
          const daysBetween = (date - lastDate) / (1000 * 60 * 60 * 24);
          if (lastDate !== null && daysBetween > 0) {
            currentDay += Math.ceil(daysBetween);
          }
          lastDate = date;
        }
        dayCounts.push(currentDay);
      } else {
        dayCounts.push(null);
      }
    }

    return dayCounts;
  };

  const pageTitleContent = (
    <div className="page-title">
      <div className="itinerery-title">
        <Intinerery />
        <h1>{pageTitle}</h1>
      </div>
      <div className="right-button">
        <button>
          <Share />
          <span>Share Itinerary</span>
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`app-container ${
        orientation === 'landscape-primary' ||
        orientation === 'landscape-secondary'
          ? 'landscape'
          : orientation === 'desktop'
          ? 'desktop internal-desktop'
          : 'portrait'
      }`}
    >
      <Header ref={headerRef} />
      <main
        className="internal-content"
        style={{
          paddingTop: `calc(${headerHeight}px + 30px)`,
          paddingBottom: `calc(${footerHeight}px + 50px)`,
        }}
      >
        {isMapView ? (
          <MapView data={selectedItinerary?.itinerary_data || []} />
        ) : (
          <>
            {pageTitleContent}
            <div className="itinerary-header">
              {itineraries.length > 1 && (
                <>
                  <select value={selectedItineraryId} onChange={handleSelectItineraryChange}>
                    <option value="">Select your itinerary</option>
                    {itineraries.map(itinerary => (
                      <option key={itinerary.id} value={itinerary.id}>
                        {itinerary.itinerary_name}
                      </option>
                    ))}
                  </select>
                  <button onClick={handleSelectItinerary}>Select</button>
                </>
              )}
              <input
                type="text"
                value={newItineraryName}
                onChange={handleItineraryNameChange}
                placeholder={selectedItinerary ? selectedItinerary.itinerary_name : 'Name your itinerary'}
              />
              <button onClick={handleNewItinerary}>New</button>
              <button onClick={handleSaveItinerary}>Save</button>
            </div>
            {showNewItineraryWarning && (
              <div className="warning">
                <p>All changes will be lost. Do you want to continue?</p>
                <button onClick={handleConfirmNewItinerary}>Yes</button>
                <button onClick={() => setShowNewItineraryWarning(false)}>No</button>
              </div>
            )}
            <div className="itinerary-content">
              {selectedItinerary && selectedItinerary.itinerary_data.length > 0 ? (
                sortItineraryData(selectedItinerary.itinerary_data).map((location, index) => {
                  const dayCounts = getDayCounts(sortItineraryData(selectedItinerary.itinerary_data));
                  return renderLocationItem(location, index, dayCounts[index]);
                })
              ) : (
                <p>No itinerary selected or itinerary is empty.</p>
              )}
            </div>
          </>
        )}
      </main>
      <Footer ref={footerRef} showCircles={true} handleMapView={handleFooterMapView} />
    </div>
  );
}

export default Itinerary;
