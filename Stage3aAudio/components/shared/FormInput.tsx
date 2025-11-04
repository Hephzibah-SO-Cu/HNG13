// components/shared/FormInput.tsx
import { UseFormRegister, FieldError } from "react-hook-form";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  className?: string;
}

export default function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
  className = "",
}: FormInputProps) {
  
  // Conditionally apply error styles
  const errorBorder = error ? "border-red-500" : "border-gray-300";
  const errorLabel = error ? "text-red-500" : "text-black";

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex justify-between mb-2">
        <label htmlFor={name} className={`text-body font-bold ${errorLabel}`}>
          {label}
        </label>
        {error && (
          <span className="text-sm text-red-500">{error.message}</span>
        )}
      </div>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`w-full h-14 px-6 py-4 rounded-lg border ${errorBorder} focus:border-primary focus:outline-none font-bold`}
      />
    </div>
  );
}
