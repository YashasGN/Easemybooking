import React, { useEffect, useState } from 'react';
import { getAllPackages,deletePackage } from '../../services/package_services';

const ViewPackages = () => {
  const [packages, setPackages] = useState([]);

  const fetchPackages = async () => {
    const res = await getAllPackages();
    setPackages(res.data);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    await deletePackage(id);
    fetchPackages();
  };

  return (
    <div>
      {packages.map((pkg) => (
        <div key={pkg.id}>
          <h3>{pkg.packageNames}</h3>
          <p>{pkg.details}</p>
          <button onClick={() => handleDelete(pkg.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ViewPackages;
