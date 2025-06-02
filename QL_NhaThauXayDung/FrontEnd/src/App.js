import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { AuthProvider } from './Config/AuthContext';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          {/* Your app components */}
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App; 