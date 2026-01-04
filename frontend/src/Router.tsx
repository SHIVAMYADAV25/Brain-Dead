import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PagesList from "./pages/PagesList";
import CreatePage from "./pages/CreatePage";
import EditPage from "./pages/EditPage";
import AddContent from "./pages/AddContent";
import ContentList from "./pages/ContentList";
import ChatContextSelect from "./pages/ChatContextSelect";
import ChatPage from "./pages/ChatPage";
import ProjectsList from "./pages/ProjectsList";
import CreateProject from "./pages/CreateProject";

function Router() {
  return (
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login" element={<LoginPage />} />
    //working
    <Route
      path="/dashboard"
      element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
    />
  //working
    <Route
      path="/pages"
      element={<ProtectedRoute><PagesList /></ProtectedRoute>}
    />
    // working
    <Route
      path="/pages/new"
      element={<ProtectedRoute><CreatePage /></ProtectedRoute>}
    />
    // working
    <Route
      path="/pages/:id/edit"
      element={<ProtectedRoute><EditPage /></ProtectedRoute>}
    />

    /content
    <Route
      path="/content"
      element={<ProtectedRoute><ContentList /></ProtectedRoute>}
    />
    <Route
      path="/content/new"
      element={<ProtectedRoute><AddContent /></ProtectedRoute>}
    />

    <Route
      path="/projects"
      element={<ProtectedRoute><ProjectsList /></ProtectedRoute>}
    />
    <Route
      path="/projects/new"
      element={<ProtectedRoute><CreateProject /></ProtectedRoute>}
    />

    <Route
      path="/chat/select"
      element={<ProtectedRoute><ChatContextSelect /></ProtectedRoute>}
    />
    <Route
      path="/chat"
      element={<ProtectedRoute><ChatPage /></ProtectedRoute>}
    />

    <Route path="*" element={<h2>404 – Page Not Found</h2>} />
  </Routes>
</BrowserRouter>

  );
}

export default Router;
