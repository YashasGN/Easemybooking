// src/appThunk/slotPriceThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPriceByPackageId, getSlotByPackageId,createPrice,createSlots,updateSlot,
  updatePrice,deletePriceByPackageId,deletePriceByslotId,deleteSlotByPackageId,deleteSlot,getPriceBySlotId} from "../../services/packageDetails.services";

export const fetchSlotByPackageId = createAsyncThunk(
  'slot/fetchByPackageId',
  async (packageId, { rejectWithValue }) => {
    try {
      const response = await getSlotByPackageId(packageId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPriceByPackageId = createAsyncThunk(
  'price/fetchByPackageId',
  async (packageId, { rejectWithValue }) => {
    try {
      const response = await getPriceByPackageId(packageId);
      console.log("Price response:", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPriceThunk = createAsyncThunk(
  'price/add',
  async (priceData, { rejectWithValue }) => {
    try {
      const response = await createPrice(priceData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addSlotThunk = createAsyncThunk(
  'slot/add',
  async (slotData, { rejectWithValue }) => {
    try {
      const response = await createSlots(slotData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSlotThunk = createAsyncThunk(
  'slot/update',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await updateSlot(id, updatedData); // use `id` here
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePriceThunk = createAsyncThunk(
  'price/update',
  async ({ slotId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await updatePrice(slotId, updatedData); // use `id` here
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePriceByPackageIdThunk = createAsyncThunk(
  'price/deleteByPackageId',
  async (packageId, { rejectWithValue }) => {
    try {
      const response = await deletePriceByPackageId(packageId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePriceByslotIdThunk = createAsyncThunk(
  'price/deleteBySlotId',
  async (slotId, { rejectWithValue }) => {
    try {
      const response = await deletePriceByslotId(slotId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

 export const deleteSlotByPackageIdThunk = createAsyncThunk(
  'slot/deleteByPackageId',
  async (packageId, { rejectWithValue }) => {
    try {
      const response = await deleteSlotByPackageId(packageId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSlotById = createAsyncThunk(
  'slot/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteSlot(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPriceBySlotId = createAsyncThunk(
  'price/fetchBySlotId',
  async (slotId, { rejectWithValue }) => {
    try {
      const response = await getPriceBySlotId(slotId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);