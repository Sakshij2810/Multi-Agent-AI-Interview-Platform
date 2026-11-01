import { FiPlus, FiTrash2 } from "react-icons/fi";
import { CustomInputField } from "../formComponents/CustomInputField";
import { CustomTextArea } from "../formComponents/CustomTextArea";

function EntryCard({ children, onRemove }) {
  return (
    <div className="relative overflow-hidden bg-[#F8F9FA] border-2 border-black/15 rounded-xl p-3 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <button
        className="absolute top-2.5 right-2.5 z-10 text-black/35 hover:text-red-500 transition-colors"
        onClick={onRemove}
      >
        <FiTrash2 size={13} />
      </button>
      <div className="relative flex flex-col gap-2.5 pr-6">{children}</div>
    </div>
  );
}
const ResumeForm = ({ data, setData, step }) => {
  // Step 1 - Personal Info
  if (step === 1)
    return (
      <div className="flex flex-col gap-3">
        <CustomInputField
          label="Full Name"
          placeholder="Rahul Sharma"
          value={data.name}
          onChange={(v) => setData({ ...data, name: v })}
        />
        <CustomInputField
          label="Email"
          placeholder="rahul@email.com"
          type="email"
          value={data.email}
          onChange={(v) => setData({ ...data, email: v })}
        />
        <CustomInputField
          label="Phone"
          placeholder="+91 9876543210"
          type="tel"
          value={data.phone}
          onChange={(v) => setData({ ...data, phone: v })}
        />

        <CustomInputField
          label="LinkedIn URL"
          placeholder="linkedin.com/in/rahul"
          type="url"
          onChange={(v) => setData({ ...data, linkedin: v })}
          value={data.linkedin}
        />

        <CustomInputField
          label="GitHub URL"
          placeholder="github.com/rahul"
          type="url"
          value={data.github}
          onChange={(v) => setData({ ...data, github: v })}
        />
      </div>
    );

  // Step 2 - Summary
  if (step === 2) {
    return (
      <div className="flex flex-col gap-3">
        <CustomTextArea
          label="Professional Summary"
          placeholder="Backend Developer with 2+ years of experience building scalable Node.js and MongoDB applications..."
          rows={5}
          onChange={(v) => setData({ ...data, summary: v })}
          value={data.summary}
        />
        <p className="text-[10px] text-black/40">
          Leave empty to skip this section.
        </p>
      </div>
    );
  }

  // Step 3 - Skills (comma separated string)
  if (step === 3) {
    return (
      <div className="flex flex-col gap-3">
        <CustomTextArea
          label="Skills (comma separated)"
          placeholder="JavaScript, TypeScript, React, Node.js, Express, MongoDB, Redis, Docker, AWS, Git"
          rows={4}
          onChange={(v) => setData({ ...data, skills: v })}
          value={data.skills}
        />

        <p className="text-[10px] text-black/40">
          Separate each skill with a comma.
        </p>
      </div>
    );
  }

  // Step 4 - Experience (array of objects)
  if (step === 4) {
    const handleAddExp = () => {
      setData({
        ...data,
        experience: [
          ...data.experience,
          { company: "", role: "", duration: "", description: "" },
        ],
      });
    };
    const handleRemoveExp = (index) => {
      setData({
        ...data,
        experience: data.experience.filter((_, i) => i != index),
      });
    };

    const handleUpdateExp = (index, filed, value) => {
      const updated = data.experience.map((exp, i) =>
        i === index ? { ...exp, [filed]: value } : exp,
      );

      setData({ ...data, experience: updated });
    };

    return (
      <div className="flex flex-col gap-3">
        {data.experience.length === 0 && (
          <p className="text-xs text-black/40 text-center py-3">
            No experience added yet. Click below to add.
          </p>
        )}

        {data.experience.map((exp, i) => (
          <EntryCard key={i} onRemove={() => handleRemoveExp(i)}>
            <CustomInputField
              label="Company"
              placeholder="ABC Technologies"
              onChange={(v) => handleUpdateExp(i, "company", v)}
              value={exp.company}
            />

            <CustomInputField
              label="Role"
              placeholder="Backend Developer"
              onChange={(v) => handleUpdateExp(i, "role", v)}
              value={exp.role}
            />

            <CustomInputField
              label="Duration"
              placeholder="Jan 2023 – Dec 2024"
              onChange={(v) => handleUpdateExp(i, "duration", v)}
              value={exp.duration}
            />

            <CustomTextArea
              label="Description"
              placeholder={"• Built REST APIs\n• Improved performance by 40%"}
              onChange={(v) => handleUpdateExp(i, "description", v)}
              value={exp.description}
            />
          </EntryCard>
        ))}

        <button
          onClick={handleAddExp}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-dashed border-black/20 rounded-xl text-xs text-black/45 hover:border-black/40 hover:text-[#0A0A0A] transition-all"
        >
          <FiPlus size={13} />
          Add Experience
        </button>
      </div>
    );
  }

  // Step 5 - Projects (array of objects)
  if (step === 5) {
    const handleAddPro = () => {
      setData({
        ...data,
        projects: [
          ...data.projects,
          { name: "", techStack: "", github: "", description: "" },
        ],
      });
    };
    const handleRemovePro = (index) => {
      console.log("hit remove");
      setData({
        ...data,
        projects: data.projects.filter((_, i) => i !== index),
      });
    };
    const handleUpdatePro = (index, field, value) => {
      const updated = data.projects.map((pro, i) =>
        i === index ? { ...pro, [field]: value } : pro,
      );

      setData({ ...data, projects: updated });
    };

    return (
      <div className="flex flex-col gap-3">
        {data.projects.length === 0 && (
          <p className="text-xs text-black/40 text-center py-3">
            No project added yet. Click below to add.
          </p>
        )}

        {data.projects.map((pro, i) => (
          <EntryCard key={i} onRemove={() => handleRemovePro(i)}>
            <CustomInputField
              label="Project Name"
              placeholder="InterviewIQ"
              onChange={(v) => handleUpdatePro(i, "name", v)}
              value={pro.name}
            />

            <CustomInputField
              label="Tech Stack"
              value={pro.techStack}
              onChange={(v) => handleUpdatePro(i, "techStack", v)}
              placeholder="React, Node.js, MongoDB"
            />

            <CustomInputField
              label="GitHub Link"
              value={pro.github}
              onChange={(v) => handleUpdatePro(i, "github", v)}
              placeholder="github.com/rahul/interviewiq"
            />

            <CustomTextArea
              label="Description"
              value={pro.description}
              onChange={(v) => handleUpdatePro(i, "description", v)}
              placeholder="AI-powered interview preparation platform with mock interviews and resume builder."
            />
          </EntryCard>
        ))}

        <button
          onClick={handleAddPro}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-dashed border-black/20 rounded-xl text-xs text-black/45 hover:border-black/40 hover:text-[#0A0A0A] transition-all"
        >
          <FiPlus size={13} />
          Add Project
        </button>
      </div>
    );
  }

  // Step 6 - Education (array of objects)
  if (step === 6) {
    const handleAddEdu = () => {
      setData({
        ...data,
        education: [
          ...data.education,
          { college: "", degree: "", branch: "", cgpa: "", year: "" },
        ],
      });
    };
    const handleRemoveEdu = (index) => {
      console.log("hit remove");
      setData({
        ...data,
        education: data.education.filter((_, i) => i !== index),
      });
    };
    const handleUpdateEdu = (index, field, value) => {
      const updated = data.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu,
      );

      setData({ ...data, education: updated });
    };

    return (
      <div className="flex flex-col gap-3">
        {data.education.length === 0 && (
          <p className="text-xs text-black/40 text-center py-3">
            No Education added yet. Click below to add.
          </p>
        )}

        {data.education.map((edu, i) => (
          <EntryCard key={i} onRemove={() => handleRemoveEdu(i)}>
            <CustomInputField
              label="College / University"
              value={edu.college}
              onChange={(v) => handleUpdateEdu(i, "college", v)}
              placeholder="SR Group of Institutions"
            />

            <CustomInputField
              label="Degree"
              value={edu.degree}
              onChange={(v) => handleUpdateEdu(i, "degree", v)}
              placeholder="B.Tech"
            />

            <CustomInputField
              label="Branch"
              value={edu.branch}
              onChange={(v) => handleUpdateEdu(i, "branch", v)}
              placeholder="Computer Science"
            />

            <CustomInputField
              label="CGPA"
              value={edu.cgpa}
              onChange={(v) => handleUpdateEdu(i, "cgpa", v)}
              placeholder="8.5"
            />

            <CustomInputField
              label="Year"
              value={edu.year}
              onChange={(v) => handleUpdateEdu(i, "year", v)}
              placeholder="2021 – 2025"
            />
          </EntryCard>
        ))}

        <button
          onClick={handleAddEdu}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-dashed border-black/20 rounded-xl text-xs text-black/45 hover:border-black/40 hover:text-[#0A0A0A] transition-all"
        >
          <FiPlus size={13} />
          Add Education
        </button>
      </div>
    );
  }
};

export default ResumeForm;
