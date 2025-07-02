import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllPlaces,
  fetchCategories,
  createPlaceThunk,
  updatePlaceThunk,
  deletePlaceThunk,
} from "../../../appState/appThunk/placesThunk";
import AddPlace from "../addPlace/addPlace";
import "./organiserDashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrganiserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { places, categories, status } = useSelector((state) => state.places);
  const { isLoggedIn, userId, role, email } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("manage");
  const [statusFilter, setStatusFilter] = useState("accepted");
  const [showModal, setShowModal] = useState({ type: "", visible: false });
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState({
    visible: false,
    action: "",
    placeId: null,
    placeName: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (!role.includes("Organiser")) {
      alert("Access Denied. Organiser role required.");
      navigate("/login");
    } else {
      setIsLoading(true);
      Promise.all([
        dispatch(fetchAllPlaces()),
        dispatch(fetchCategories())
      ]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [dispatch, isLoggedIn, role, navigate]);

  const openModal = (type, id = null) => {
    setShowModal({ type, visible: true });
    setSelectedPlaceId(id);
  };

  const closeModal = () => {
    setShowModal({ type: "", visible: false });
    setSelectedPlaceId(null);
    dispatch(fetchAllPlaces());
  };

  const handleRequestVerification = async (placeId) => {
    try {
      setIsLoading(true);
      await dispatch(
        updatePlaceThunk({
          id: placeId,
          updatedData: {
            isRejected: false,
            isVerified: false,
          },
        })
      ).unwrap();
      toast.success("✅ Request for verification sent!");
      dispatch(fetchAllPlaces());
    } catch (error) {
      toast.error("❌ Failed to request verification");
    } finally {
      setIsLoading(false);
    }
  };

  const showConfirmationDialog = (action, placeId, placeName) => {
    setShowConfirmDialog({
      visible: true,
      action,
      placeId,
      placeName
    });
  };

  const hideConfirmationDialog = () => {
    setShowConfirmDialog({
      visible: false,
      action: "",
      placeId: null,
      placeName: ""
    });
  };

  const handleStatusChange = async () => {
    const { action, placeId } = showConfirmDialog;
    try {
      setIsLoading(true);
      await dispatch(
        updatePlaceThunk({
          id: placeId,
          updatedData: {
            isActive: action === "open",
          },
        })
      ).unwrap();
      toast.success(`Place ${action === "open" ? "opened" : "closed"} successfully!`);
      dispatch(fetchAllPlaces());
    } catch (error) {
      toast.error(`Failed to ${action} place`);
    } finally {
      setIsLoading(false);
      hideConfirmationDialog();
    }
  };

  const handleDeletePlace = async (placeId) => {
    try {
      setIsLoading(true);
      await dispatch(deletePlaceThunk(placeId));
      toast.success("Place deleted successfully!");
      dispatch(fetchAllPlaces());
    } catch (error) {
      toast.error("Failed to delete place");
    } finally {
      setIsLoading(false);
      hideConfirmationDialog();
    }
  };

  const myPlaces = (places || []).filter((p) => p && p.createdBy === userId);

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Single Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div style={{ textAlign: 'center' }}>
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading...</div>
          </div>
        </div>
      )}

      <aside className="sidebar">
        <h1 className="sidebar-title">📋 Organizer Panel</h1>
        <p className="sidebar-subtext">Welcome, {email}</p>

        <button
          className={`sidebar-button ${activeTab === "manage" ? "active" : ""}`}
          onClick={() => setActiveTab("manage")}
        >
          🏟️ Place Management
        </button>
        <button
          className={`sidebar-button ${activeTab === "status" ? "active" : ""}`}
          onClick={() => setActiveTab("status")}
        >
          📊 Status
        </button>
      </aside>

      <main className="main-content">
        {activeTab === "manage" && (
          <>
            <div className="header-with-actions">
              <h2>Place Management</h2>
              <button className="add-place-btn" onClick={() => openModal("addPlace")}>
                ➕ Add Place
              </button>
            </div>

            {status === "failed" && <p className="error-message">Error loading places</p>}
            {status === "succeeded" && myPlaces.length === 0 && (
              <p className="no-places-message">No places added yet.</p>
            )}

            {status === "succeeded" &&
              myPlaces.map((place) => (
                <div key={place.id} className="place-row">
                  <div className="place-info">
                    <span className="place-name">{place.placeName}</span>
                    <div className="place-meta">
                      <span className="place-city">{place.city}</span>
                      <span className="place-category">
                        {categories.find((c) => c.id === place.categoryId)?.categoryName || "Uncategorized"}
                      </span>
                      <span className={`place-status ${place.isActive ? "open" : "closed"}`}>
                        {place.isActive ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>
                  <div className="place-actions">
                    <button
                      className="action-btn view-btn"
                      onClick={() => navigate(`/organiser/place/${place.id}/details`)}
                    >
                      View Details
                    </button>
                    <button
                      className={`action-btn ${place.isActive ? "close-btn" : "open-btn"}`}
                      onClick={() => showConfirmationDialog(
                        place.isActive ? "close" : "open",
                        place.id,
                        place.placeName
                      )}
                    >
                      {place.isActive ? "Close" : "Open"}
                    </button>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => openModal("editPlace", place.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => showConfirmationDialog("delete", place.id, place.placeName)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </>
        )}

        {activeTab === "status" && (
          <div className="status-content">
            <h2>Status Overview</h2>

            <div className="filter-buttons">
              <button
                className={`filter-btn ${statusFilter === "accepted" ? "active" : ""}`}
                onClick={() => setStatusFilter("accepted")}
              >
                ✅ Accepted
              </button>
              <button
                className={`filter-btn ${statusFilter === "rejected" ? "active" : ""}`}
                onClick={() => setStatusFilter("rejected")}
              >
                ❌ Rejected
              </button>
            </div>

            {status === "failed" && <p className="error-message">Error loading places</p>}

            {status === "succeeded" && (
              <>
                {myPlaces.filter((p) =>
                  statusFilter === "accepted" ? p.isVerified : p.isRejected
                ).length === 0 ? (
                  <p>No {statusFilter} places.</p>
                ) : (
                  myPlaces
                    .filter((p) =>
                      statusFilter === "accepted" ? p.isVerified : p.isRejected
                    )
                    .map((place) => (
                      <div key={place.id} className="place-row">
                        <div className="place-info">
                          <span className="place-name">{place.placeName}</span>
                          <div className="place-meta">
                            <span className="place-city">{place.city}</span>
                            <span className="place-category">
                              {categories.find((c) => c.id === place.categoryId)?.categoryName || "Uncategorized"}
                            </span>
                          </div>
                        </div>

                        {statusFilter === "rejected" && (
                          <div className="place-actions">
                            <button className="request-btn" onClick={() => handleRequestVerification(place.id)}>
                              🔄 Request Verification
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </>
            )}
          </div>
        )}

        {/* Add/Edit Place Modal */}
        {showModal.visible && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={closeModal}>×</button>
              {showModal.type === "addPlace" && (
                <AddPlace
                  categories={categories}
                  organizerId={userId}
                  onAddPlace={(newPlace) => {
                    dispatch(createPlaceThunk(newPlace));
                    closeModal();
                  }}
                  onCancel={closeModal}
                />
              )}
              {showModal.type === "editPlace" && selectedPlaceId !== null && (
                <AddPlace
                  editing={true}
                  categories={categories}
                  organizerId={userId}
                  initialData={places.find((p) => p.id === selectedPlaceId)}
                  onAddPlace={(updatedPlace) => {
                    dispatch(updatePlaceThunk({ id: selectedPlaceId, updatedData: updatedPlace }));
                    closeModal();
                  }}
                  onCancel={closeModal}
                />
              )}
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog.visible && (
          <div className="modal-overlay">
            <div className="confirmation-dialog">
              <h3>
                {showConfirmDialog.action === "delete"
                  ? "Delete Place"
                  : `${showConfirmDialog.action === "open" ? "Open" : "Close"} Place`}
              </h3>
              <p>
                {showConfirmDialog.action === "delete"
                  ? `Are you sure you want to delete "${showConfirmDialog.placeName}"?`
                  : `Are you sure you want to ${showConfirmDialog.action} "${showConfirmDialog.placeName}"?`}
              </p>
              <div className="dialog-actions">
                <button
                  className="confirm-btn"
                  onClick={() => {
                    if (showConfirmDialog.action === "delete") {
                      handleDeletePlace(showConfirmDialog.placeId);
                    } else {
                      handleStatusChange();
                    }
                  }}
                >
                  Confirm
                </button>
                <button className="cancel-btn" onClick={hideConfirmationDialog}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrganiserDashboard;
