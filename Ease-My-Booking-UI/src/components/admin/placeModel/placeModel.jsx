import React from "react";
import "./placeModel.css";

export default function PlaceModal({ place, packages = [], onClose, onConfirm, onDisable }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{onConfirm ? "Verify Place" : "Place Details"}</h2>

        {/* Image */}
        {place.imageUrl && (
          <img
            src={place.imageUrl}
            alt={place.placeName}
            className="place-image"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          />
        )}

        {/* Basic Info */}
        <div className="place-info">
          <p><strong>Name:</strong> {place.placeName}</p>
          <p><strong>City:</strong> {place.city}</p>
          <p><strong>State:</strong> {place.state}</p>
          <p><strong>Country:</strong> {place.country}</p>
          <p><strong>Pin Code:</strong> {place.pinCode}</p>
          <p><strong>Address:</strong> {place.address}</p>
          <p><strong>Description:</strong> {place.description}</p>
        </div>

        <hr />

        {/* Packages */}
        <div className="packages-section">
          <h4>Available Packages</h4>
          {packages.length === 0 ? (
            <p>No packages available.</p>
          ) : (
            <ul style={{ paddingLeft: "1rem" }}>
              {packages.map((pkg) => (
                <li key={pkg.id} style={{ marginBottom: "0.5rem" }}>
                  <strong>{pkg.packageName}</strong> – {pkg.details}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div
          className="modal-actions"
          style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between" }}
        >
          {onConfirm && (
            <button className="confirm-btn" onClick={onConfirm}>
              ✅ Confirm Verification
            </button>
          )}
          {onDisable && (
            <button className="disable-btn" onClick={onDisable}>
              ❌ Disable Place
            </button>
          )}
          <button className="cancel-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
