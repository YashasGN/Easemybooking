import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './cardDetails.css';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchPackageById,
  updatePackageThunk,
} from '../../appState/appThunk/packageThunk';
import {
  fetchSlotByPackageId,
  fetchPriceByPackageId,
} from '../../appState/appThunk/packageDetailsThunk';

function CardDetails() {
  const { packageId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const packageData = useSelector((state) => state.packages.selected);
  const slots = useSelector((state) => state.slotPrice?.slots) || [];
  const price = useSelector((state) => state.slotPrice?.price) || null;
  const user = useSelector((state) => state.user);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false); // ✅ track if user has rated

  useEffect(() => {
    if (packageId) {
      dispatch(fetchPackageById(packageId));
      dispatch(fetchPriceByPackageId(packageId));
      dispatch(fetchSlotByPackageId(packageId));
    }
  }, [dispatch, packageId]);

  const handleBookClick = () => {
    if (!user?.isLoggedIn) {
      toast.warning('⚠️ Please login to proceed with booking.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      navigate(`/booking/${packageId}`);
    }
  };

  const handleSubmitRating = async () => {
    if (!userRating) return;

    try {
      const previousRating = packageData.rating || 0;
      const newRating = ((previousRating + userRating * 2) / 2).toFixed(1); // ✅ keep 1 decimal

      const updatedPackage = {
        id: packageData.id,
        rating: parseFloat(newRating),
        updatedAt: new Date().toISOString(),
      };

      await dispatch(updatePackageThunk(updatedPackage));
      await dispatch(fetchPackageById(packageId));

      setShowRatingModal(false);
      setUserRating(0);
      setHasRated(true); // ✅ hide Rate Now
      toast.success('Thank you for your rating!');
    } catch (error) {
      toast.error('Failed to submit rating. Please try again.');
    }
  };

  const groupedSlots = slots.reduce((acc, slot) => {
    acc[slot.date] = acc[slot.date] || [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  if (!packageData) {
    return <p style={{ padding: '1rem' }}>Loading package details...</p>;
  }

  return (
    <div className="card-container">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="image-card">
        <img
          src={packageData?.imageUrl || 'https://via.placeholder.com/400x300'}
          alt={packageData?.packageName || 'Package'}
          className="zoo-image"
        />
      </div>

      <div className="details-card">
        <h2 className="zoo-title">🎒 {packageData?.packageName}</h2>
        <ul className="zoo-details">
          <li>
            📝 <strong>Description:</strong> {packageData?.details}
          </li>
          <li>
            ⭐ <strong>Rating:</strong> {packageData?.rating?.toFixed(1)}/10
            {!hasRated && (
              <button
                className="rate-button"
                onClick={() => setShowRatingModal(true)}
              >
                Rate now
              </button>
            )}
          </li>
        </ul>

        {price && (
          <>
            <h3>🎟️ Ticket Pricing:</h3>
            <ul className="zoo-details">
              <li>👶 Children: ₹{price.priceChildren}</li>
              <li>🧑 Adults: ₹{price.priceAdults}</li>
              <li>🧓 Seniors: ₹{price.priceSenior}</li>
              <li>🌐 Foreigners: ₹{price.priceForeign}</li>
            </ul>
          </>
        )}

        {Object.keys(groupedSlots).length > 0 && (
          <>
            <h3>⏰ Available Slots:</h3>
            <ul className="zoo-details">
              {Object.entries(groupedSlots).map(([date, slotsOnDate]) => (
                <li key={date}>
                  <strong>📅 {date}</strong>
                  <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
                    {slotsOnDate.map((slot) => (
                      <li key={slot.slotsId}>
                        🕐 {slot.timeFrom} - {slot.timeTo}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </>
        )}

        <button className="buy-button" onClick={handleBookClick}>
          🎫 Book Now
        </button>
      </div>

      {showRatingModal && (
        <div className="rating-modal-overlay">
          <div className="rating-modal">
            <h3>Rate this package</h3>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${
                    (hoverRating || userRating) >= star ? 'filled' : ''
                  }`}
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="rating-modal-actions">
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setUserRating(0);
                }}
              >
                Cancel
              </button>
              <button onClick={handleSubmitRating} disabled={!userRating}>
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardDetails;
