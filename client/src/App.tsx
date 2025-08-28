import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Todos from './pages/Todos';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/todos" replace />
            ) : (
              <>
                <Login />
              </>
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/todos" replace />
            ) : (
              <>
                <Register />
              </>
            )
          }
        />
        <Route
          path="/todos"
          element={
            isAuthenticated ? (
              <>
                <Todos />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/todos" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;