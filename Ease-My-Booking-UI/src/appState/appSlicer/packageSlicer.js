import { createSlice } from "@reduxjs/toolkit";
import { fetchPackagesByPlaceId, fetchPackageById, fetchAllPackages, createPackageThunk,updatePackageThunk} from "../appThunk/packageThunk";

const packageSlicer = createSlice({
  name: 'packages',
  initialState: {
    items: [],
    selected: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ✅ Fetch all packages by place ID
      .addCase(fetchPackagesByPlaceId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPackagesByPlaceId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPackagesByPlaceId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // ✅ Fetch a single package by package ID
      .addCase(fetchPackageById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPackageById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selected = action.payload; // <-- ✅ This is the key line
        const packageIndex = state.items.findIndex(pkg => pkg.id === action.payload.id);

        if (packageIndex !== -1) {
          state.items[packageIndex] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchPackageById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // ✅ Fetch all packages
      .addCase(fetchAllPackages.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllPackages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAllPackages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createPackageThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createPackageThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Assuming action.payload contains the newly created package
        state.items.push(action.payload);
      })
      .addCase(createPackageThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // ✅ Update a package
      .addCase(updatePackageThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updatePackageThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedPackage = action.payload;
        const packageIndex = state.items.findIndex(pkg => pkg.id === updatedPackage.id);

        if (packageIndex !== -1) {
          state.items[packageIndex] = updatedPackage;
        } else {
          state.items.push(updatedPackage);
        }
      })
      .addCase(updatePackageThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      //deletePackage
      .addCase('packages/deletePackage/pending', (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase('packages/deletePackage/fulfilled', (state, action) => {
        const packageId = action.payload;
        state.items = state.items.filter(pkg => pkg.id !== packageId);
        state.status = 'succeeded';
      
      })
      .addCase('packages/deletePackage/rejected', (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });


  },
});

export default packageSlicer.reducer;
