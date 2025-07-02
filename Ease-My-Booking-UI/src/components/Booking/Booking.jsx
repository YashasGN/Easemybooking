import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackageById } from '../../appState/appThunk/packageThunk';
import { fetchSlotByPackageId, fetchPriceBySlotId } from '../../appState/appThunk/packageDetailsThunk';
import { createTransactionThunk } from '../../appState/appThunk/transactionThunk';
import './Booking.css';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaGooglePay, FaCreditCard, FaUniversity, FaWallet } from 'react-icons/fa';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import isTuesday from 'date-fns/isTuesday';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

function Booking() {
  const { packageId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const packageData = useSelector((state) => state.packages.selected);
  const slots = useSelector((state) => state.slotPrice?.slots || []);
  const pricesBySlotId = useSelector((state) => state.slotPrice?.pricesBySlotId || {});
  const user = useSelector((state) => state.user);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [tickets, setTickets] = useState({ children: 0, adults: 0, seniors: 0, foreigners: 0 });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (packageId) {
      Promise.all([
        dispatch(fetchPackageById(packageId)),
        dispatch(fetchSlotByPackageId(packageId))
      ]).finally(() => setLoading(false));
    }
  }, [dispatch, packageId]);

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
    dispatch(fetchPriceBySlotId(slot.slotsId));
  };

  const selectedPriceArray = selectedSlot?.slotsId ? pricesBySlotId[selectedSlot.slotsId] || [] : [];
  const price = Array.isArray(selectedPriceArray) ? selectedPriceArray[0] : null;

  const handleTicketChange = (type, operation) => {
    setTickets(prev => ({
      ...prev,
      [type]: operation === 'increase' ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }));
  };

  const calculateTotal = () => {
    if (!price) return 0;
    return (
      tickets.children * price.priceChildren +
      tickets.adults * price.priceAdults +
      tickets.seniors * price.priceSenior +
      tickets.foreigners * price.priceForeign
    );
  };

  const handlePaymentSelection = (method) => {
    setSelectedPayment(method);
  };

  const generateTransactionId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const handleBookNow = async () => {
    if (!selectedDate || !selectedSlot || calculateTotal() <= 0 || !selectedPayment) {
      alert("Please complete all booking details before proceeding");
      return;
    }

    if (!user.isLoggedIn || !user.userId) {
      alert("Please log in to proceed with booking");
      navigate("/login");
      return;
    }

    setBookingInProgress(true);

    const transactionPayload = {
      transactionId: generateTransactionId(),
      packageId: parseInt(packageId),
      userId: user.userId,
      userName: user.email,
      modeOfPayment: selectedPayment,
      transactionStatus: "Success",
      ticketForChildren: tickets.children,
      ticketForAdults: tickets.adults,
      ticketForSeniorCitizen: tickets.seniors,
      ticketForForeigner: tickets.foreigners,
      totalTicketsPrice: calculateTotal(),
      sloteDate: selectedDate,
      sloteTime: `${selectedSlot.timeFrom} - ${selectedSlot.timeTo}`
    };

    try {
      const resultAction = await dispatch(createTransactionThunk(transactionPayload));
      if (createTransactionThunk.fulfilled.match(resultAction)) {
        toast.success("🎉 Booking Confirmed!", {
          position: "top-center",
          autoClose: 3000,
          onClose: () => navigate("/")
        });
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      alert("Booking failed. Please try again.");
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress size={60} thickness={5} />
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!packageData || slots.length === 0) {
    return (
      <div className="loading-container">
        <p>Unable to load booking details. Please try again later.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <ToastContainer />
      <div className="booking-header">
        <h1>Book {packageData.packageName}</h1>
        <button className="back-button" onClick={() => navigate(-1)}>&larr; Back</button>
      </div>

      <div className="booking-content">
        {/* 🔒 DO NOT TOUCH LEFT SIDE PACKAGE DISPLAY */}
        <div className="package-summary">
          <img
            src={packageData.imageUrl || 'https://via.placeholder.com/300x200'}
            alt={packageData.packageName}
            className="package-image"
          />
          <div className="package-details">
            <h2>{packageData.packageName}</h2>
            <p>{packageData.details}</p>
            <div className="package-rating">⭐ {packageData.rating}/10</div>
          </div>
        </div>

        <div className="booking-steps">
          <div className="booking-step">
            <h3>Select Date</h3>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Choose a date"
                value={selectedDate ? new Date(selectedDate) : null}
                onChange={(newValue) => {
                  if (newValue) {
                    const formatted = newValue.toISOString().split('T')[0];
                    setSelectedDate(formatted);
                    setSelectedSlot(null);
                  }
                }}
                disablePast
                shouldDisableDate={(date) => isTuesday(date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </div>

          {selectedDate && (
            <div className="booking-step">
              <h3>Select Time Slot</h3>
              <div className="slot-buttons">
                {slots.map(slot => (
                  <button
                    key={slot.slotsId}
                    className={`slot-button ${selectedSlot?.slotsId === slot.slotsId ? 'selected' : ''}`}
                    onClick={() => handleSlotSelection(slot)}
                  >
                    {slot.timeFrom} - {slot.timeTo}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedSlot && price && (
            <>
              <div className="booking-step">
                <h3>Select Tickets</h3>
                <div className="ticket-selector">
                  {['children', 'adults', 'seniors', 'foreigners'].map((type) => (
                    <div className="ticket-type" key={type}>
                      <span>
                        {type === 'children' && '👶 Children: ₹' + price.priceChildren}
                        {type === 'adults' && '🧑 Adults: ₹' + price.priceAdults}
                        {type === 'seniors' && '🧓 Seniors: ₹' + price.priceSenior}
                        {type === 'foreigners' && '🌐 Foreigners: ₹' + price.priceForeign}
                      </span>
                      <div className="quantity-control">
                        <button onClick={() => handleTicketChange(type, 'decrease')} disabled={tickets[type] === 0}>−</button>
                        <span>{tickets[type]}</span>
                        <button onClick={() => handleTicketChange(type, 'increase')}>＋</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="total-amount"><strong>Total: ₹{calculateTotal()}</strong></div>
              </div>

              <div className="booking-step">
                <h3>Select Payment Method</h3>
                <div className="payment-options">
                  {['upi', 'card', 'netbanking', 'wallet'].map((method) => {
                    const icons = {
                      upi: <FaGooglePay size={30} color="#4285F4" />,
                      card: <FaCreditCard size={30} color="#0A66C2" />,
                      netbanking: <FaUniversity size={30} color="#4CAF50" />,
                      wallet: <FaWallet size={30} color="#FF9800" />
                    };
                    return (
                      <div
                        key={method}
                        className={`payment-option ${selectedPayment === method ? 'selected' : ''}`}
                        onClick={() => handlePaymentSelection(method)}
                      >
                        {icons[method]} <span>{method.charAt(0).toUpperCase() + method.slice(1)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                className="book-now-button"
                onClick={handleBookNow}
                disabled={bookingInProgress}
              >
                {bookingInProgress ? (
                  <>
                    <CircularProgress size={20} style={{ color: 'white', marginRight: '10px' }} />
                    Processing...
                  </>
                ) : 'Complete Booking'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Booking;
