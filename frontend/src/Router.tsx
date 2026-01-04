import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PagesList from "./pages/PagesList";
import CreatePage from "./pages/CreatePage";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route 
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }
        />
        <Route 
        path="/pages"
        element={
          <ProtectedRoute>
            <PagesList/>
          </ProtectedRoute>
        }
        />
        <Route 
        path="/page/add"
        element={
          <ProtectedRoute>
            <CreatePage/>
          </ProtectedRoute>
        }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
