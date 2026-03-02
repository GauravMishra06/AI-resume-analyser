import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout";

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

        {/* Pages WITH Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/insights" element={<InsightsPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;