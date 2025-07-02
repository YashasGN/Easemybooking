import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import Login from './login'

// ✅ Adjust path to your actual user reducer
import userReducer from '../../appState/appSlicer/userSlcer'

// ✅ Shared helper function for mounting the component
const renderLogin = (preloadedState = {}) => {
  const store = configureStore({
    reducer: {
      user: userReducer
    },
    preloadedState
  })

  return cy.mount(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <Login />
      </MemoryRouter>
    </Provider>
  )
}

describe('<Login />', () => {
  it('renders login form', () => {
    renderLogin()
    cy.get('input#username').should('exist')
    cy.get('input#password').should('exist')
    cy.get('button[type="submit"]').contains('Login')
  })

  it('allows typing in input fields', () => {
    renderLogin()
    cy.get('#username').type('testuser').should('have.value', 'testuser')
    cy.get('#password').type('secret').should('have.value', 'secret')
  })

  it('shows modal if user is admin', () => {
    renderLogin({
      user: {
        isLoggedIn: true,
        role: ['Admin']
      }
    })

    cy.get('.popup-modal').should('exist')
    cy.contains('Select a destination')
  })

  it('shows alert on Google login click', () => {
    renderLogin()

    // ✅ Spy on window.alert
    const alertStub = cy.stub()
    cy.on('window:alert', alertStub)

    // ✅ Click the Google login button
    cy.contains('Login with Google').click().then(() => {
      // ✅ Assert that the alert was shown
      expect(alertStub).to.have.been.calledWith('Google login not implemented.')
    })
  })
})
