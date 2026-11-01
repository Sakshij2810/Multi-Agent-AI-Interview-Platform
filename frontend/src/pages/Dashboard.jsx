import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar.jsx";
import { server_base_endpoints } from "../utils/server-base-endpoints.js";
import api from "../utils/axios.js";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FiSidebar } from "react-icons/fi";
import { REACT_APP_NAV_ROUTES } from "../Router/AppNavigation.js";
import { getAllInterviews } from "../apis/interview.api.js";
import Statbox from "../components/dashboard/Statbox.jsx";
import InterviewGraph from "../components/dashboard/InterviewGraph.jsx";

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // interviews states
  const [stats, setStats] = useState({
    totalInterviews: 0,
    totalQuestions: 0,
    completed: 0,
    averageScore: 0,
  });
  const [technicalData, setTechnicalData] = useState([]);
  const [hrData, setHrData] = useState([]);
  const [technicalCount, setTechnicalCount] = useState(0);
  const [hrCount, setHrCount] = useState(0);

  // fetch all interviews data
  useEffect(() => {
    const fetchAllInterviews = async () => {
      const data = await getAllInterviews();

      setStats(data.stats);
      setTechnicalData(data.technicalData);
      setHrData(data.hrData);
      setTechnicalCount(data.technicalCount);
      setHrCount(data.hrCount);
    };

    fetchAllInterviews();
  }, []);
  // handle Logout
  const handleLogout = async () => {
    try {
      const res = await api.get(server_base_endpoints.auth.logout);

      if (res?.data?.success) {
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#0A0A0A] font-sans flex">
      <Sidebar
        user={user}
        onNewInterview={() => navigate(REACT_APP_NAV_ROUTES.interview)}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <motion.main
        className={`flex-1 min-h-screen px-3 sm:px-4 md:px-6 py-4 md:py-6 transition-all duration-300 ${
          sidebarOpen ? "md:ml-[260px]" : "md:ml-[72px]"
        }`}
      >
        {/* top Area */}
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <div className="flex items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-black/40 hover:text-[#0A0A0A] transition-colors"
            >
              <FiSidebar size={17} />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-black/40 text-[11px] md:text-xs font-medium mb-0.5">
                Overview
              </p>
              <h2 className="text-lg md:text-xl font-bold text-[#0A0A0A]">
                Hello, {user?.name?.split(" ")[0]} 👋{" "}
              </h2>
            </motion.div>
          </div>
        </div>

        <div className="h-px bg-black/8 mb-5 md:mb-6" />

        {/* Statbox */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 md:gap-3">
          <Statbox
            label="Total Interviews"
            value={stats?.totalInterviews}
            subHighlight="All Time"
            sub="Interviews Created"
            index={0}
          />
          <Statbox
            label="Questions Solved"
            value={stats?.totalQuestions}
            subHighlight="Answered"
            sub="Across All Interviews"
            index={1}
          />

          <Statbox
            label="Completed"
            value={stats?.completed}
            subHighlight={`${stats?.totalInterviews || 0} Total`}
            sub="Interviews Finished"
            index={2}
          />

          <Statbox
            label="Average Score"
            value={`${Math.round(stats?.averageScore || 0)}/100`}
            subHighlight="Completed Only"
            sub="Average Performance"
            index={3}
          />
        </div>

        {/* Performance , Graphs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-3 md:mb-4"
        >
          <p className="text-black/40 text-[10px] font-semibold uppercase tracking-widest mt-2.5 mb-1">
            Performance
          </p>

          <h3 className="text-[#0A0A0A] font-bold text-sm md:text-base mb-3 md:mb-4">
            Interview History
          </h3>
        </motion.div>

        <InterviewGraph
          technicalData={technicalData}
          technicalCount={technicalCount}
          hrData={hrData}
          hrCount={hrCount}
        />
      </motion.main>
    </div>
  );
};

export default Dashboard;
