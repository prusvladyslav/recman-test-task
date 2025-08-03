import { type InputHTMLAttributes, forwardRef } from "react"

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ className = "", label, id, ...props }, ref) => {
  return (
    <div className="flex items-center">
      <input
        ref={ref}
        type="checkbox"
        id={id}
        className={`h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors ${className}`}
        {...props}
      />
      {label && (
        <label htmlFor={id} className="ml-2 text-sm text-gray-700 cursor-pointer select-none">
          {label}
        </label>
      )}
    </div>
  )
})

Checkbox.displayName = "Checkbox"
