import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Features from "./components/features";
import Dashboard from "./pages/Dashboard";
import SubjectDetail from "./pages/SubjectDetail";
import SignUp from "./pages/sign-up";
import SignIn from "./pages/sign-in";
import Forum from "./components/Forum.jsx";
import Layout from "./components/layout";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subject/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <SubjectDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum"
          element={
            <ProtectedRoute>
              <Layout>
                <Forum />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route
          path="/"
          element={
            <div className="w-full h-screen">
              <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[610px] w-[20px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
              </div>
              <Navbar />
              <Hero
                title={"Your All-in-One Study Platform"}
                description={
                  "EduHub combines smart notes, interactive quizzes, video learning, and a community forum to make your study experience more effective and engaging. Join our learning community today!"
                }
              />
              <Features />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
