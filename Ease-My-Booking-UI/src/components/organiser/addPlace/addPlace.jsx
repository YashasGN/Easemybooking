import React, { useState, useEffect } from "react";
import "./addPlace.css";
import { uploadToCloudinary } from "../../../services/cloudinary.service";

const AddPlace = ({
  categories = [],
  organizerId,
  onAddPlace,
  onCancel,
  initialData = {},
  editing = false
}) => {
  const [formData, setFormData] = useState({
    createdBy: organizerId,
    placeName: "",
    categoryId: "",
    city: "",
    state: "",
    country: "",
    address: "",
    pinCode: "",
    description: "",
    imageUrl: ""
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editing && initialData) {
      setFormData({
        createdBy: organizerId,
        placeName: initialData.placeName || "",
        categoryId: initialData.categoryId || "",
        city: initialData.city || "",
        state: initialData.state || "",
        country: initialData.country || "",
        address: initialData.address || "",
        pinCode: initialData.pinCode || "",
        description: initialData.description || "",
        imageUrl: initialData.imageUrl || ""
      });
    }
  }, [editing, initialData, organizerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, imageUrl }));
    } catch (err) {
      alert("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.placeName || !formData.categoryId || !formData.city) {
      alert("Please fill in all required fields");
      return;
    }

    const submissionData = {
      ...formData,
      pinCode: formData.pinCode ? Number(formData.pinCode) : 0
    };

    await onAddPlace(submissionData); // Let parent handle refresh
  };

  return (
    <div className="add-place-form">
      <h2>{editing ? "Edit Place" : "Add New Place"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Place Name *</label>
          <input
            name="placeName"
            placeholder="Place Name"
            value={formData.placeName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>City *</label>
          <input
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>State</label>
          <input
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Country</label>
          <input
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            placeholder="Full address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>PIN Code</label>
          <input
            name="pinCode"
            type="number"
            placeholder="PIN Code"
            value={formData.pinCode}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Upload Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {uploading && <p>Uploading...</p>}
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Uploaded Preview"
              width={120}
              style={{ marginTop: "10px" }}
            />
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            {editing ? "Update Place" : "Add Place"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlace;
