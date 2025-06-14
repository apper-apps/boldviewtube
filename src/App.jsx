import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { routes, routeArray } from '@/config/routes';
import Layout from '@/Layout';
import { useTheme } from '@/contexts/ThemeContext';

const AppContent = () => {
  const { resolvedTheme } = useTheme();
  
  return (
    <BrowserRouter>
      <div className="h-screen overflow-hidden">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/home" replace />} />
            {routeArray.map(route => (
              <Route
                key={route.id}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
theme={resolvedTheme}
          className="z-[9999]"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
};

function App() {
  return (
    <AppContent />
  );
}

export default App;