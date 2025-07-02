import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPlacesByCityAndCategory,
  fetchCategories,
  fetchAllPlaces,
  updatePlaceThunk,
  fetchVerifiedPlaces,
  createPlaceThunk,
  deletePlaceThunk,
} from "../appThunk/placesThunk";

const initialStateOfPlaces = {
  places: [],            // All places (used by admin panel, etc.)
  filteredPlaces: [],    // ✅ Filtered places based on city + category
  categories: [],
  verifiedPlaces: [],
  searchResults: [],     // Home search bar
  status: "",
};

const placesSlicer = createSlice({
  name: "places",
  initialState: initialStateOfPlaces,
  reducers: {
    searchPlacesByName: (state, action) => {
      const query = action.payload.toLowerCase();
      state.searchResults = state.places.filter((place) =>
        place.placeName.toLowerCase().includes(query)
      );
    },
  },
  extraReducers: (builder) => {
    builder

      // ======= fetchPlacesByCityAndCategory =======
      .addCase(fetchPlacesByCityAndCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlacesByCityAndCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.filteredPlaces = action.payload; // ✅ not overwriting `places`
      })
      .addCase(fetchPlacesByCityAndCategory.rejected, (state, action) => {
        state.status = "failed";
        console.error("Error fetching filtered places:", action.error.message);
      })

      // ======= fetchCategories =======
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        console.error("Error fetching categories:", action.error.message);
      })

      // ======= fetchAllPlaces =======
      .addCase(fetchAllPlaces.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllPlaces.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.places = action.payload;
      })
      .addCase(fetchAllPlaces.rejected, (state, action) => {
        state.status = "failed";
        console.error("Error fetching all places:", action.error.message);
      })

      // ======= updatePlaceThunk =======
      .addCase(updatePlaceThunk.fulfilled, (state, action) => {
        const updatedPlace = action.payload;
        const index = state.places.findIndex((place) => place.id === updatedPlace.id);
        if (index !== -1) {
          state.places[index] = updatedPlace;
        }

        // Also update filteredPlaces if applicable
        const filteredIndex = state.filteredPlaces.findIndex((p) => p.id === updatedPlace.id);
        if (filteredIndex !== -1) {
          state.filteredPlaces[filteredIndex] = updatedPlace;
        }
      })

      // ======= fetchVerifiedPlaces =======
      .addCase(fetchVerifiedPlaces.fulfilled, (state, action) => {
        state.verifiedPlaces = action.payload;
      })

      // ======= deletePlaceThunk =======
      .addCase(deletePlaceThunk.fulfilled, (state, action) => {
        const deletedPlaceId = action.payload;
        state.places = state.places.filter((place) => place.id !== deletedPlaceId);
        state.filteredPlaces = state.filteredPlaces.filter((place) => place.id !== deletedPlaceId);
      })

      // ======= createPlaceThunk =======
      .addCase(createPlaceThunk.fulfilled, (state, action) => {
        const newPlace = action.payload;
        state.places.push(newPlace);
      });
  },
});

export const { searchPlacesByName } = placesSlicer.actions;
export default placesSlicer.reducer;
