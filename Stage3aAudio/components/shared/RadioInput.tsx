// components/shared/RadioInput.tsx
import { UseFormRegister } from "react-hook-form";

interface RadioInputProps {
  label: string;
  name: string;
  value: string;
  register: UseFormRegister<any>;
  checked: boolean;
}

export default function RadioInput({
  label,
  name,
  value,
  register,
  checked,
}: RadioInputProps) {
  
  const borderStyle = checked ? "border-primary" : "border-gray-300";

  return (
    <label
      className={`flex items-center w-full h-14 px-6 py-4 rounded-lg border ${borderStyle} cursor-pointer hover:border-primary`}
    >
      <input
        type="radio"
        value={value}
        {...register(name)}
        className="mr-4 accent-primary"
      />
      <span className="text-body font-bold">{label}</span>
    </label>
  );
}
