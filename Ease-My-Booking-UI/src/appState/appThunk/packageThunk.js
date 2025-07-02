import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPackagesByPlaceId,getPackagesById , getAllPackages,createPackage,updatePackage,deletePackage} from "../../services/package_services";

export const fetchPackagesByPlaceId = createAsyncThunk(
  'packages/fetchByPlaceId',
  async (placeId, { rejectWithValue }) => {
    try {
      const response = await getPackagesByPlaceId(placeId);
      return response; // already .data in service
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPackageById = createAsyncThunk(
  'packages/fetchById',
  async (packageId, { rejectWithValue }) => {
    try {
      const response = await getPackagesById(packageId);
      return response; // already .data in service
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllPackages = createAsyncThunk(
  'packages/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllPackages();
      return response; // already .data in service
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPackageThunk = createAsyncThunk(
  'packages/create',
  async (newPackage, { rejectWithValue }) => {
    try {
      const response = await createPackage(newPackage);
      return response; // already .data in service
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePackageThunk = createAsyncThunk(
  'packages/update',
  async (updatedPackage, { rejectWithValue }) => {
    try {
      const response = await updatePackage(updatedPackage.id, updatedPackage);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const deletePackageThunk = createAsyncThunk(
  'packages/delete',
  async (packageId, { rejectWithValue }) => {
    try {
      const response = await deletePackage(packageId);
      return response; // already .data in service
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);