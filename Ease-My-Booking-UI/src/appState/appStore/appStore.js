import { configureStore } from "@reduxjs/toolkit";
import placesReducer from "../appSlicer/placesSlicer";
import userReducer from "../appSlicer/userSlcer";
import packageReducer from "../appSlicer/packageSlicer";
import slotPriceReducer from "../appSlicer/packageDetailsSlicer";
import transactionReducer from "../appSlicer/transactionSlicer";

const appStore = configureStore({
  reducer: {
    places: placesReducer,
    user: userReducer,
    packages: packageReducer,
    slotPrice: slotPriceReducer,
    transaction: transactionReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default appStore;
