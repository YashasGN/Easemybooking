import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPlaces } from '../../appState/appThunk/placesThunk';
import { getPackagesByPlaceId } from '../../services/package_services';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  CircularProgress,
  Button
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos,
  Star,
  StarHalf,
  StarBorder
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './popularCard.css'; // Also include popup styles from previous message

const PopularCard = () => {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { places } = useSelector((state) => state.places);

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllPlaces());
  }, [dispatch]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <Box sx={{ display: 'flex' }}>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} sx={{ fontSize: 16, color: theme.palette.warning.main }} />
        ))}
        {hasHalfStar && (
          <StarHalf key="half" sx={{ fontSize: 16, color: theme.palette.warning.main }} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <StarBorder key={`empty-${i}`} sx={{ fontSize: 16, color: 'rgba(0,0,0,0.26)' }} />
        ))}
      </Box>
    );
  };

  const handleCardClick = async (place) => {
    setSelectedPlace(place);
    setLoading(true);
    try {
      const res = await getPackagesByPlaceId(place.id);
      setPackages(res);
    } catch (err) {
      console.error('Failed to fetch packages', err);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedPlace(null);
    setPackages([]);
  };

  const topRated = places
    ?.filter(place => place.isActive)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  return (
    <>
      <Box className="live-events-section" sx={{ px: 3, py: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{
          mb: 4,
          color: 'text.primary',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: 1
        }}>
          Recommended Places
        </Typography>

        <Box className="scroll-container-wrapper" sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'common.white'
              },
              zIndex: 2
            }}
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>

          <Box ref={scrollRef} sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            py: 2,
            px: 1
          }}>
            {topRated?.map((place) => (
              <Box
                key={place.id}
                onClick={() => handleCardClick(place)}
                sx={{
                  minWidth: 280,
                  height: 340,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 3,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                    cursor: 'pointer'
                  }
                }}
              >
                <Box sx={{ position: 'relative', height: 200 }}>
                  <img
                    src={place.imageUrl}
                    alt={place.placeName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  {place.rating >= 9 && (
                    <Box sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      backgroundColor: theme.palette.error.main,
                      color: 'common.white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: 12,
                      fontWeight: 'bold',
                      letterSpacing: 0.5
                    }}>
                      Top Rated
                    </Box>
                  )}
                </Box>
                <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
                  <Typography variant="h6" sx={{
                    fontWeight: 'bold',
                    mb: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {place.placeName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {renderStars(place.rating)}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          <IconButton
            onClick={() => scroll('right')}
            sx={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'common.white'
              },
              zIndex: 2
            }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Popup Modal */}
      {selectedPlace && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>×</button>
            <h3>Available Packages for {selectedPlace.placeName}</h3>

            {loading ? (
              <div className="loading">Loading packages...</div>
            ) : (
              <div className="packages-container">
                {packages.length > 0 ? packages.map(pkg => (
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
                      <Button
                        variant="contained"
                        size="small"
                        className="book-now-btn"
                        onClick={() => navigate(`/booking/${pkg.id}`)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                )) : (
                  <p className="no-packages">No packages available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PopularCard;
