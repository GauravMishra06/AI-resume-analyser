import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import InsightsPage from "./pages/InsightsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth Pages (NO Layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

         {/* Public Landing Page WITH Layout */}
        <Route element={<Layout />}>
         <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Protected Pages WITH Layout */}
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/upload" element={<HomePage />} />
            <Route path="/insights" element={<InsightsPage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;