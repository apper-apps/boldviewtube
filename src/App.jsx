import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/Layout'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastContainer } from 'react-toastify'
import { routeArray } from '@/routes'
import { useTheme } from '@/contexts/ThemeContext'
import 'react-toastify/dist/ReactToastify.css'
import '@/index.css'

function AppContent() {
  const { resolvedTheme } = useTheme()
  
  return (
    <Router>
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
    </Router>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App