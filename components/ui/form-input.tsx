import type React from "react"
import { cn } from "@/lib/utils"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function FormInput({ label, error, className, required, ...props }: FormInputProps) {
  return (
    <div>
      <label htmlFor={props.name} className="block text-sm font-medium mb-1">
        {label} {required && "*"}
      </label>
      <input
        id={props.name}
        className={cn(
          "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50",
          error ? "border-red-500 focus:ring-red-500/50" : "border-border",
          className,
        )}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
