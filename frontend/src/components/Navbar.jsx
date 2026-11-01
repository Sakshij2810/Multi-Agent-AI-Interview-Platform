import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

const Navbar = ({ label, rightItems }) => {
  const navigate = useNavigate();
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-20 border-b border-black/8 bg-white/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-3 sm:px-5">
        <div
          onClick={() => navigate("/dashboard")}
          className="flex cursor-pointer items-center gap-1.5"
        >
          <span className="text-sm font-extrabold sm:text-base text-[#0A0A0A]">
            FresherAI
          </span>
          <span className="hidden rounded bg-black/5 px-1.5 py-0.5 text-[10px] text-black/50 sm:block">
            {label}
          </span>
        </div>

        {rightItems}
      </div>
    </motion.nav>
  );
};
export default Navbar;
