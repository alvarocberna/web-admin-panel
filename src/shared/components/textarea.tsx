import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface InputFieldProps<T extends FieldValues = FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  rules?: object;
  defaultValue?: number | string;
}

export function TextAreaArt<T extends FieldValues = FieldValues>({ label, name, register, rules, defaultValue = "" }: InputFieldProps<T>) {
  return (
    <div className="relative w-full mt-3">
      <textarea
        {...register(name, rules)}
        id={name}
        className="block px-3 pb-2.5 pt-4 w-full text-sm text-zinc-900 bg-transparent border border-zinc-200 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer transition-colors duration-150 min-h-[120px] resize-y"
        placeholder=" "
        defaultValue={defaultValue}
      />
      <label
        htmlFor={name}
        className="absolute text-sm text-zinc-500 duration-150 transform -translate-y-4 scale-75 top-2 left-2 z-10 origin-[0] bg-white px-2
          peer-focus:px-2 peer-focus:text-blue-600
          peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2
          peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>
    </div>
  );
}
