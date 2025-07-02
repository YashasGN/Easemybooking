// src/appSlicer/slotPriceSlicer.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSlotByPackageId,
  fetchPriceByPackageId,
  addPriceThunk,
  addSlotThunk,
  updateSlotThunk,
  updatePriceThunk,
  deletePriceByPackageIdThunk,
  deletePriceByslotIdThunk,
  deleteSlotByPackageIdThunk,
  deleteSlotById,
  fetchPriceBySlotId,
} from "../appThunk/packageDetailsThunk";

const slotPriceSlicer = createSlice({
  name: "slotPrice",
  initialState: {
    slots: [],
    price: null,
    slotsByPackageId: {},
    pricesByPackageId: {},
    pricesBySlotId: {},
    status: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch slots by package
      .addCase(fetchSlotByPackageId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSlotByPackageId.fulfilled, (state, action) => {
        const slotList = action.payload;
        const packageId = slotList[0]?.packageId;

        state.slots = slotList;
        if (packageId) {
          state.slotsByPackageId[packageId] = slotList;
        }
        state.status = "succeeded";
      })
      .addCase(fetchSlotByPackageId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch price by package
      .addCase(fetchPriceByPackageId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPriceByPackageId.fulfilled, (state, action) => {
        const price = action.payload;
        state.price = price;
        if (price?.packageId) {
          state.pricesByPackageId[price.packageId] = price;
        }
        state.status = "succeeded";
      })
      .addCase(fetchPriceByPackageId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add price
      .addCase(addPriceThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addPriceThunk.fulfilled, (state, action) => {
        const newPrice = action.payload;
        state.price = newPrice;
        if (newPrice?.packageId) {
          state.pricesByPackageId[newPrice.packageId] = newPrice;
        }
        state.status = "succeeded";
      })
      .addCase(addPriceThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add slot
      .addCase(addSlotThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addSlotThunk.fulfilled, (state, action) => {
        const newSlot = action.payload;
        state.slots.push(newSlot);
        if (newSlot?.packageId) {
          if (!state.slotsByPackageId[newSlot.packageId]) {
            state.slotsByPackageId[newSlot.packageId] = [];
          }
          state.slotsByPackageId[newSlot.packageId].push(newSlot);
        }
        state.status = "succeeded";
      })
      .addCase(addSlotThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update slot
      .addCase(updateSlotThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateSlotThunk.fulfilled, (state, action) => {
        const updatedSlot = action.payload;
        state.slots = state.slots.map(slot =>
          slot.slotId === updatedSlot.slotId ? updatedSlot : slot
        );
        if (updatedSlot?.packageId) {
          if (!state.slotsByPackageId[updatedSlot.packageId]) {
            state.slotsByPackageId[updatedSlot.packageId] = [];
          }
          state.slotsByPackageId[updatedSlot.packageId] = state.slotsByPackageId[updatedSlot.packageId].map(slot =>
            slot.slotId === updatedSlot.slotId ? updatedSlot : slot
          );
        }
        state.status = "succeeded";
      })
      .addCase(updateSlotThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update price
      .addCase(updatePriceThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePriceThunk.fulfilled, (state, action) => {
        const updatedPrice = action.payload;
        state.price = updatedPrice;
        if (updatedPrice?.packageId) {
          state.pricesByPackageId[updatedPrice.packageId] = updatedPrice;
        }
        state.status = "succeeded";
      })
      .addCase(updatePriceThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete price by package
      .addCase(deletePriceByPackageIdThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deletePriceByPackageIdThunk.fulfilled, (state, action) => {
        const packageId = action.payload;
        delete state.pricesByPackageId[packageId];
        state.price = null;
        state.status = "succeeded";
      })
      .addCase(deletePriceByPackageIdThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Fixed: Delete price by slot ID
      .addCase(deletePriceByslotIdThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deletePriceByslotIdThunk.fulfilled, (state, action) => {
        const slotId = action.payload;
        delete state.pricesBySlotId[slotId];
        state.price = null;
        state.status = "succeeded";
      })
      .addCase(deletePriceByslotIdThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete slot by package
      .addCase(deleteSlotByPackageIdThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteSlotByPackageIdThunk.fulfilled, (state, action) => {
        const packageId = action.payload;
        delete state.slotsByPackageId[packageId];
        state.slots = state.slots.filter(slot => slot.packageId !== packageId);
        state.status = "succeeded";
      })
      .addCase(deleteSlotByPackageIdThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Enhanced: Delete slot by ID
      .addCase(deleteSlotById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteSlotById.fulfilled, (state, action) => {
        const slotId = action.payload;

        // Remove from flat list
        state.slots = state.slots.filter(slot => slot.slotId !== slotId && slot.id !== slotId);

        // Remove from slotsByPackageId
        for (const pkgId in state.slotsByPackageId) {
          state.slotsByPackageId[pkgId] = state.slotsByPackageId[pkgId].filter(
            slot => slot.slotId !== slotId && slot.id !== slotId
          );
        }

        // Also clean price
        delete state.pricesBySlotId[slotId];

        state.status = "succeeded";
      })
      .addCase(deleteSlotById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Correct: Fetch price by slot ID
      .addCase(fetchPriceBySlotId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPriceBySlotId.fulfilled, (state, action) => {
        const priceArray = action.payload;
  if (Array.isArray(priceArray) && priceArray.length > 0) {
    const slotId = priceArray[0].slotId;
    state.pricesBySlotId[slotId] = priceArray;
  }
  state.status = "succeeded";
      })
      .addCase(fetchPriceBySlotId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default slotPriceSlicer.reducer;
