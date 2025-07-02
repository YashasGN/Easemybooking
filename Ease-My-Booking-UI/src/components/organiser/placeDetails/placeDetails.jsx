import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPlaces,
  fetchCategories,
} from "../../../appState/appThunk/placesThunk";
import {
  fetchPackagesByPlaceId,
  deletePackageThunk,
} from "../../../appState/appThunk/packageThunk";
import {
  fetchSlotByPackageId,
  fetchPriceBySlotId,
  deleteSlotById,
  deleteSlotByPackageIdThunk,
  deletePriceByslotIdThunk,
  deletePriceByPackageIdThunk,
} from "../../../appState/appThunk/packageDetailsThunk";

import AddPackage from "../addPackage/addPackage";
import AddSlot from "../addSlot/addSlot";
import AddPrice from "../addPrice/addPrice";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import "./placeDetails.css";

const PlaceDetails = () => {
  const { id: placeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [showAddPriceModal, setShowAddPriceModal] = useState(false);
  const [editOptionsDialog, setEditOptionsDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetPackage, setDeleteTargetPackage] = useState(null);
  const [selectedSlotIdToDelete, setSelectedSlotIdToDelete] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);

  const { places, categories } = useSelector((s) => s.places);
  const { items: packages } = useSelector((s) => s.packages);
  const { slotsByPackageId, pricesBySlotId } = useSelector((s) => s.slotPrice);

  const place = places.find((p) => p.id === +placeId);

  useEffect(() => {
    if (!places.length) dispatch(fetchAllPlaces());
    dispatch(fetchCategories());
    dispatch(fetchPackagesByPlaceId(placeId));
  }, [dispatch, placeId]);

  useEffect(() => {
    packages.forEach((pkg) => {
      dispatch(fetchSlotByPackageId(pkg.id)).then((res) => {
        const slots = res.payload || [];
        slots.forEach((slot) => {
          const slotId = slot.slotsId || slot.id;
          if (slotId) dispatch(fetchPriceBySlotId(slotId));
        });
      });
    });
  }, [dispatch, packages]);

  const getCategoryName = () => {
    const cat = categories.find((c) => c.id === place?.categoryId);
    return cat?.categoryName || "Uncategorized";
  };

  const handleDeleteClick = (pkg) => {
    setDeleteTargetPackage(pkg);
    setSelectedSlotIdToDelete("");
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (option) => {
    const pid = deleteTargetPackage.id;
    if (option === "slot" && selectedSlotIdToDelete) {
      await dispatch(deletePriceByslotIdThunk(+selectedSlotIdToDelete));
      await dispatch(deleteSlotById(+selectedSlotIdToDelete));
    }
    if (option === "package") {
      await dispatch(deletePriceByPackageIdThunk(pid));
      await dispatch(deleteSlotByPackageIdThunk(pid));
      await dispatch(deletePackageThunk(pid));
    }
    dispatch(fetchPackagesByPlaceId(placeId));
    setDeleteDialogOpen(false);
    setDeleteTargetPackage(null);
    setSelectedSlotIdToDelete("");
  };

  const openEditOptions = (pkg) => {
    setEditMode(true);
    setSelectedPackageId(pkg.id);
    setEditingPackage(pkg);
    const firstSlot = slotsByPackageId[pkg.id]?.[0];
    setEditingSlot(firstSlot || null);
    setEditOptionsDialog(true);
  };

  return (
    <div className="place-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>⬅ Back</button>
      <div className="place-details-content">
        <div className="place-info-card">
          {place && (
            <>
              <h5>Place Details</h5>
              <h2>{place.placeName}</h2>
              <p><span role="img" aria-label="city">🏙️</span> <strong>City:</strong> {place.city}</p>
              <p><span role="img" aria-label="state">🗺️</span> <strong>State:</strong> {place.state}</p>
              <p><span role="img" aria-label="country">🌍</span> <strong>Country:</strong> {place.country}</p>
              <p><span role="img" aria-label="category">🏷️</span> <strong>Category:</strong> {getCategoryName()}</p>
              <p><span role="img" aria-label="address">🏠</span> <strong>Address:</strong> {place.address}</p>
              <p><span role="img" aria-label="pin code">📮</span> <strong>Pin Code:</strong> {place.pinCode}</p>
              <p><span role="img" aria-label="description">📝</span> <strong>Description:</strong> {place.description}</p>
              {place.imageUrl && <img className="place-img" src={place.imageUrl} alt="Place" />}
            </>
          )}
        </div>

        <div className="package-action-panel">
          <div className="action-buttons">
            <button className="action-btn" onClick={() => { setEditMode(false); setShowAddPackageModal(true); }}>➕ Add Package</button>
            <button className="action-btn" onClick={() => {
              if (packages.length) {
                setEditMode(false);
                setSelectedPackageId(packages[0].id);
                setShowAddSlotModal(true);
              } else alert("Add a package first");
            }}>➕ Add Slot</button>
            <button className="action-btn" onClick={() => {
              if (packages.length) {
                setEditMode(false);
                setSelectedPackageId(packages[0].id);
                setShowAddPriceModal(true);
              } else alert("Add a package first");
            }}>➕ Add Price</button>
          </div>

          <h3>Packages</h3>
          {packages.length === 0 ? (
            <p>No packages here.</p>
          ) : (
            <div className="package-list-container">
              {packages.map(pkg => {
                const slots = slotsByPackageId[pkg.id] || [];

                return (
                  <div key={pkg.id} className="package-card">
                    <h4>{pkg.packageName}</h4>
                    <p>{pkg.details}</p>
                    {pkg.imageUrl && <img className="package-img" src={pkg.imageUrl} alt="Pkg" />}

                    <div className="slot-price-section">
                      <h5>Slot & Pricing:</h5>
                      {slots.length ? slots.map(slot => {
                        const slotId = slot.slotsId || slot.id;
                        const prices = pricesBySlotId?.[slotId] || [];

                        return (
                          <div key={slotId} className="slot-price-item">
                            <strong>
                              {slot?.date?.split("T")[0] || "No Date"} {slot.timeFrom}-{slot.timeTo}
                            </strong>
                            {Array.isArray(prices) && prices.length ? (
                              prices.map((price, idx) => (
                                <p key={idx}>
                                  Children: ₹{price.priceChildren ?? "-"} |{" "}
                                  Adults: ₹{price.priceAdults ?? "-"} |{" "}
                                  Seniors: ₹{price.priceSenior ?? "-"} |{" "}
                                  Foreigners: ₹{price.priceForeign ?? "-"}
                                </p>
                              ))
                            ) : (
                              <p style={{ fontStyle: "italic", color: "#888" }}>No price set</p>
                            )}
                          </div>
                        );
                      }) : <p>No slots added yet.</p>}
                    </div>

                    <div className="card-actions">
                      <button className="edit-btn" onClick={() => openEditOptions(pkg)}>✏️ Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteClick(pkg)}>🗑️ Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Options</DialogTitle>
        <DialogContent>
          {deleteTargetPackage && slotsByPackageId[deleteTargetPackage.id]?.length ? (
            <>
              <p>Select slot to delete:</p>
              <select
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                value={selectedSlotIdToDelete}
                onChange={e => setSelectedSlotIdToDelete(e.target.value)}
              >
                <option value="">-- Select --</option>
                {slotsByPackageId[deleteTargetPackage.id].map(s => (
                  <option key={s.slotsId || s.id} value={s.slotsId || s.id}>
                    {s.date?.split("T")[0]} {s.timeFrom}-{s.timeTo}
                  </option>
                ))}
              </select>
              <Button
                disabled={!selectedSlotIdToDelete}
                color="error"
                fullWidth
                onClick={() => handleConfirmDelete('slot')}
              >
                Delete Slot
              </Button>
              <hr style={{ margin: '1rem 0' }} />
            </>
          ) : <p>No slots to delete.</p>}
          <Button color="warning" fullWidth onClick={() => handleConfirmDelete('package')}>
            Delete Entire Package
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Options Dialog */}
      <Dialog open={editOptionsDialog} onClose={() => setEditOptionsDialog(false)}>
        <DialogTitle>Choose what to edit</DialogTitle>
        <DialogContent>
          <Button fullWidth onClick={() => {
            setShowAddPackageModal(true);
            setEditOptionsDialog(false);
          }}>✏️ Edit Package</Button>
          <Button fullWidth onClick={() => {
            setShowAddSlotModal(true);
            setEditOptionsDialog(false);
          }}>✏️ Edit Slot</Button>
          <Button fullWidth onClick={() => {
            setShowAddPriceModal(true);
            setEditOptionsDialog(false);
          }}>✏️ Edit Price</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOptionsDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Modals */}
      <AddPackage
        open={showAddPackageModal}
        handleClose={() => setShowAddPackageModal(false)}
        placeId={+placeId}
        mode={editMode ? "edit" : "add"}
        initialData={editingPackage}
      />
      <AddSlot
        open={showAddSlotModal}
        handleClose={() => {
          setShowAddSlotModal(false);
          dispatch(fetchSlotByPackageId(selectedPackageId));
        }}
        packageId={selectedPackageId}
        mode={editMode ? "edit" : "add"}
        initialData={editingSlot}
      />
      <AddPrice
        open={showAddPriceModal}
        handleClose={() => {
          setShowAddPriceModal(false);
          dispatch(fetchSlotByPackageId(selectedPackageId)).then(res => {
            const slots = res.payload || [];
            slots.forEach(slot => {
              const sid = slot.slotsId || slot.id;
              if (sid) dispatch(fetchPriceBySlotId(sid));
            });
          });
        }}
        packageId={selectedPackageId}
        mode={editMode ? "edit" : "add"}
      />
    </div>
  );
};

export default PlaceDetails;
