import { createSlice } from "@reduxjs/toolkit";
import { createTransactionThunk,getTransactionByUserIdThunk,getAllTransactionsThunk } from "../appThunk/transactionThunk"; // Adjust path if needed

const initialState = {
  
  loading: false,
  transaction: [],
  error: null,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    resetTransactionState: (state) => {
      state.loading = false;
      state.transaction = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTransactionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransactionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.transaction = action.payload;
        state.error = null;
      })
      .addCase(createTransactionThunk.rejected, (state, action) => {
        state.loading = false;
        state.transaction = null;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(getTransactionByUserIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionByUserIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload; // ✅ define payload
        state.transaction = Array.isArray(payload) ? payload : [payload]; // ✅ always an array
        state.error = null;
      })
      
      .addCase(getTransactionByUserIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.transaction = null;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(getAllTransactionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTransactionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.transaction = action.payload; // Assuming payload is an array of transactions
        state.error = null;
      })
      .addCase(getAllTransactionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.transaction = null;
        state.error = action.error.message || "Something went wrong";
      });
     
  },
});

export const { resetTransactionState } = transactionSlice.actions;
export default transactionSlice.reducer;
