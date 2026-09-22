import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TemplatesProvider } from "./context/TemplatesContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { TemplateWizard } from "./pages/TemplateWizard";
import { TemplateUse } from "./pages/TemplateUse";

function App() {
  return (
    <AuthProvider>
      <TemplatesProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/templates/new"
              element={
                <ProtectedRoute>
                  <TemplateWizard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/templates/:id/edit"
              element={
                <ProtectedRoute>
                  <TemplateWizard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/templates/:id"
              element={
                <ProtectedRoute>
                  <TemplateUse />
                </ProtectedRoute>
              }
            />
          </Routes>
        </HashRouter>
      </TemplatesProvider>
    </AuthProvider>
  );
}

export default App;
