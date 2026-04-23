import React from "react";

const COUNTRIES = [
  { name: "Costa Rica", code: "+506", flag: "🇨🇷" },
  { name: "Estados Unidos", code: "+1", flag: "🇺🇸" },
  { name: "Nicaragua", code: "+505", flag: "🇳🇮" },
  { name: "Panamá", code: "+507", flag: "🇵🇦" },
  { name: "España", code: "+34", flag: "🇪🇸" },
  { name: "México", code: "+52", flag: "🇲🇽" },
  { name: "Colombia", code: "+57", flag: "🇨🇴" },
];

interface CountryCodeSelectProps {
  value: string;
  onChange: (code: string) => void;
}

export function CountryCodeSelect({ value, onChange }: CountryCodeSelectProps) {
  return (
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#C89F6A] transition-colors cursor-pointer pl-12"
      >
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code} className="bg-[#090B10] text-white">
             {c.flag} {c.name} ({c.code})
          </option>
        ))}
      </select>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-xl">
        {COUNTRIES.find(c => c.code === value)?.flag}
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}
