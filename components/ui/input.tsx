import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const fieldClasses =
  "w-full rounded-control border border-border bg-surface text-body text-foreground " +
  "placeholder:text-muted-foreground transition-colors duration-150 " +
  "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring " +
  "disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-50";

export function Input({
  className,
  type = "text",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(fieldClasses, "h-10 px-3", className)}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldClasses, "min-h-24 px-3 py-2", className)}
      {...props}
    />
  );
}
