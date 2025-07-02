import React, { useRef, useEffect, useState } from 'react';
import './myBooking.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactionByUserIdThunk } from '../../../appState/appThunk/transactionThunk';
import { fetchPackageById } from '../../../appState/appThunk/packageThunk';
import { fetchAllPlaces } from '../../../appState/appThunk/placesThunk';

export default function MyBooking() {
  const ticketRef = useRef(null);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { transaction, loading, error } = useSelector((state) => state.transaction);
  const { places } = useSelector((state) => state.places);

  const [packageMap, setPackageMap] = useState({});

  useEffect(() => {
    if (user?.userId) {
      dispatch(getTransactionByUserIdThunk(user.userId));
      dispatch(fetchAllPlaces());
    }
  }, [dispatch, user?.userId]);

  useEffect(() => {
    const fetchPackages = async () => {
      const map = {};
      for (const txn of transaction || []) {
        if (!map[txn.packageId]) {
          try {
            const result = await dispatch(fetchPackageById(txn.packageId)).unwrap();
            map[txn.packageId] = result;
          } catch (err) {
            console.error('Package fetch error:', err);
          }
        }
      }
      setPackageMap(map);
    };

    if (transaction?.length > 0) {
      fetchPackages();
    }
  }, [transaction, dispatch]);

  const downloadPDF = () => {
    if (!ticketRef.current) return;

    html2canvas(ticketRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('ticket.pdf');
    });
  };

  const today = new Date();
  const validTransactions = Array.isArray(transaction)
    ? transaction.filter((booking) => {
        const bookingDate = new Date(booking.sloteDate);
        return bookingDate >= today.setHours(0, 0, 0, 0);
      })
    : [];

  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p>Error: {error}</p>;
  if (validTransactions.length === 0) return <p>No upcoming bookings found.</p>;

  return (
    <div className="ticket-wrapper">
      {validTransactions.map((booking) => {
        const pkg = packageMap[booking.packageId];
        const place = pkg ? places.find((p) => p.id === pkg.placeId) : null;

        const lines = [
          `Booking ID: ${booking.transactionId}`,
          `Package: ${pkg?.packageName || 'N/A'}`,
          `Place: ${place?.placeName || 'N/A'}`,
          `Address: ${place?.address || ''}, ${place?.city || ''}, ${place?.state || ''} - ${place?.pinCode || ''}`,
          `Date: ${booking.sloteDate}`,
          `Slot: ${booking.sloteTime}`,
          booking.ticketForChildren > 0 && `Children: ${booking.ticketForChildren}`,
          booking.ticketForAdults > 0 && `Adults: ${booking.ticketForAdults}`,
          booking.ticketForSeniorCitizen > 0 && `Seniors: ${booking.ticketForSeniorCitizen}`,
          booking.ticketForForeigner > 0 && `Foreigners: ${booking.ticketForForeigner}`,
          `Total: ₹${booking.totalTicketsPrice}`
        ].filter(Boolean);

        const qrData = lines.join('\n');

        return (
          <div key={booking.id} className="ticket-card" ref={ticketRef}>
            <div className="ticket-left">
              <h2>Ease My Booking 🎟️</h2>
              <p><strong>Transaction ID:</strong> {booking.transactionId}</p>
              <p><strong>Package:</strong> {pkg?.packageName || 'Loading...'}</p>
              <p><strong>Place:</strong> {place?.placeName || 'Loading...'}</p>
              <p><strong>Address:</strong> {place ? `${place.address}, ${place.city}, ${place.state} - ${place.pinCode}` : '...'}</p>
              <p><strong>Booking Date:</strong> {booking.sloteDate}</p>
              <p><strong>Slot:</strong> {booking.sloteTime}</p>
              <p><strong>Status:</strong> {booking.transactionStatus}</p>
            </div>
            <div className="ticket-right">
              {booking.ticketForChildren > 0 && <p>👶 Children: {booking.ticketForChildren}</p>}
              {booking.ticketForAdults > 0 && <p>🧑 Adults: {booking.ticketForAdults}</p>}
              {booking.ticketForSeniorCitizen > 0 && <p>🧓 Seniors: {booking.ticketForSeniorCitizen}</p>}
              {booking.ticketForForeigner > 0 && <p>🌍 Foreigners: {booking.ticketForForeigner}</p>}
              <p><strong>Total:</strong> ₹{booking.totalTicketsPrice}</p>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=100x100`}
                alt="QR Code"
              />
            </div>
          </div>
        );
      })}
      <button className="download-btn" onClick={downloadPDF}>Download Ticket</button>
    </div>
  );
}
