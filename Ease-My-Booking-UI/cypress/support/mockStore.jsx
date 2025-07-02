// cypress/support/withMockStore.js
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit'; // ✅ FIXED: Add this import
import packagesReducer from '../../src/appState/appSlicer/packageSlicer';
import placesReducer from '../../src/appState/appSlicer/placesSlicer';
import userReducer from '../../src/appState/appSlicer/userSlcer';
import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';

export const withMockStore = (component, preloadedState = {}) => {
  const mockSlotPriceReducer = () => ({
    slotsByPackageId: {},
    pricesByPackageId: {},
  });

  const store = configureStore({
    reducer: {
      packages: packagesReducer,
      slotPrice: mockSlotPriceReducer,
      places: placesReducer,
      user: userReducer, // ✅ Make sure this exists
    },
    preloadedState,
  });

  return mount(
    <Provider store={store}>
      <MemoryRouter>
        {component}
      </MemoryRouter>
    </Provider>
  );
};
