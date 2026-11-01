import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { useState } from "react";
import { useEffect } from "react";
import { getCurrentUser } from "./apis/user.api.js";
import Scorer from "./pages/Scorer.jsx";
import { getResume } from "./apis/resume.api.js";
import { useDispatch } from "react-redux";
import { setResume } from "./redux/resumeSlice.js";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";
import InterviewStart from "./pages/Interview/InterviewStart.jsx";
import InterviewPage from "./pages/Interview/InterviewPage.jsx";
import InterviewReport from "./pages/Interview/InterviewReport.jsx";
import Roadmap from "./pages/Roadmap.jsx";
import Billing from "./pages/Billing.jsx";

const App = () => {
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*Easy rule for revision

Only used by useEffect → define inside useEffect.
Used by multiple places → define outside useEffect.

And importantly, don't do this:

useEffect(async () => {
   // ❌
}, []);

because the function passed to useEffect itself should not be async.*/

  useEffect(() => {
    const getUser = async () => {
      const data = await getCurrentUser();

      setUser(data?.user);
      setLoading(false);
    };

    getUser();
  }, []);

  useEffect(() => {
    const getResumeData = async () => {
      const result = await getResume();
      dispatch(setResume(result));
    };

    getResumeData();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full z-[9999]">
        <div className="h-1 bg-black animate-pulse w-full" />
      </div>
    );
  }
  return (
    <>
      <Routes>
        // ------------------- Home -------------------
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Home setUser={setUser} />
            )
          }
        />
        // ------------------- Dashboard -------------------
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        // ------------------- Scorer -------------------
        <Route
          path="/scorer"
          element={
            user ? (
              <Scorer user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        // ------------------- ResumeBuilder -------------------
        <Route
          path="/resume"
          element={
            user ? (
              <ResumeBuilder user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        // ------------------- Interview Routes -------------------
        <Route
          path="/interview"
          element={
            user ? (
              <InterviewStart user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/interview/:id"
          element={
            user ? (
              <InterviewPage user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/interview/:id/report"
          element={
            user ? (
              <InterviewReport user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        // ------------------- Roadmap -------------------
        <Route
          path="/roadmap"
          element={
            user ? (
              <Roadmap user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        // ------------------- Billing -------------------
        <Route
          path="/billing"
          element={
            user ? (
              <Billing user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;
