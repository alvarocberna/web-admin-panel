//react
import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface InputFileProps<T extends FieldValues = FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  rules?: object;
  accept?: string;
}

export function InputFile<T extends FieldValues = FieldValues>({ 
  label, 
  name, 
  register, 
  rules, 
  accept = "image/*" 
}: InputFileProps<T>) {
  return (
    <div className="relative w-full mt-3">
      <label
        htmlFor={name as string}
        className="block text-sm text-gray-700 font-medium mb-1"
      >
        {label}
      </label>
      <input
        {...register(name, rules)}
        type="file"
        id={name as string}
        accept={accept}
        className="block w-full text-sm text-gray-800
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-cyan-50 file:text-cyan-700
          hover:file:bg-cyan-100
          file:cursor-pointer cursor-pointer
          border border-gray-200 rounded-lg p-2"
      />
    </div>
  );
}
