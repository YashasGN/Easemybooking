import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVerifiedPlaces,
  updatePlaceThunk,
} from "../../../appState/appThunk/placesThunk";
import PlaceModal from "../placeModel/placeModel";
import { getPackagesByPlaceId } from "../../../services/package_services";
import "./verifiedPlace.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VerifiedPlaces() {
  const dispatch = useDispatch();
  const { verifiedPlaces = [], status } = useSelector((state) => state.places);
  const userId = useSelector((state) => state.user.userId);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placePackages, setPlacePackages] = useState([]);

  useEffect(() => {
    dispatch(fetchVerifiedPlaces());
  }, [dispatch]);

  const cityOptions = [...new Set(verifiedPlaces.map((p) => p.city))];

  const filteredPlaces = verifiedPlaces.filter((place) => {
    const byCity = selectedCity ? place.city === selectedCity : true;
    const byName = place.placeName
      ?.toLowerCase()
      .startsWith(searchTerm.toLowerCase());
    return byCity && byName;
  });

  const handleCardClick = async (place) => {
    setSelectedPlace(place);
    setShowModal(true);
    try {
      const pkgs = await getPackagesByPlaceId(place.id);
      setPlacePackages(pkgs || []);
    } catch (err) {
      console.error("Failed loading packages", err);
      setPlacePackages([]);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedPlace(null);
    setPlacePackages([]);
  };

  const handleDisable = async () => {
    if (!selectedPlace) return;

    try {
      await dispatch(
        updatePlaceThunk({
          id: selectedPlace.id,
          updatedData: {
            ...selectedPlace,
            isVerified: false,
            isRejected: true,
            verifiedBy: userId,
          },
        })
      ).unwrap();

      toast.success(`${selectedPlace.placeName} disabled successfully ❌`);
      setShowModal(false);
    } catch (error) {
      toast.error("❌ Failed to disable the place.");
    }
  };

  return (
    <div className="verified-section">
      <h2 className="verified-title">✅ Verified Places</h2>

      <div className="verified-filters">
        <input
          type="text"
          placeholder="🔍 Search by place name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="verified-search"
        />
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="verified-select"
        >
          <option value="">All Cities</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {status === "loading" && (
        <p className="verified-loading">Loading verified places...</p>
      )}
      {status === "failed" && (
        <p className="verified-error">Failed to load places.</p>
      )}
      {status === "succeeded" && filteredPlaces.length === 0 && (
        <p className="verified-empty">No matching places found.</p>
      )}

      <div className="verified-grid">
        {filteredPlaces.map((place) => (
          <div
            key={place.id}
            className="verified-card"
            onClick={() => handleCardClick(place)}
          >
            <h3 className="place-name">{place.placeName}</h3>
            <p className="city-tag">📍 {place.city}</p>
          </div>
        ))}
      </div>

      {showModal && selectedPlace && (
        <PlaceModal
          place={selectedPlace}
          packages={placePackages}
          onClose={handleClose}
          onDisable={handleDisable} // pass disable handler to modal
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
