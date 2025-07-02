import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  createPackageThunk,
  updatePackageThunk
} from "../../../appState/appThunk/packageThunk";
import { uploadToCloudinary } from "../../../services/cloudinary.service";

const AddPackage = ({
  open,
  handleClose,
  placeId,
  mode = "add",
  initialData = null,
  refreshPlaceData // ✅ New prop to refresh place/package data
}) => {
  const dispatch = useDispatch();
  const { places } = useSelector((state) => state.places);

  const [form, setForm] = useState({
    packageName: "",
    details: "",
    city: "",
    imageUrl: ""
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        packageName: initialData.packageName || "",
        details: initialData.details || "",
        imageUrl: initialData.imageUrl || "",
        city: initialData.city || ""
      });
    }
  }, [mode, initialData]);

  useEffect(() => {
    if (mode === "add" && placeId && places.length > 0) {
      const place = places.find((p) => p.id === placeId);
      if (place && !form.city) {
        setForm((prev) => ({ ...prev, city: place.city }));
      }
    }
  }, [mode, placeId, places, form.city]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadToCloudinary(file);
    setUploading(false);

    if (url) {
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } else {
      alert("Image upload failed. Please try again.");
    }
  };

  const handleSubmit = () => {
    if (mode === "add") {
      const newPackage = {
        ...form,
        placeId,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      dispatch(createPackageThunk(newPackage))
        .unwrap()
        .then(() => {
          refreshPlaceData?.(); // ✅ Refresh place/packages after add
          handleClose();
          setForm({
            packageName: "",
            details: "",
            city: "",
            imageUrl: ""
          });
        });
    } else if (mode === "edit" && initialData?.id) {
      const updatedPackage = {
        id: initialData.id,
        packageName: form.packageName,
        details: form.details,
        imageUrl: form.imageUrl,
        updatedAt: new Date().toISOString()
      };
      dispatch(updatePackageThunk(updatedPackage))
        .unwrap()
        .then(() => {
          refreshPlaceData?.(); // ✅ Refresh after edit
          handleClose();
        });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} transitionDuration={0}>
      <DialogTitle>{mode === "edit" ? "Edit Package" : "Add Package"}</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: 400 }}
      >
        <TextField
          label="Package Name"
          name="packageName"
          value={form.packageName}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Details"
          name="details"
          value={form.details}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />
        {mode === "add" && (
          <TextField
            label="City"
            name="city"
            value={form.city}
            fullWidth
            disabled
          />
        )}

        <div>
          <label style={{ fontWeight: "500", marginBottom: "4px", display: "block" }}>
            Upload Image
          </label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploading && <p>Uploading...</p>}
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Uploaded"
              style={{ width: "100px", marginTop: "10px", borderRadius: "4px" }}
            />
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {mode === "edit" ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPackage;
