import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import NotificationSystem from "./components/NotificationSystem";
import ProtectedRoute from "./components/ProtectedRoute";
import SEOHead from "./components/SEOHead";
import Footer from "./pages/Common/Footer";
import Header from "./pages/Common/Header";

// Lazy load components
const Home = lazy(() => import("./pages/Home/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Blogs = lazy(() => import("./pages/Blogs/Blogs.jsx"));
const BlogDetail = lazy(() => import("./pages/Blogs/BlogDetail.jsx"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Signin = lazy(() => import("./pages/Signin.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Chat = lazy(() => import("./pages/Chat.jsx"));
const Services = lazy(() => import("./pages/Services.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));

function App() {
  return (
    <HelmetProvider>
      <NotificationSystem>
        <SEOHead />
        <div>
          <Header />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/register" element={<Register />} />
              <Route path="/signin" element={<Signin />} />

              {/* Protected Routes - Role-based Access Control */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/checkout/:id"
                element={
                  <ProtectedRoute requiredRole="patient">
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute requiredRole="patient">
                    <div className="container my-5">
                      <h2>My Bookings</h2>
                      <p>Your booking history will appear here.</p>
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />

              {/* Admin/Doctor Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Admin />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/doctor-dashboard"
                element={
                  <ProtectedRoute requiredRole="doctor">
                    <div className="container my-5">
                      <h2>Doctor Dashboard</h2>
                      <p>Doctor-specific dashboard will appear here.</p>
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute requiredRoles={["admin", "doctor"]}>
                    <div className="container my-5">
                      <h2>Analytics Dashboard</h2>
                      <p>Analytics and reports will appear here.</p>
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </NotificationSystem>
    </HelmetProvider>
  );
}

export default App;
