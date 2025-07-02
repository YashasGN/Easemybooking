import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import AppRouter from './myroute'; // Make sure this file exports a valid router object
import { Provider } from 'react-redux'; // ✅ FIXED import
import appStore from './appState/appStore/appStore';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Provider store={appStore}>
      <RouterProvider router={AppRouter} />
    </Provider>
  );
}

export default App;
