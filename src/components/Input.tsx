import { type InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = "", error = false, ...props }, ref) => {
  const baseClasses =
    "w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
  const errorClasses = error
    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"

  return <input ref={ref} className={`${baseClasses} ${errorClasses} ${className}`} {...props} />
})

Input.displayName = "Input"
