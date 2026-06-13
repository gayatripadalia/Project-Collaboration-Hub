import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./Layout";
import Dashboard from "./Dashboard";
import ProjectPage from "./ProjectPage";
import Notifications from "./Notifications";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";
import ExploreProjects from "./ExploreProjects";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {!token ? (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<ExploreProjects />} />
            <Route path="/project/:id" element={<ProjectPage />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;