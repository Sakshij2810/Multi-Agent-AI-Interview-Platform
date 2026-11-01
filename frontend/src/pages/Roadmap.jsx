import { IoRocket } from "react-icons/io5";
import Navbar from "../components/Navbar";

const Roadmap = () => {
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A]">
      <Navbar label="Roadmap Builder" />

      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        {/* Page heading */}
        <div className="mb-7 border-b border-gray-200 pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Agent
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Roadmap Builder
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Turn your career goals into a clear, step-by-step learning plan.
          </p>
        </div>

        {/* Coming soon hero */}
        <section className="relative overflow-hidden rounded-2xl bg-[#191919] p-6 text-white shadow-xl sm:p-10">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/[0.04] blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-white/[0.04] blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-xs font-medium text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Coming soon
            </span>

            <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl">
              <IoRocket />
            </div>

            <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
              Your next step, mapped out.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-300 sm:text-base">
              We’re building a personalized roadmap experience to help you
              identify skill gaps, focus on what matters, and track your
              progress toward your career goals.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Roadmap;
