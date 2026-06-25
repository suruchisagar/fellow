import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import Feed from "./components/feed";
import Requests from "./components/Requests";
import Profile from "./components/Profile";
import Premium from "./components/Premium";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import ChatLayout from "./components/ChatLayout";
import Landing from "./components/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/connections" element={<ProtectedRoute><ChatLayout /></ProtectedRoute>} />
        <Route path="/chat/:userId" element={<ProtectedRoute><ChatLayout /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;