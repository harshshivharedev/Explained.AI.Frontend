import { Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx"
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import StartSession from "./pages/StartSession.jsx";
import ChatSession from "./pages/ChatSession.jsx";
import SessionComplete from "./pages/SessionComplete.jsx";
import Report from "./pages/Report.jsx";
import History from "./pages/History.jsx";
import ProtectedRoute from "./components/ui/ProtectedRoute.jsx";
import "./App.css";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/start-session" element={<StartSession />} />
          <Route path="/session/:sessionId" element={<ChatSession />} />
          <Route path="/session/:sessionId/complete" element={<SessionComplete />} />
          <Route path="/session/:sessionId/report" element={<Report />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
