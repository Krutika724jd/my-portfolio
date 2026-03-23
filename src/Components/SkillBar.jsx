import { useEffect, useRef, useState } from "react";

export default function SkillBar({ label, level, color, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setWidth(level), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [level, delay]);
  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-[13px] text-gray-300 font-medium">{label}</span>
        <span className="font-mono2 text-[11px]" style={{ color }}>
          {level}%
        </span>
      </div>
      <div className="h-1 bg-[#1e1b2e] rounded-full overflow-hidden">
        <div
          className="skill-fill h-full rounded-full"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 12px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}