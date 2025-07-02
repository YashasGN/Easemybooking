import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPackageById, updatePackage } from '../../services/package_services';

const UpdatePackage = () => {
  const { id } = useParams(); // assuming you're using react-router for dynamic routing
  const [formData, setFormData] = useState({
    PackageName: '',
    Details: '',
    PriceId: '',
    IsActive: true,
    PlaceId: ''
  });

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await getPackageById(id);
        const data = response.data;
        setFormData({
          PackageName: data.packageName || '',
          Details: data.details || '',
          PriceId: data.priceId || '',
          IsActive: data.isActive ?? true,
          PlaceId: data.placeId || ''
        });
      } catch (err) {
        alert('Failed to fetch package data');
        console.error(err);
      }
    };

    fetchPackage();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePackage(id, formData);
      alert('Package updated successfully');
    } catch (err) {
      alert('Failed to update package');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="PackageName" value={formData.PackageName} placeholder="Package Name" onChange={handleChange} />
      <input name="Details" value={formData.Details} placeholder="Details" onChange={handleChange} />
      <input name="PriceId" value={formData.PriceId} placeholder="Price ID" type="number" onChange={handleChange} />
      <input name="PlaceId" value={formData.PlaceId} placeholder="Place ID" type="number" onChange={handleChange} />
      <label>
        Active:
        <input name="IsActive" type="checkbox" checked={formData.IsActive} onChange={handleChange} />
      </label>
      <button type="submit">Update Package</button>
    </form>
  );
};

export default UpdatePackage;
