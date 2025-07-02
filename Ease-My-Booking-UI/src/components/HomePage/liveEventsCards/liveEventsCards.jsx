import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTransactionsThunk } from '../../../appState/appThunk/transactionThunk';
import { fetchAllPlaces } from '../../../appState/appThunk/placesThunk';
import { fetchPackageById } from '../../../appState/appThunk/packageThunk';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import {
  Star,
  StarHalf,
  StarBorder,
  Bolt,
  Event,
  ErrorOutline
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LiveEvents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { transaction = [], loading } = useSelector((state) => state.transaction);
  const { places = [] } = useSelector((state) => state.places);

  const [trending, setTrending] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(getAllTransactionsThunk());
    dispatch(fetchAllPlaces());
  }, [dispatch]);

  const renderStars = (rating = 0) => {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <Box sx={{ display: 'flex' }}>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} sx={{ fontSize: 18, color: '#FFA500' }} />
        ))}
        {hasHalfStar && <StarHalf key="half" sx={{ fontSize: 18, color: '#FFA500' }} />}
        {[...Array(emptyStars)].map((_, i) => (
          <StarBorder key={`empty-${i}`} sx={{ fontSize: 18, color: '#E0E0E0' }} />
        ))}
      </Box>
    );
  };

  useEffect(() => {
    const fetchTrendingData = async () => {
      setLocalLoading(true);
      setError(null);
      try {
        const countMap = {};
        transaction.forEach((txn) => {
          const totalTickets =
            txn.ticketForChildren +
            txn.ticketForAdults +
            txn.ticketForSeniorCitizen +
            txn.ticketForForeigner;
          countMap[txn.packageId] = (countMap[txn.packageId] || 0) + totalTickets;
        });

        const sortedPackages = Object.entries(countMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4);

        const trendingData = [];

        for (const [packageId, ticketCount] of sortedPackages) {
          try {
            const result = await dispatch(fetchPackageById(packageId)).unwrap();
            trendingData.push({
              ...result,
              ticketCount,
              status: trendingData.length < 2
                ? { type: 'Fast Filling', icon: <Bolt fontSize="small" />, color: 'warning' }
                : null,
            });
          } catch (err) {
            console.warn(`Package not found for ID: ${packageId}`, err);
          }
        }

        setTrending(trendingData);
      } catch (err) {
        setError('Failed to load trending packages. Please try again later.');
        console.error('Trending Fetch Error:', err);
      } finally {
        setLocalLoading(false);
      }
    };

    if (Array.isArray(transaction) && transaction.length > 0) {
      fetchTrendingData();
    } else {
      setLocalLoading(false);
    }
  }, [transaction, dispatch]);

  if (loading || localLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, height: '200px', alignItems: 'center' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4, color: 'error.main' }}>
        <ErrorOutline fontSize="large" />
        <Typography variant="h6" mt={2}>{error}</Typography>
      </Box>
    );
  }

  if (!trending.length) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="text.secondary">No trending packages found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: { xs: '20px', md: '40px' }, backgroundColor: '#f9f9f9' }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          mb: 4,
          textAlign: 'center',
          position: 'relative',
          '&:after': {
            content: '""',
            display: 'block',
            width: '80px',
            height: '4px',
            backgroundColor: 'primary.main',
            margin: '16px auto 0',
          },
        }}
      >
        Top Trending Trips
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        {trending.map((pkg, index) => (
          <Card
          key={pkg.id}
          onClick={() => navigate(`/booking/${pkg.id}`)}
          sx={{
            cursor: 'pointer',
            width: { xs: '100%', sm: '48%', md: '25%' },
            maxWidth: '320px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            borderRadius: '16px',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-6px)',
              boxShadow: '0 12px 22px rgba(0,0,0,0.15)',
            },
            display: 'flex',
            flexDirection: 'column',
            height: '520px', // increased
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="300" // increased image height
              image={pkg.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
              alt={pkg.packageName}
              sx={{
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                objectFit: 'cover',
              }}
            />
        
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Chip label={`Trending #${index + 1}`} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                {pkg.status && (
                  <Chip
                    label={pkg.status.type}
                    icon={pkg.status.icon}
                    color={pkg.status.color}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                )}
              </Box>
            </Box>

            <CardContent
              sx={{
                flexGrow: 1,
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                  {pkg.packageName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  {renderStars(pkg.rating)}
                </Box>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Stack spacing={1.2} sx={{ mb: 2, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* You can add location info here if needed */}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Event sx={{ color: 'primary.main', fontSize: '1rem', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Flexible dates available
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default LiveEvents;
