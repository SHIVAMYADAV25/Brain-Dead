import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PagesList from "./pages/PagesList";
import CreatePage from "./pages/CreatePage";
import EditPage from "./pages/EditPage";
import AddContent from "./pages/AddContent";
import ContentList from "./pages/ContentList";

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

        <Route 
        path="/page/:id/edit"
        element={
          <ProtectedRoute>
            <EditPage/>
          </ProtectedRoute>
        }
        />

        <Route 
        path="/content/add"
        element={
          <ProtectedRoute>
            <AddContent/>
          </ProtectedRoute>
        }
        />

        <Route 
        path="/contents"
        element={
          <ProtectedRoute>
            <ContentList/>
          </ProtectedRoute>
        }
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
