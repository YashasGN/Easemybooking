import React, { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { fetchPlacesByCityAndCategory } from '../../appState/appThunk/placesThunk';

import { getPackagesByPlaceId } from '../../services/package_services';

import './zooList.css';

export default function ZooList() {

  const { city, category } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const filteredPlaces = useSelector((state) => state.places.filteredPlaces) ?? [];

  const places = filteredPlaces.filter(p => p.isVerified);

  const [selectedPlace, setSelectedPlace] = useState(null);

  const [packages, setPackages] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (city && category) {

      dispatch(fetchPlacesByCityAndCategory({ city, category }));

    }

  }, [city, category]);

  const handleViewPackages = async (place) => {

    if (!place.isActive) return;

    setSelectedPlace(place);

    setLoading(true);

    try {

      const response = await getPackagesByPlaceId(place.id);

      setPackages(response);

    } catch (err) {

      console.error("Failed to fetch packages", err);

      setPackages([]);

    } finally {

      setLoading(false);

    }

  };

  const closeModal = () => {

    setSelectedPlace(null);

    setPackages([]);

  };

  return (
    <div className="zoo-list-container">
      <div className="hero-section">
        <h1>

          Explore <span className="highlight">{category?.charAt(0).toUpperCase() + category?.slice(1)}</span> in <span className="highlight">{city}</span>
        </h1>
        <p className="subtext">Discover top-rated attractions and book your adventure instantly</p>
      </div>

      <div className="places-grid">

        {places.map((place) => (
          <div key={place.id} className="place-card">
            <div className="card-image-container">
              <img

                src={place.imageUrl}

                alt={place.placeName}

                className="place-image"

                onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}

              />
            </div>
            <div className="card-content">
              <h3>{place.placeName}</h3>
              <p className="location">{place.address}, {place.city}</p>
              <p className={`status ${place.isActive ? 'open' : 'closed'}`}>

                {place.isActive ? 'Open' : 'Closed'}
              </p>
              <p className="description">

                {place.description.length > 100

                  ? `${place.description.substring(0, 100)}...`

                  : place.description}
              </p>
              <button

                className={`view-packages-btn ${!place.isActive ? 'disabled' : ''}`}

                onClick={() => place.isActive && handleViewPackages(place)}

                disabled={!place.isActive}
              >

                View Packages
              </button>
            </div>
          </div>

        ))}
      </div>

      {selectedPlace && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>✕</button>
            <h3>Available Packages for {selectedPlace.placeName}</h3>

            {loading ? (
              <div className="loading">Loading packages...</div>

            ) : (
              <div className="packages-container">

                {packages.length > 0 ? (

                  packages.map(pkg => (
                    <div key={pkg.id} className="package-card">
                      <div className="package-image">
                        <img

                          src={pkg.imageUrl}

                          alt={pkg.packageName}

                          onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}

                        />
                      </div>
                      <div className="package-details">
                        <h4>{pkg.packageName}</h4>
                        <button

                          className="book-now-btn"

                          onClick={() => navigate(`/${city}/${category}/${pkg.id}`)}
                        >

                          Book Now
                        </button>
                      </div>
                    </div>

                  ))

                ) : (
                  <p className="no-packages">No packages available.</p>

                )}
              </div>

            )}
          </div>
        </div>

      )}
    </div>

  );

}

