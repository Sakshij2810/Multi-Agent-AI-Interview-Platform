import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Step3report from "../../components/interview/Step3report";
import { getInterview } from "../../apis/interview.api";

const InterviewReport = ({ user, setUser }) => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      const res = await getInterview(id);
      const data = res?.interview;

      if (data.status !== "completed") {
        navigate(`/interview/${id}`, { replace: true });
        setLoading(false);
        return;
      }

      setReport(data);
      setLoading(false);
    };

    fetchReport();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07000F] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }
  if (!report) return null;
  return <Step3report user={user} setUser={setUser} report={report} />;
};

export default InterviewReport;
