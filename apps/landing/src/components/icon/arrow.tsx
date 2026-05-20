import { cn } from "@/lib/utils";

export const Arrow = ({ side, size = 6, className }: { side: "left" | "right"; size: number; className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      style={{ transformOrigin: "40% 50%", width: `${size*4}px`, height: `${size*4}px` }} 
      className={cn(
        "hover:animate-[arrow-rotate_2s_ease-in-out,arrow-grow_2s_ease-in-out,arrow-translate_2s_ease-in-out]",
        "group-hover:animate-[arrow-rotate_2s_ease-in-out,arrow-grow_2s_ease-in-out,arrow-translate_2s_ease-in-out]",
        className)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={
          side === "left"
            ? "M15.75 19.5L8.25 12l7.5-7.5"
            : "M8.25 4.5L15.75 12l-7.5 7.5"
        }
      />
    </svg>
  );
};
