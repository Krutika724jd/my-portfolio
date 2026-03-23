export default function SectionLabel({ num, text }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-mono2 text-[11px] text-violet-500 tracking-[0.2em] uppercase font-bold">
        {num}
      </span>
      <div className="num-bar w-6 h-px" />
      <span className="text-[15px] text-gray-500 tracking-[0.2em] uppercase font-bold">
        {text}
      </span>
    </div>
  );
}