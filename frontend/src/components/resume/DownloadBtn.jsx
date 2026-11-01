import { FiDownload } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
import { deductCoins } from "../../apis/user.api";

const DownloadBtn = ({ docRef, user, setUser }) => {
  const handlePdf = useReactToPrint({
    contentRef: docRef,
    documentTitle: "FresherAIPDF",
  });

  const handleDownload = async () => {
    try {
      const coinResponse = await deductCoins({
        coins: 10,
        action: "download-pdf",
      });

      setUser((prev) => ({
        ...prev,
        interviewCoin: coinResponse?.interviewCoin,
      }));

      handlePdf();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-xs text-white"
    >
      <FiDownload />
      Download PDF
    </button>
  );
};

export default DownloadBtn;
