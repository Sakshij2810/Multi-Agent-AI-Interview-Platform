export const CustomTextArea = ({
  label,
  value,
  placeholder,
  onChange,
  rows = 3,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-black/70 uppercase tracking-wider">
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="bg-white border-2 border-black/25 text-[#0A0A0A] text-xs rounded-lg px-2.5 py-2 outline-none focus:border-black/60 transition-colors placeholder-black/30 resize-none shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      ></textarea>
    </div>
  );
};
