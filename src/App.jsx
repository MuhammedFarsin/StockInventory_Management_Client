import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoadingPage from "./Common/LoadingPage";
import UserRoute from "./Router/UserRoute";
import AdminRoute from "./Router/AdminRoute";
function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/*" element={<UserRoute />} />
          <Route path="/admin/*" element={<AdminRoute />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
export default App;
