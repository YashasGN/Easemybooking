import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  IconButton,
  Grid
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#0f1111', color: '#ddd', pt: 4 }}>
      <Container maxWidth="lg">
        {/* Top Footer Columns */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
            gap: 2,
            pb: 2,
          }}
        >
          {/* Why EaseMyBooking */}
          <Box sx={{ width: '18%' }}>
            <Typography variant="subtitle1" gutterBottom color="white">
              Why EaseMyBooking
            </Typography>
            <Typography variant="body2">
              Discover, plan, and book top attractions with ease. Trusted by thousands of travelers for reliable, fast, and secure experiences.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box sx={{ width: '18%' }}>
            <Typography variant="subtitle1" gutterBottom color="white">
              Quick Links
            </Typography>
            {[
              { label: 'Home', type: 'home' },
              { label: 'FAQs', type: 'faqs' },
              { label: 'Support', type: 'support' },
              { label: 'Pricing', type: 'pricing' }
            ].map(({ label, type }) => (
              <Link
                component={RouterLink}
                to={`/footer-page?type=${type}`}
                key={type}
                underline="hover"
                sx={{ color: '#ccc', display: 'block', fontSize: '0.85rem', '&:hover': { color: '#fff' } }}
              >
                {label}
              </Link>
            ))}
          </Box>

          {/* Legal */}
          <Box sx={{ width: '18%' }}>
            <Typography variant="subtitle1" gutterBottom color="white">
              Legal
            </Typography>
            {[
              { label: 'Terms & Conditions', type: 'terms' },
              { label: 'Privacy Policy', type: 'privacy' },
              { label: 'Refund Policy', type: 'refund' }
            ].map(({ label, type }) => (
              <Link
                component={RouterLink}
                to={`/footer-page?type=${type}`}
                key={type}
                underline="hover"
                sx={{ color: '#ccc', display: 'block', fontSize: '0.85rem', '&:hover': { color: '#fff' } }}
              >
                {label}
              </Link>
            ))}
          </Box>

          {/* Customer Policies */}
          <Box sx={{ width: '18%' }}>
            <Typography variant="subtitle1" gutterBottom color="white">
              Customer Policies
            </Typography>
            {[
              { label: 'Cancellation Policy', type: 'cancellation' },
              { label: 'Booking Guidelines', type: 'booking' },
              { label: 'Covid Safety', type: 'covid' }
            ].map(({ label, type }) => (
              <Link
                component={RouterLink}
                to={`/footer-page?type=${type}`}
                key={type}
                underline="hover"
                sx={{ color: '#ccc', display: 'block', fontSize: '0.85rem', '&:hover': { color: '#fff' } }}
              >
                {label}
              </Link>
            ))}
          </Box>

          {/* Contact Us */}
          <Box sx={{ width: '18%' }}>
            <Typography variant="subtitle1" gutterBottom color="white">
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <EmailIcon fontSize="small" sx={{ mr: 1 }} /> support@easemybooking.com
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon fontSize="small" sx={{ mr: 1 }} /> +91-1234567890
            </Typography>
            <Box>
              <IconButton href="#" sx={{ color: '#ccc', '&:hover': { color: '#1DA1F2' } }}>
                <TwitterIcon />
              </IconButton>
              <IconButton href="#" sx={{ color: '#ccc', '&:hover': { color: '#3b5998' } }}>
                <FacebookIcon />
              </IconButton>
              <IconButton href="#" sx={{ color: '#ccc', '&:hover': { color: '#E1306C' } }}>
                <InstagramIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ borderColor: '#fff' }} />

        {/* Promo Content */}
        <Box sx={{ py: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src="/logo.png"
                  alt="EaseMyBooking Logo"
                  style={{ width: 170, marginRight: 16, height: 55 }}
                />
                <Typography variant="body2">
                  EaseMyBooking is your trusted travel companion, simplifying entry to iconic destinations across India.
                  We specialize in online ticketing for zoos, museums, amusement parks, and heritage monuments.
                  Whether you're exploring nature, culture, or adventure, EaseMyBooking ensures a seamless and safe
                  booking experience with real-time availability, secure payments, and instant confirmations.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Final Footer Note */}
        <Divider sx={{ my: 1, borderColor: '#fff' }} />
        <Typography
          variant="caption"
          align="center"
          display="block"
          sx={{ color: '#fff', fontSize: '0.85rem', fontWeight: 500, marginBottom: 0.5 }}
        >
          © 2025 EaseMyBooking. All rights reserved. | Made with ❤️ in India 🇮🇳
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
