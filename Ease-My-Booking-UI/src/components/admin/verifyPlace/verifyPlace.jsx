import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PlaceModal from "../placeModel/placeModel";
import { fetchAllPlaces, updatePlaceThunk } from "../../../appState/appThunk/placesThunk";
import { getPackagesByPlaceId } from "../../../services/package_services";
import "./verifyPlace.css";

export default function VerifyPlace({ onVerify }) {
  const dispatch = useDispatch();

  // Redux state
  const { places = [], status } = useSelector((state) => state.places);
  const userId = useSelector((state) => state.user.userId);

  // Local state
  const [showModal, setShowModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [verifiedIds, setVerifiedIds] = useState([]);
  const [rejectedIds, setRejectedIds] = useState([]);
  const [placePackages, setPlacePackages] = useState([]);

  // Fetch all places initially
  useEffect(() => {
    dispatch(fetchAllPlaces());
  }, [dispatch]);

  // Filter unverified and unrejected places
  const unverifiedPlaces = places.filter(
    (p) =>
      !p.isVerified &&
      !p.isRejected &&
      !verifiedIds.includes(p.id) &&
      !rejectedIds.includes(p.id)
  );

  // Open modal to verify place and load its packages
  const handleVerifyClick = async (place) => {
    setSelectedPlace(place);
    setShowModal(true);

    try {
      const packages = await getPackagesByPlaceId(place.id);
      setPlacePackages(packages || []);
    } catch (err) {
      console.error("Failed to fetch packages", err);
      setPlacePackages([]);
    }
  };

  // Confirm verification
  const handleConfirmVerification = async () => {
    if (!selectedPlace) return;

    try {
      await dispatch(
        updatePlaceThunk({
          id: selectedPlace.id,
          updatedData: {
            ...selectedPlace,
            isVerified: true,
            isRejected: false,
            verifiedBy: userId,
          },
        })
      ).unwrap();

      setVerifiedIds((prev) => [...prev, selectedPlace.id]);
      toast.success(`${selectedPlace.placeName} verified successfully ✅`);
      onVerify?.(selectedPlace);
      setShowModal(false);
    } catch (error) {
      toast.error("❌ Failed to verify place. Try again.");
    }
  };

  // Reject place
  const handleReject = async (place) => {
    try {
      await dispatch(
        updatePlaceThunk({
          id: place.id,
          updatedData: {
            ...place,
            isVerified: false,
            isRejected: true,
            verifiedBy: userId,
          },
        })
      ).unwrap();

      setRejectedIds((prev) => [...prev, place.id]);
      toast.warn(`${place.placeName} was rejected ❌`);
    } catch (error) {
      toast.error("❌ Failed to reject place.");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Loading/Status Messages */}
      {status === "loading" && <p className="loading">Loading places...</p>}
      {status === "failed" && <p className="error">Failed to load places.</p>}
      {status === "succeeded" && unverifiedPlaces.length === 0 && (
        <p className="no-places">✅ All places are verified or rejected</p>
      )}

      {/* Unverified Place Cards */}
      <div className="verify-grid">
        {unverifiedPlaces.map((place) => (
          <div className="verify-card" key={place.id}>
            <h3>{place.placeName}</h3>
            <p className="location">📍 {place.city}</p>

            <div className="verify-actions">
              <button
                className="verify-button"
                onClick={() => handleVerifyClick(place)}
                disabled={verifiedIds.includes(place.id)}
              >
                ✅ Verify
              </button>
              <button
                className="reject-button"
                onClick={() => handleReject(place)}
                disabled={rejectedIds.includes(place.id)}
              >
                ❌ Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for verification */}
      {showModal && selectedPlace && (
        <PlaceModal
          place={selectedPlace}
          packages={placePackages}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmVerification}
        />
      )}
    </>
  );
}
