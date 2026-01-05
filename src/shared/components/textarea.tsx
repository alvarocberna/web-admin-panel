//react
import { UseFormRegister } from "react-hook-form";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  register: UseFormRegister<any>; // recibe el register del form
  rules?: object; // reglas de validación
  defaultValue?: number | string; 
}

export function TextAreaArt({ label, name, type = "text", register, rules, defaultValue = "" }: InputFieldProps) {
  return (
    <div className="relative w-full mt-3">
      <textarea
        {...register(name, rules)}
        // type={type}
        id={name}
        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-800 bg-transparent border-b border-b-gray-400 appearance-none dark:focus:border-blue-primary focus:outline-none focus:ring-0 focus:border-primary peer"
        placeholder=" "
        defaultValue={defaultValue}
        {...((type === "number") ? { step: "0.1" } : {})}
      />
      <label
        htmlFor={name}
        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 left-2 z-10 origin-[0] px-2 
          peer-focus:px-2 peer-focus:text-primary peer-focus:dark:text-primary 
          peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
          peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>
    </div>
  );
}