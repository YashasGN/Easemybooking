import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Divider,
  useTheme,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import GavelIcon from '@mui/icons-material/Gavel';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PolicyIcon from '@mui/icons-material/Policy';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import HomeIcon from '@mui/icons-material/Home';

const useQuery = () => new URLSearchParams(useLocation().search);

const iconMap = {
  home: <HomeIcon fontSize="large" color="primary" />,
  faqs: <HelpOutlineIcon fontSize="large" color="primary" />,
  support: <ContactSupportIcon fontSize="large" color="primary" />,
  pricing: <LocalOfferIcon fontSize="large" color="primary" />,
  terms: <GavelIcon fontSize="large" color="primary" />,
  privacy: <PrivacyTipIcon fontSize="large" color="primary" />,
  refund: <PolicyIcon fontSize="large" color="primary" />,
  cancellation: <PolicyIcon fontSize="large" color="primary" />,
  booking: <PolicyIcon fontSize="large" color="primary" />,
  covid: <CoronavirusIcon fontSize="large" color="primary" />,
};

const FooterPage = () => {
  const query = useQuery();
  const type = query.get('type');

  const theme = useTheme();

  const contentMap = {
    home: `Welcome to EaseMyBooking! Plan your trips effortlessly. Enjoy hassle-free online booking, real-time availability, and verified listings of attractions. Whether it’s a zoo, museum, or amusement park, we’ve got it all in one place.`,

    faqs: `Q: How do I book a ticket?\nA: Just choose your place and date, then pay online.\n\nQ: Can I cancel my ticket?\nA: Yes, based on the cancellation policy.\n\nQ: How do I contact support?\nA: Email us at support@easemybooking.com.`,

    support: `Our customer support is available 24/7. For any queries related to booking, cancellation, or payment, contact us via:\n\n📧 Email: support@easemybooking.com\n📞 Phone: +91-1234567890\n💬 Live Chat: Available on the homepage.`,

    pricing: `We offer flexible pricing options for different destinations:\n- Adults: ₹299\n- Children: ₹199\n- Senior Citizens: ₹249\n\n*Group discounts and combo packages available.*`,

    terms: `By using EaseMyBooking, you agree to our terms:\n1. Bookings are subject to availability.\n2. Tickets once confirmed are non-transferable.\n3. Abuse of platform may lead to account suspension.`,

    privacy: `We value your privacy. Your personal data (email, phone, etc.) is stored securely and never shared without your consent. Payments are handled via secure encrypted gateways.`,

    refund: `Refunds are processed within 7 working days:\n- 100% refund if canceled 48 hours before\n- 50% refund within 24–48 hours\n- No refund within 24 hours of the event\n\n*T&Cs apply*.`,

    cancellation: `You can cancel your booking from the “My Bookings” section:\n- Instant confirmation of cancellation\n- Refund (if applicable) processed automatically\n- Contact support if not reflected within 7 days.`,

    booking: `Steps to book:\n1. Choose your destination\n2. Select date & time\n3. Enter visitor details\n4. Make secure payment\n\nBooking confirmation will be sent via email & SMS.`,

    covid: `We follow all Covid-19 guidelines:\n- Mandatory mask entry\n- Thermal screening at the gate\n- Contactless ticket scanning\n- Limited crowd capacity\n\nStay safe and travel responsibly.`,
  };

  const title = type ? type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Information';

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={4} sx={{
        p: 5,
        borderRadius: 4,
        background: `linear-gradient(135deg, ${theme.palette.grey[100]}, ${theme.palette.grey[200]})`,
      }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          {iconMap[type] || <InfoIcon fontSize="large" color="primary" />}
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
            {title}
          </Typography>
          <Divider sx={{ my: 2, width: 100, mx: 'auto' }} />
        </Box>

        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', fontSize: '1.05rem', color: '#333' }}>
          {contentMap[type] || 'Sorry, no information available for this page.'}
        </Typography>
      </Paper>
    </Container>
  );
};

export default FooterPage;
