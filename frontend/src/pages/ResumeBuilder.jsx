import { useState } from "react";
import { initialData } from "../components/resume/initialData.js";
import Navbar from "../components/Navbar.jsx";
import { FiArrowLeft, FiArrowRight, FiEye } from "react-icons/fi";
import ResumeForm from "../components/resume/ResumeForm.jsx";
import PreviewResume from "../components/resume/PreviewResume.jsx";

const STEPS = [
  {
    step: 1,
    title: "Personal Information",
    subtitle: "Your basic contact details",
  },
  {
    step: 2,
    title: "Professional Summary",
    subtitle: "A quick intro about yourself",
  },
  { step: 3, title: "Skills", subtitle: "Your technical skills" },
  {
    step: 4,
    title: "Work Experience",
    subtitle: "Your past jobs & internships",
  },
  { step: 5, title: "Projects", subtitle: "Projects you have built" },
  { step: 6, title: "Education", subtitle: "Your academic background" },
];

const TOTAL_STEPS = STEPS.length;

const ResumeBuilder = ({ user, setUser }) => {
  const [data, setData] = useState(initialData);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);

  const progressPct = (currentStep / TOTAL_STEPS) * 100;
  const activeStep = STEPS.find((s) => s.step === currentStep);
  const isLastStep = currentStep == STEPS.length;

  const handlePrevClick = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextClick = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  if (showPreview) {
    return (
      <PreviewResume
        data={data}
        user={user}
        setUser={setUser}
        onBack={() => setShowPreview(false)}
      />
    );
  }
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] flex flex-col">
      <Navbar
        label="Resume Builder"
        rightItems={
          <button
            onClick={() => setShowPreview(true)}
            className="flex h-8 items-center justify-center  rounded-lg border border-black/15 text-black/60 transition px-2 hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
          >
            <FiEye size={13} />
          </button>
        }
      />

      {/* main container */}
      <div className="flex-1 px-3 py-4 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-2xl">
          {/* form heading content */}
          <div className="mb-4">
            <div lassName="flex items-center justify-between mb-1.5">
              <p className="text-[10px] text-black/40 font-medium">
                STEP {currentStep} OF {TOTAL_STEPS}
              </p>
              <p className="hidden text-[10px] text-black/40 sm:block">
                {Math.round(progressPct)}% complete
              </p>
            </div>
            {/* progress bar */}
            <div className="w-full h-1 bg-black/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0A0A0A] rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="mt-3">
              <h2 className="text-xl font-bold sm:text-2xl">
                {activeStep.title}
              </h2>
              <p className="mt-1 text-xs text-black/45 sm:text-sm">
                {activeStep.subtitle}
              </p>
            </div>
          </div>

          {/* ResumeForm */}
          <div className="border-t border-black/8 mb-4" />
          <ResumeForm data={data} setData={setData} step={currentStep} />
          <div className="border-t border-black/8 mt-6 mb-4" />

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            {/* previous button */}
            <button
              onClick={handlePrevClick}
              disabled={currentStep === 1}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border transition-all
                ${
                  currentStep === 1
                    ? "border-black/8 text-black/25 cursor-not-allowed"
                    : "border-black/20 text-black/60 hover:border-black/40 hover:text-[#0A0A0A]"
                }`}
            >
              <FiArrowLeft size={15} />{" "}
              <span className="hidden sm:block">Previous</span>
            </button>

            <div className="flex items-center gap-1.5">
              {STEPS.map((s) => (
                <button
                  onClick={() => setCurrentStep(s.step)}
                  className={`rounded-full transition-all ${
                    s.step === currentStep
                      ? "w-4 h-1.5 bg-[#0A0A0A]"
                      : s.step < currentStep
                        ? "w-1.5 h-1.5 bg-black/35"
                        : "w-1.5 h-1.5 bg-black/12"
                  }`}
                />
              ))}
            </div>
            {/* Next / Preview button */}
            {isLastStep ? (
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#000000]/90 backdrop-blur-2xl border border-white/10 text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:border-white/20 transition-all"
              >
                <FiEye size={13} />
                <span className="hidden sm:block">Preview Resume</span>
              </button>
            ) : (
              <button
                disabled={currentStep === TOTAL_STEPS}
                onClick={handleNextClick}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#000000]/90 backdrop-blur-2xl border border-white/10 text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:border-white/20 transition-all"
              >
                <span className="hidden sm:block">Next</span>
                <FiArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
