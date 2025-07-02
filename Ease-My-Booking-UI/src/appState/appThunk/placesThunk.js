import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPlacesByCityAndCategory,getCategories,getAllPlaces,updatePlace,deletePlace,createPlace} from "../../services/places.service";

const fetchPlacesByCityAndCategory = createAsyncThunk('getPlacesByCityAndCategory',async (params) => {
    const { city, category } = params;
    try {
        const response = await getPlacesByCityAndCategory(city, category);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
});



const fetchCategories = createAsyncThunk('getCategories', async () => {
    try {
        const response = await getCategories();
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
});

const fetchAllPlaces = createAsyncThunk('getAllPlaces', async () => {
    try {
        const response = await getAllPlaces();
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
});

const updatePlaceThunk = createAsyncThunk('updatePlace', async ({ id, updatedData }) => {
    try {
        const response = await updatePlace(id, updatedData);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
});

const fetchVerifiedPlaces = createAsyncThunk('getVerifiedPlaces', async () => {
    try {
        const response = await getAllPlaces();
        const result= response.filter(place => place.isVerified); // ✅ filter verified
        console.log("Verified Places:", result);
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
});

const deletePlaceThunk = createAsyncThunk('deletePlace', async (id) => {
    try {
        const response = await deletePlace(id);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
});

const createPlaceThunk = createAsyncThunk('createPlace', async (newPlace) => {
    try {
        const response = await createPlace(newPlace);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
});
export { fetchPlacesByCityAndCategory, fetchCategories, fetchAllPlaces, updatePlaceThunk, fetchVerifiedPlaces , deletePlaceThunk,createPlaceThunk };