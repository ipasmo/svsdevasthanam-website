import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  titleClassName?: string;
  light?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  align = "center",
  titleClassName,
  light = false,
  className,
  ...props
}: SectionHeaderProps) {
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div className={cn("flex flex-col gap-2", alignClass[align], className)} {...props}>
      <h2
        className={cn(
          "text-3xl md:text-4xl font-cinzel font-bold",
          light ? "text-white" : "text-rust",
          titleClassName
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-base", light ? "text-white/70" : "text-gray-500", "font-noto")}>
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          "h-1 rounded-full w-20",
          "bg-golden",
          align === "center" && "mx-auto",
          align === "right" && "ml-auto"
        )}
      />
    </div>
  );
}
