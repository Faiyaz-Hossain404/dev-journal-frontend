import React from "react";
import Button from "./Button";

type StatProps = {
  icon: React.ReactNode;
  label: string;
  value: number | undefined;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
};

export default function Stat({
  icon,
  label,
  value,
  className = "",
  onClick,
  disabled = false,
}: StatProps) {
  const content = (
    <>
      <span aria-hidden className="cursor-default">
        {icon}
      </span>
      <span>{value ?? 0}</span>
      {/* Tooltip */}
      <div
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2
                   rounded bg-zinc-900 border border-zinc-700 px-2 py-1 text-xs
                   text-[#A8B3CF] shadow-lg opacity-0 scale-95
                   group-hover:opacity-100 group-hover:scale-100 transition
                   whitespace-nowrap z-10"
        role="tooltip"
      >
        {label}
      </div>
      <span className="sr-only">{label}</span>
    </>
  );

  if (onClick) {
    return (
      <Button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClick(e);
        }}
        className={`relative group inline-flex items-center gap-1 text-white ${className}`}
      >
        {content}
      </Button>
    );
  }

  return (
    <div
      className={`relative group inline-flex items-center gap-1 text-white ${className}`}
    >
      {content}
    </div>
  );
}
