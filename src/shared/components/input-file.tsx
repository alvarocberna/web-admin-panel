'use client'
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UseFormRegister, FieldValues, Path } from "react-hook-form";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface InputFileProps<T extends FieldValues = FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  rules?: object;
  accept?: string;
  currentImageUrl?: string | null;
}

export function InputFile<T extends FieldValues = FieldValues>({
  label,
  name,
  register,
  rules,
  accept = "image/jpeg,image/png",
  currentImageUrl,
}: InputFileProps<T>) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl ?? null);

  useEffect(() => {
    setPreview(currentImageUrl ?? null);
  }, [currentImageUrl]);

  const { onChange: registerOnChange, ...rest } = register(name, rules);

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
      {preview && (
        <div className="mb-2">
          <img
            src={preview}
            alt="Vista previa"
            className="h-20 w-20 object-cover rounded-lg border border-zinc-200"
          />
        </div>
      )}
      <input
        {...rest}
        type="file"
        id={name as string}
        accept={accept}
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            for (const file of Array.from(files)) {
              if (file.size > MAX_FILE_SIZE) {
                toast.error(`La imagen "${file.name}" supera el límite permitido de 5MB`);
                e.target.value = '';
                return;
              }
            }
            setPreview(URL.createObjectURL(files[0]));
          } else {
            setPreview(currentImageUrl ?? null);
          }
          registerOnChange(e);
        }}
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
