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
      {label && (
        <label
          htmlFor={name as string}
          className="block text-sm font-medium text-zinc-600 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        {...register(name, rules)}
        type="file"
        id={name as string}
        accept={accept}
        className="block w-full text-sm text-zinc-700
          file:mr-3 file:py-1.5 file:px-3
          file:rounded-md file:border-0
          file:text-sm file:font-medium
          file:bg-zinc-100 file:text-zinc-700
          hover:file:bg-zinc-200
          file:transition-colors file:duration-150
          file:cursor-pointer cursor-pointer
          border border-zinc-200 rounded-lg p-2"
      />
    </div>
  );
}
