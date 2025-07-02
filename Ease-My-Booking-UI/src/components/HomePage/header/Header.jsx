import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Box, Button, Menu, MenuItem, IconButton,
  Avatar, Tooltip, Typography, Divider, Dialog, DialogTitle,
  DialogContent, TextField, ListItemButton, ListItemText, List, ListItem,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationOnIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  BookOnline as BookOnlineIcon,
  Dashboard as DashboardIcon,
  Close as CloseIcon,
  MyLocation as MyLocationIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onLogout } from '../../../appState/appSlicer/userSlcer';
import { fetchAllPlaces } from '../../../appState/appThunk/placesThunk';
import { Autocomplete } from '@mui/material';

const POPULAR_CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad",
  "Chandigarh", "Chennai", "Pune", "Kolkata", "Kochi"
];

const ALL_CITIES = [...POPULAR_CITIES, "Jaipur", "Lucknow", "Nagpur", "Mysore"];

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn, email, userDetails, role } = useSelector((state) => state.user);
  const { places } = useSelector((state) => state.places);

  const [selectedCity, setSelectedCity] = useState(() => {
    const stored = localStorage.getItem('selectedCity');
    if (stored) return stored;
    localStorage.setItem('selectedCity', 'Mysore');
    return 'Mysore';
  });

  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [cityDialogOpen, setCityDialogOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [showAllCities, setShowAllCities] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (places.length === 0) {
      dispatch(fetchAllPlaces());
    }
  }, [dispatch, places.length]);

  useEffect(() => {
    if (isLoggedIn && userDetails?.city) {
      const userCity = userDetails.city;
      setSelectedCity(userCity);
      localStorage.setItem('selectedCity', userCity);
    }
  }, [isLoggedIn, userDetails]);

  const handleCityDialogOpen = () => setCityDialogOpen(true);
  const handleCityDialogClose = () => {
    setCityDialogOpen(false);
    setCitySearchQuery('');
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    localStorage.setItem('selectedCity', city);
    navigate(`/${city.toLowerCase()}`);
    handleCityDialogClose();
  };

  const handleDetectLocation = () => {
    handleCitySelect('Mysore');
  };

  const handleProfileMenuOpen = (e) => setAnchorElProfile(e.currentTarget);
  const handleProfileMenuClose = () => setAnchorElProfile(null);

  const handleLogout = () => {
    dispatch(onLogout());
    localStorage.removeItem('token');
    localStorage.setItem('selectedCity', 'Mysore');
    navigate('/login');
  };

  const handleDashboardClick = () => {
    handleProfileMenuClose();
    if (role.includes('Admin')) navigate('/admin/dashboard');
    else if (role.includes('Organiser')) navigate('/organiser/dashboard');
  };

  const handleMyBookingsClick = () => {
    handleProfileMenuClose();
    navigate('/mybookings');
  };

  const handleLogoClick = () => {
    navigate(`/${selectedCity.toLowerCase()}`);
  };

  const slugify = (str) => str?.toLowerCase().replace(/\s+/g, '-');

  const isHomePage = /^\/[a-z-]+$/i.test(location.pathname);

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'black', px: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {/* Logo */}
        <Box
          component="img"
          src="/logo.png"
          alt="Logo"
          sx={{ height: 50, cursor: 'pointer' }}
          onClick={handleLogoClick}
        />

        {/* Search Bar (Only on /city) */}
        {isHomePage && (
          <Box sx={{ flex: 1, mx: 4, maxWidth: 500 }}>
            <Autocomplete
              freeSolo
              options={places.filter(p =>
                p.placeName?.toLowerCase().startsWith(searchText.toLowerCase())
              )}
              getOptionLabel={(option) => option.placeName || ''}
              inputValue={searchText}
              onInputChange={(e, value) => setSearchText(value)}
              onChange={(e, newValue) => {
                if (newValue) {
                  const city = slugify(newValue.city || selectedCity);
                  const category = slugify(newValue.category?.categoryName || 'zoo');
                  navigate(`/${city}/${category}`);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search places..."
                  size="small"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>
        )}

        {/* City and Profile Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<LocationOnIcon />}
            onClick={handleCityDialogOpen}
            sx={{ textTransform: 'none' }}
          >
            {selectedCity}
          </Button>

          {/* City Dialog */}
          <Dialog open={cityDialogOpen} onClose={handleCityDialogClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Choose City</Typography>
              <IconButton onClick={handleCityDialogClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <ListItemButton onClick={handleDetectLocation}>
                  <MyLocationIcon sx={{ mr: 1 }} color="primary" />
                  <ListItemText primary="Detect My Location" />
                </ListItemButton>
              </Box>
              <TextField
                fullWidth
                placeholder="Search city..."
                value={citySearchQuery}
                onChange={(e) => setCitySearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                }}
                sx={{ mb: 2 }}
              />
              <Typography variant="subtitle1" fontWeight="bold">Popular Cities</Typography>
              <List dense>
                {POPULAR_CITIES.filter(city =>
                  city.toLowerCase().startsWith(citySearchQuery.toLowerCase())
                ).map(city => (
                  <ListItem key={city} disablePadding onClick={() => handleCitySelect(city)}>
                    <ListItemButton><ListItemText primary={city} /></ListItemButton>
                  </ListItem>
                ))}
              </List>
              {!citySearchQuery && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <ListItemButton onClick={() => setShowAllCities(!showAllCities)}>
                    <Typography color="primary">
                      {showAllCities ? 'Hide All Cities' : 'View All Cities'}
                    </Typography>
                  </ListItemButton>
                  {showAllCities && (
                    <List dense>
                      {ALL_CITIES.filter(city =>
                        !POPULAR_CITIES.includes(city) &&
                        city.toLowerCase().includes(citySearchQuery.toLowerCase())
                      ).map(city => (
                        <ListItem key={city} disablePadding onClick={() => handleCitySelect(city)}>
                          <ListItemButton><ListItemText primary={city} /></ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Login/Profile */}
          {!isLoggedIn ? (
            <Button variant="outlined" color="error" onClick={() => navigate('/login')} sx={{ textTransform: 'none' }}>
              Sign In
            </Button>
          ) : (
            <>
              <Tooltip title="Profile">
                <IconButton onClick={handleProfileMenuOpen}>
                  <Avatar sx={{ bgcolor: '#e53935' }}>{email?.charAt(0).toUpperCase() || 'U'}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElProfile}
                open={Boolean(anchorElProfile)}
                onClose={handleProfileMenuClose}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography fontWeight="bold">Hi, {email?.split('@')[0]}</Typography>
                  <Typography variant="body2" color="text.secondary">{email}</Typography>
                </Box>
                <Divider />
                {(role.includes('Admin') || role.includes('Organiser')) && (
                  <MenuItem onClick={handleDashboardClick}>
                    <DashboardIcon fontSize="small" sx={{ mr: 1 }} />
                    Dashboard
                  </MenuItem>
                )}
                <MenuItem onClick={handleMyBookingsClick}>
                  <BookOnlineIcon fontSize="small" sx={{ mr: 1 }} />
                  My Bookings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}

          <IconButton sx={{ display: { sm: 'none' }, color: 'black' }}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
