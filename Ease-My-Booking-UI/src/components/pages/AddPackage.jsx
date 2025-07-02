import React, { useState } from 'react';
import { createPackage } from '../../services/package_services';

const AddPackage = () => {
  const [formData, setFormData] = useState({
    PackageName: '',
    Details: '',
    PlaceId: '',
    CreatedBy: '',
    IsActive: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPackage(formData);
      alert('Package added successfully');
    } catch (err) {
      alert('Failed to add package');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="PackageName" placeholder="Package Name" onChange={handleChange} />
      <input name="Details" placeholder="Details" onChange={handleChange} />
      <input name="PlaceId" placeholder="Place ID" onChange={handleChange} type="number" />
      <input name="CreatedBy" placeholder="Created By" onChange={handleChange} />
      <label>
        Active:
        <input name="IsActive" type="checkbox" checked={formData.IsActive} onChange={handleChange} />
      </label>
      <button type="submit">Add Package</button>
    </form>
  );
};

export default AddPackage;
